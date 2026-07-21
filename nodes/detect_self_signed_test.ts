import { CertificateInput } from '../gen/messages_pb';
import { detectSelfSigned } from './detect_self_signed';
import { testContext, ROOT_CERT_PEM, LEAF_CERT_PEM, GARBAGE_PEM } from './fixtures';

describe('DetectSelfSigned', () => {
  it('reports self_signed=true for the self-signed root CA (structural + real signature check)', async () => {
    const input = new CertificateInput();
    input.setPem(ROOT_CERT_PEM);
    const result = await detectSelfSigned(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getSubjectEqualsIssuer()).toBe(true);
    expect(result.getSignatureVerified()).toBe(true);
    expect(result.getSelfSigned()).toBe(true);
  });

  it('reports self_signed=false for a leaf certificate signed by a different issuer', async () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = await detectSelfSigned(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getSubjectEqualsIssuer()).toBe(false);
    expect(result.getSelfSigned()).toBe(false);
  });

  it('is deterministic across repeated invocations', async () => {
    const input = new CertificateInput();
    input.setPem(ROOT_CERT_PEM);
    const r1 = await detectSelfSigned(testContext, input);
    const r2 = await detectSelfSigned(testContext, input);
    expect(r1.getSelfSigned()).toBe(r2.getSelfSigned());
  });

  it('returns a structured error for malformed input instead of throwing', async () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = await detectSelfSigned(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
