import { CertificateInput } from '../gen/messages_pb';
import { extractKeyUsage } from './extract_key_usage';
import { testContext, LEAF_CERT_PEM, LEAF_EXPECTED, INTER_CERT_PEM, INTER_EXPECTED, GARBAGE_PEM } from './fixtures';

describe('ExtractKeyUsage', () => {
  it('extracts the leaf certificate key usage + EKU, matching the openssl oracle', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractKeyUsage(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getPresent()).toBe(true);
    expect(result.getCritical()).toBe(true);
    expect(result.getKeyUsagesList().sort()).toEqual([...LEAF_EXPECTED.keyUsages].sort());
    expect(result.getEkuPresent()).toBe(true);
    expect(result.getExtendedKeyUsagesList().sort()).toEqual([...LEAF_EXPECTED.extendedKeyUsages].sort());
    expect(result.getAnyExtendedKeyUsage()).toBe(false);
  });

  it('extracts the intermediate CA key usage (keyCertSign, cRLSign)', () => {
    const input = new CertificateInput();
    input.setPem(INTER_CERT_PEM);
    const result = extractKeyUsage(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getPresent()).toBe(true);
    expect(result.getKeyUsagesList().sort()).toEqual([...INTER_EXPECTED.keyUsages].sort());
    expect(result.getEkuPresent()).toBe(false);
  });

  it('returns a structured error for malformed input instead of throwing', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = extractKeyUsage(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
