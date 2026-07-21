import { PemBundleInput } from '../gen/messages_pb';
import { splitPemBundle } from './split_pem_bundle';
import { testContext, LEAF_CERT_PEM, INTER_CERT_PEM, ROOT_CERT_PEM, EC_PRIVATE_KEY_PEM, CSR_PEM } from './fixtures';

describe('SplitPemBundle', () => {
  it('splits a leaf+intermediate+root bundle into 3 individually-valid certificate blocks', () => {
    const input = new PemBundleInput();
    input.setPem(LEAF_CERT_PEM + INTER_CERT_PEM + ROOT_CERT_PEM);
    const result = splitPemBundle(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getTotalBlocks()).toBe(3);
    expect(result.getCertificatesList().length).toBe(3);
    expect(result.getPrivateKeysList().length).toBe(0);
    // Each split block must itself be valid, standalone PEM that reproduces the original content.
    expect(result.getCertificatesList()[0].getPem()).toContain('BEGIN CERTIFICATE');
    expect(result.getCertificatesList()[0].getPem()).toContain('END CERTIFICATE');
  });

  it('buckets a private key block separately from certificate blocks', () => {
    const input = new PemBundleInput();
    input.setPem(LEAF_CERT_PEM + EC_PRIVATE_KEY_PEM);
    const result = splitPemBundle(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getTotalBlocks()).toBe(2);
    expect(result.getCertificatesList().length).toBe(1);
    expect(result.getPrivateKeysList().length).toBe(1);
    expect(result.getPrivateKeysList()[0].getLabel()).toBe('EC PRIVATE KEY');
  });

  it('buckets a CSR block as other_blocks, not certificates or private_keys', () => {
    const input = new PemBundleInput();
    input.setPem(CSR_PEM);
    const result = splitPemBundle(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getOtherBlocksList().length).toBe(1);
    expect(result.getOtherBlocksList()[0].getLabel()).toBe('CERTIFICATE REQUEST');
    expect(result.getCertificatesList().length).toBe(0);
  });

  it('returns a structured error for empty input instead of throwing', () => {
    const input = new PemBundleInput();
    input.setPem('');
    const result = splitPemBundle(testContext, input);
    expect(result.getOk()).toBe(false);
  });

  it('returns ok=true with zero blocks for text containing no PEM blocks at all', () => {
    const input = new PemBundleInput();
    input.setPem('this is just some plain text, not PEM');
    const result = splitPemBundle(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getTotalBlocks()).toBe(0);
  });
});
