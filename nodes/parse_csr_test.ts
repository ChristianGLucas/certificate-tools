import { CsrInput } from '../gen/messages_pb';
import { parseCsr } from './parse_csr';
import { testContext, CSR_PEM, CSR_EXPECTED, GARBAGE_PEM } from './fixtures';

describe('ParseCsr', () => {
  it('parses subject, public key, and requested SANs, matching the openssl oracle', async () => {
    const input = new CsrInput();
    input.setPem(CSR_PEM);
    const result = await parseCsr(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getSubject()!.getRaw()).toBe(CSR_EXPECTED.subjectRaw);
    expect(result.getPublicKey()!.getAlgorithm()).toBe('RSA');
    expect(result.getPublicKey()!.getKeySizeBits()).toBe(CSR_EXPECTED.keySizeBits);
    expect(result.getSignatureValid()).toBe(true);
    expect(result.getHasRequestedSans()).toBe(true);
    expect(result.getRequestedSans()!.getDnsNamesList()).toEqual(CSR_EXPECTED.sanDnsNames);
  });

  it('is deterministic across repeated invocations', async () => {
    const input = new CsrInput();
    input.setPem(CSR_PEM);
    const r1 = await parseCsr(testContext, input);
    const r2 = await parseCsr(testContext, input);
    expect(r1.getSignatureValid()).toBe(r2.getSignatureValid());
    expect(r1.getSubject()!.getRaw()).toBe(r2.getSubject()!.getRaw());
  });

  it('returns a structured error for malformed input instead of throwing', async () => {
    const input = new CsrInput();
    input.setPem(GARBAGE_PEM.replace('CERTIFICATE', 'CERTIFICATE REQUEST'));
    const result = await parseCsr(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('returns a structured error when neither pem nor der_base64 is supplied', async () => {
    const input = new CsrInput();
    const result = await parseCsr(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
