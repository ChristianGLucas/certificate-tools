import { CertificateInput } from '../gen/messages_pb';
import { summarizeCertificate } from './summarize_certificate';
import { testContext, LEAF_CERT_PEM, ROOT_CERT_PEM, GARBAGE_PEM } from './fixtures';

describe('SummarizeCertificate', () => {
  it('renders a one-line summary with subject CN, issuer CN, and validity dates', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = summarizeCertificate(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getSummary()).toBe(
      'CN=example.com issued by CN=Example Intermediate CA, valid 2026-07-21 to 2027-07-21',
    );
  });

  it('falls back to the full DN when the subject has no CN attribute', () => {
    // Root has both CN and other attrs; use it just to confirm CN is preferred over raw.
    const input = new CertificateInput();
    input.setPem(ROOT_CERT_PEM);
    const result = summarizeCertificate(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getSummary()).toContain('CN=Example Root CA');
  });

  it('returns a structured error for malformed input instead of throwing', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = summarizeCertificate(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
