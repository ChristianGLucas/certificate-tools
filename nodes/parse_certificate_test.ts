import { CertificateInput } from '../gen/messages_pb';
import { parseCertificate } from './parse_certificate';
import { testContext, LEAF_CERT_PEM, LEAF_EXPECTED, ROOT_CERT_PEM, ROOT_EXPECTED, GARBAGE_PEM } from './fixtures';

describe('ParseCertificate', () => {
  it('parses the leaf certificate and matches the openssl-derived oracle values', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = parseCertificate(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getVersion()).toBe(3);
    expect(result.getSerialNumberHex()).toBe(LEAF_EXPECTED.serialHex);
    expect(result.getSubject()!.getRaw()).toBe(LEAF_EXPECTED.subjectRaw);
    expect(result.getIssuer()!.getRaw()).toBe(LEAF_EXPECTED.issuerRaw);
    expect(result.getNotBefore()).toBe(LEAF_EXPECTED.notBefore);
    expect(result.getNotAfter()).toBe(LEAF_EXPECTED.notAfter);
    expect(result.getSignatureAlgorithm()).toBe('SHA-256withRSA');
    expect(result.getPublicKey()!.getAlgorithm()).toBe('RSA');
    expect(result.getPublicKey()!.getKeySizeBits()).toBe(LEAF_EXPECTED.keySizeBits);
    expect(result.getPublicKey()!.getPem()).toContain('BEGIN PUBLIC KEY');
  });

  it('parses subject attributes into structured DnAttribute entries', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = parseCertificate(testContext, input);
    const attrs = result.getSubject()!.getAttributesList();
    const cn = attrs.find((a) => a.getShortName() === 'CN');
    const o = attrs.find((a) => a.getShortName() === 'O');
    expect(cn?.getValue()).toBe('example.com');
    expect(cn?.getOid()).toBe('2.5.4.3');
    expect(o?.getValue()).toBe('Example Inc');
  });

  it('reports a self-signed root correctly (subject == issuer, RFC 4514-ish raw string)', () => {
    const input = new CertificateInput();
    input.setPem(ROOT_CERT_PEM);
    const result = parseCertificate(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getSubject()!.getRaw()).toBe(ROOT_EXPECTED.subjectRaw);
    expect(result.getIssuer()!.getRaw()).toBe(ROOT_EXPECTED.issuerRaw);
    expect(result.getNotBefore()).toBe(ROOT_EXPECTED.notBefore);
    expect(result.getNotAfter()).toBe(ROOT_EXPECTED.notAfter);
  });

  it('is deterministic across repeated invocations on the same input', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const r1 = parseCertificate(testContext, input);
    const r2 = parseCertificate(testContext, input);
    expect(r1.getSerialNumberHex()).toBe(r2.getSerialNumberHex());
    expect(r1.getSubject()!.getRaw()).toBe(r2.getSubject()!.getRaw());
  });

  it('returns a structured error for malformed PEM instead of throwing', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = parseCertificate(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('returns a structured error when neither pem nor der_base64 is supplied', () => {
    const input = new CertificateInput();
    const result = parseCertificate(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError()).toContain('pem or der_base64');
  });

  it('accepts der_base64 input and produces the same result as the equivalent PEM', () => {
    // Strip PEM armor/newlines to obtain the base64 DER body.
    const derBase64 = LEAF_CERT_PEM.replace(/-----BEGIN CERTIFICATE-----/, '')
      .replace(/-----END CERTIFICATE-----/, '')
      .replace(/\s+/g, '');
    const derInput = new CertificateInput();
    derInput.setDerBase64(derBase64);
    const fromDer = parseCertificate(testContext, derInput);

    const pemInput = new CertificateInput();
    pemInput.setPem(LEAF_CERT_PEM);
    const fromPem = parseCertificate(testContext, pemInput);

    expect(fromDer.getOk()).toBe(true);
    expect(fromDer.getSerialNumberHex()).toBe(fromPem.getSerialNumberHex());
    expect(fromDer.getSubject()!.getRaw()).toBe(fromPem.getSubject()!.getRaw());
  });
});
