import { CertificateInput } from '../gen/messages_pb';
import { extractKeyIdentifiers } from './extract_key_identifiers';
import { testContext, LEAF_CERT_PEM, LEAF_EXPECTED, ROOT_CERT_PEM, GARBAGE_PEM } from './fixtures';

describe('ExtractKeyIdentifiers', () => {
  it('extracts SKI and AKI hex matching the openssl oracle for the leaf certificate', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractKeyIdentifiers(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getSkiPresent()).toBe(true);
    expect(result.getSkiHex()).toBe(LEAF_EXPECTED.skiHex);
    expect(result.getAkiPresent()).toBe(true);
    expect(result.getAkiHasKeyId()).toBe(true);
    expect(result.getAkiKeyIdHex()).toBe(LEAF_EXPECTED.akiHex);
  });

  it("leaf's AKI equals its issuer (intermediate)'s SKI — proves chain-linking by key ID", () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractKeyIdentifiers(testContext, input);
    // From fixtures.ts: INTER_EXPECTED.skiHex was independently read off openssl output too.
    expect(result.getAkiKeyIdHex()).toBe('e0019af6ecd1dd01c19e956f4539ce01a69063e5');
  });

  it('reports a self-referential SKI/AKI pair for the self-signed root (openssl default v3_ca extensions)', () => {
    // openssl's default `-x509` self-sign path attaches SKI and a self-referential AKI;
    // for a self-signed CA both key identifiers point at the same key, so they're equal.
    const input = new CertificateInput();
    input.setPem(ROOT_CERT_PEM);
    const result = extractKeyIdentifiers(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getSkiPresent()).toBe(true);
    expect(result.getAkiPresent()).toBe(true);
    expect(result.getSkiHex()).toBe(result.getAkiKeyIdHex());
    expect(result.getSkiHex()).toBe('5f2611eafd4ec166780e4d3d0b062c4a60e5db66');
  });

  it('returns a structured error for malformed input instead of throwing', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = extractKeyIdentifiers(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
