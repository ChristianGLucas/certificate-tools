import { CertificateInput } from '../gen/messages_pb';
import { extractPublicKey } from './extract_public_key';
import { testContext, LEAF_CERT_PEM, LEAF_EXPECTED, EC_CERT_PEM, EC_EXPECTED, ED_CERT_PEM, ED_EXPECTED, GARBAGE_PEM } from './fixtures';

describe('ExtractPublicKey', () => {
  it('extracts an RSA-2048 public key, matching the openssl oracle', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractPublicKey(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getPublicKey()!.getAlgorithm()).toBe('RSA');
    expect(result.getPublicKey()!.getKeySizeBits()).toBe(LEAF_EXPECTED.keySizeBits);
    expect(result.getPublicKey()!.getPem()).toMatch(/^-----BEGIN PUBLIC KEY-----/);
  });

  it('extracts an EC P-256 public key with the correct curve', () => {
    const input = new CertificateInput();
    input.setPem(EC_CERT_PEM);
    const result = extractPublicKey(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getPublicKey()!.getAlgorithm()).toBe('EC');
    expect(result.getPublicKey()!.getCurve()).toBe(EC_EXPECTED.curve);
    expect(result.getPublicKey()!.getKeySizeBits()).toBe(EC_EXPECTED.keySizeBits);
  });

  it('extracts an Ed25519 public key', () => {
    const input = new CertificateInput();
    input.setPem(ED_CERT_PEM);
    const result = extractPublicKey(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getPublicKey()!.getAlgorithm()).toBe(ED_EXPECTED.algorithm);
    expect(result.getPublicKey()!.getKeySizeBits()).toBe(ED_EXPECTED.keySizeBits);
  });

  it('the exported PEM round-trips back to a key of the same size via Node crypto (independent oracle)', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractPublicKey(testContext, input);
    const { createPublicKey } = require('crypto');
    const keyObj = createPublicKey(result.getPublicKey()!.getPem());
    expect(keyObj.asymmetricKeyDetails?.modulusLength).toBe(LEAF_EXPECTED.keySizeBits);
  });

  it('returns a structured error for malformed input instead of throwing', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = extractPublicKey(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
