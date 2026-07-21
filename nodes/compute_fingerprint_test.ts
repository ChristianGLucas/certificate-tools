import { createHash } from 'crypto';
import { CertificateInput } from '../gen/messages_pb';
import { computeFingerprint } from './compute_fingerprint';
import { testContext, LEAF_CERT_PEM, LEAF_EXPECTED, GARBAGE_PEM } from './fixtures';

describe('ComputeFingerprint', () => {
  it('computes SHA-1/SHA-256 fingerprints matching the openssl oracle', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = computeFingerprint(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getSha1Hex()).toBe(LEAF_EXPECTED.sha1Fingerprint);
    expect(result.getSha256Hex()).toBe(LEAF_EXPECTED.sha256Fingerprint);
  });

  it('reports hex and base64 forms that decode to the same bytes (self-consistency)', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = computeFingerprint(testContext, input);
    expect(Buffer.from(result.getSha256Base64(), 'base64').toString('hex')).toBe(result.getSha256Hex());
  });

  it('matches an independently-computed Node crypto digest over the raw DER (second oracle)', () => {
    const der = LEAF_CERT_PEM.replace(/-----BEGIN CERTIFICATE-----/, '')
      .replace(/-----END CERTIFICATE-----/, '')
      .replace(/\s+/g, '');
    const derBuf = Buffer.from(der, 'base64');
    const expectedSha256 = createHash('sha256').update(derBuf).digest('hex');

    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = computeFingerprint(testContext, input);
    expect(result.getSha256Hex()).toBe(expectedSha256);
  });

  it('returns a structured error for malformed input instead of throwing', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = computeFingerprint(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
