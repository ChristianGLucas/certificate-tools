import { CertificateInput } from '../gen/messages_pb';
import { extractExtensions } from './extract_extensions';
import { testContext, LEAF_CERT_PEM, GARBAGE_PEM } from './fixtures';

describe('ExtractExtensions', () => {
  it('lists every extension on the leaf certificate with the OIDs seen in the openssl oracle', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractExtensions(testContext, input);

    expect(result.getOk()).toBe(true);
    const oids = result.getExtensionsList().map((e) => e.getOid()).sort();
    // basicConstraints, keyUsage, extKeyUsage, subjectKeyIdentifier, authorityKeyIdentifier, subjectAltName
    expect(oids).toEqual(
      ['2.5.29.14', '2.5.29.15', '2.5.29.17', '2.5.29.19', '2.5.29.35', '2.5.29.37'].sort(),
    );
  });

  it('resolves friendly names for known extensions and a non-empty summary', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractExtensions(testContext, input);
    const san = result.getExtensionsList().find((e) => e.getOid() === '2.5.29.17')!;
    expect(san.getName()).toBe('subjectAltName');
    expect(san.getParsedSummary()).toContain('example.com');
    expect(san.getValueBase64().length).toBeGreaterThan(0);

    const bc = result.getExtensionsList().find((e) => e.getOid() === '2.5.29.19')!;
    expect(bc.getName()).toBe('basicConstraints');
    expect(bc.getParsedSummary()).toContain('CA=false');
  });

  it('never crashes — always returns ok=true with a (possibly empty) list, or a structured error', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = extractExtensions(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });
});
