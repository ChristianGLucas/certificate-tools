import { CertificateInput } from '../gen/messages_pb';
import { extractSans } from './extract_sans';
import { testContext, LEAF_CERT_PEM, LEAF_EXPECTED, ROOT_CERT_PEM, GARBAGE_PEM } from './fixtures';

describe('ExtractSans', () => {
  it('extracts DNS/IP/email/URI SANs from the leaf certificate, matching the openssl oracle', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractSans(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getPresent()).toBe(true);
    const sans = result.getSans()!;
    expect(sans.getDnsNamesList()).toEqual(LEAF_EXPECTED.sanDnsNames);
    expect(sans.getIpAddressesList()).toEqual(LEAF_EXPECTED.sanIps);
    expect(sans.getEmailsList()).toEqual(LEAF_EXPECTED.sanEmails);
    expect(sans.getUrisList()).toEqual(LEAF_EXPECTED.sanUris);
  });

  it('reports present=false, not an error, when the certificate has no SAN extension', () => {
    const input = new CertificateInput();
    input.setPem(ROOT_CERT_PEM);
    const result = extractSans(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getPresent()).toBe(false);
  });

  it('returns a structured error for malformed input instead of throwing', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = extractSans(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });
});
