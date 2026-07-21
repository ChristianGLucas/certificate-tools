import { CertificateInput, ValidityInput } from '../gen/messages_pb';
import { checkValidity } from './check_validity';
import { testContext, LEAF_CERT_PEM, LEAF_EXPECTED, GARBAGE_PEM } from './fixtures';

function makeInput(nowIso: string): ValidityInput {
  const cert = new CertificateInput();
  cert.setPem(LEAF_CERT_PEM);
  const input = new ValidityInput();
  input.setCertificate(cert);
  input.setNowUnixSeconds(Math.floor(Date.parse(nowIso) / 1000));
  return input;
}

describe('CheckValidity', () => {
  it('reports valid=true for a caller-supplied now inside the validity window', () => {
    const now = '2026-08-01T00:00:00Z';
    const result = checkValidity(testContext, makeInput(now));
    expect(result.getOk()).toBe(true);
    expect(result.getExpired()).toBe(false);
    expect(result.getNotYetValid()).toBe(false);
    expect(result.getValid()).toBe(true);
    // Independently computed (not via the node's own code) days-remaining oracle.
    const expectedDays = Math.floor(
      (Date.parse(LEAF_EXPECTED.notAfter) - Date.parse(now)) / 86400000,
    );
    expect(result.getDaysRemaining()).toBe(expectedDays);
  });

  it('reports not_yet_valid=true for a now before notBefore', () => {
    const result = checkValidity(testContext, makeInput('2020-01-01T00:00:00Z'));
    expect(result.getOk()).toBe(true);
    expect(result.getNotYetValid()).toBe(true);
    expect(result.getValid()).toBe(false);
  });

  it('reports expired=true and negative days_remaining for a now after notAfter', () => {
    const result = checkValidity(testContext, makeInput('2030-01-01T00:00:00Z'));
    expect(result.getOk()).toBe(true);
    expect(result.getExpired()).toBe(true);
    expect(result.getValid()).toBe(false);
    expect(result.getDaysRemaining()).toBeLessThan(0);
  });

  it('is exactly reproducible for the same now — never reads the system clock', () => {
    const a = checkValidity(testContext, makeInput('2026-09-01T00:00:00Z'));
    const b = checkValidity(testContext, makeInput('2026-09-01T00:00:00Z'));
    expect(a.getDaysRemaining()).toBe(b.getDaysRemaining());
    expect(a.getValid()).toBe(b.getValid());
  });

  it('returns a structured error for malformed input instead of throwing', () => {
    const cert = new CertificateInput();
    cert.setPem(GARBAGE_PEM);
    const input = new ValidityInput();
    input.setCertificate(cert);
    input.setNowUnixSeconds(1700000000);
    const result = checkValidity(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
