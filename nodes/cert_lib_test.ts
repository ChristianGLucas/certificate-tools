// Unit tests for the shared cert_lib helpers themselves — in particular the
// crash-safety guarantee that motivated cert_lib's generic (non-throwing) extension
// access: a SAN containing a GeneralName form @peculiar/x509's GeneralName class does
// not support (otherName, x400Address, ediPartyName) must degrade gracefully, not
// crash the node.
import 'reflect-metadata';
import * as asn1js from 'asn1js';
import * as x509 from '@peculiar/x509';
import { buildSans, buildDn, splitPemBundle, RawExtension } from './cert_lib';

const SAN_OID = '2.5.29.17';

function buildOtherNameSanExtension(): RawExtension {
  // GeneralName ::= CHOICE { otherName [0] ..., dNSName [2] IMPLICIT IA5String, ... }
  // Hand-build a GeneralNames SEQUENCE containing an otherName entry (which
  // @peculiar/x509's GeneralName class explicitly does not support — see its
  // onInit's documented "throws ... for otherName, X400 address, EDI party name")
  // followed by an ordinary, well-formed dNSName entry.
  const otherNameBlock = new asn1js.Constructed({
    idBlock: { tagClass: 3, tagNumber: 0 },
    value: [new asn1js.Utf8String({ value: 'user@example.com' })],
  });
  const dnsBlock = new asn1js.Primitive({
    idBlock: { tagClass: 3, tagNumber: 2 },
    valueHex: Buffer.from('example.com'),
  });
  const generalNames = new asn1js.Sequence({ value: [otherNameBlock, dnsBlock] });
  const extnValueDer = generalNames.toBER(false);
  const extension = new x509.Extension(SAN_OID, false, extnValueDer);
  return { oid: SAN_OID, critical: false, valueBytes: extension.value };
}

describe('cert_lib.buildSans crash-safety', () => {
  it('does not throw for a SAN containing an unsupported GeneralName form (otherName)', () => {
    const raw = buildOtherNameSanExtension();
    expect(() => buildSans(raw)).not.toThrow();
  });

  it('reports the SAN extension as present but undecoded rather than silently dropping it', () => {
    const raw = buildOtherNameSanExtension();
    const { sans, present } = buildSans(raw);
    expect(present).toBe(true);
    expect(sans.getDnsNamesList()).toEqual([]);
    expect(sans.getOtherList().length).toBeGreaterThan(0);
    expect(sans.getOtherList()[0]).toContain('undecodable');
  });

  it('returns present=false, not a throw, when no SAN extension is given at all', () => {
    expect(() => buildSans(undefined)).not.toThrow();
    const { present } = buildSans(undefined);
    expect(present).toBe(false);
  });
});

describe('cert_lib.buildDn', () => {
  it('maps well-known short names to their OID', () => {
    const name = new x509.Name('CN=test.example.com,O=Example,C=US');
    const dn = buildDn(name);
    const cn = dn.getAttributesList().find((a) => a.getShortName() === 'CN');
    expect(cn?.getOid()).toBe('2.5.4.3');
    expect(cn?.getValue()).toBe('test.example.com');
  });
});

describe('cert_lib.splitPemBundle', () => {
  it('returns an empty list for text with no PEM blocks, without throwing', () => {
    expect(() => splitPemBundle('no pem here')).not.toThrow();
    expect(splitPemBundle('no pem here')).toEqual([]);
  });

  it('does not hang or misbehave on a very large non-PEM input (ReDoS/perf smoke check)', () => {
    const bigInput = 'x'.repeat(2_000_000);
    const start = Date.now();
    const blocks = splitPemBundle(bigInput);
    expect(blocks).toEqual([]);
    expect(Date.now() - start).toBeLessThan(2000);
  });
});
