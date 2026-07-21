// Shared helpers for every node in this package. All X.509/CSR parsing goes through
// here so the "decode → bound → parse → structure" contract stays identical everywhere.
//
// IMPORTANT: @peculiar/x509 depends on tsyringe for DI, which requires the
// reflect-metadata polyfill to be imported before any @peculiar/x509 code runs.
// This import must stay first in this file.
import 'reflect-metadata';

import * as x509 from '@peculiar/x509';
import { AsnConvert } from '@peculiar/asn1-schema';
import { Certificate as AsnCertificate, Extensions as AsnExtensions } from '@peculiar/asn1-x509';
import { CertificationRequest as AsnCsr } from '@peculiar/asn1-csr';

import {
  CertificateInput,
  Certificate,
  CsrInput,
  DistinguishedName,
  DnAttribute,
  PublicKeyInfo,
  SubjectAltNames,
  PemBlock,
} from '../gen/messages_pb';

// ---- Bounds (input → cost) --------------------------------------------------------
// A single certificate or CSR, PEM or DER. Real-world certs (even with many SANs or a
// large RSA key) are a few KiB; 1 MiB is generous headroom while still bounding cost.
export const MAX_CERT_BYTES = 1 * 1024 * 1024;
// A PEM bundle can legitimately hold a handful of certificates (leaf+intermediates)
// or a combined cert+key file; 5 MiB comfortably covers any realistic bundle.
export const MAX_BUNDLE_BYTES = 5 * 1024 * 1024;
// A caller-supplied chain is a list of whole certificates; bound the list length
// itself (independent of each certificate's own byte bound) so a pathological
// caller cannot force parsing thousands of certificates in one call.
export const MAX_CHAIN_CERTS = 64;

export class CertError extends Error {}

// ---- PEM/DER decoding (input → interpretation) -------------------------------------

/** Decode a CertificateInput/CsrInput-shaped (pem, der_base64) pair into a raw DER ArrayBuffer. */
export function decodeDer(pem: string, derBase64: string, maxBytes = MAX_CERT_BYTES): ArrayBuffer {
  const hasPem = typeof pem === 'string' && pem.trim().length > 0;
  const hasDer = typeof derBase64 === 'string' && derBase64.trim().length > 0;
  if (!hasPem && !hasDer) {
    throw new CertError('one of pem or der_base64 must be supplied');
  }
  if (hasPem && pem.length > maxBytes) {
    throw new CertError('pem input exceeds the maximum allowed size');
  }
  if (hasDer && derBase64.length > maxBytes * 2) {
    // base64 expands ~4/3; a generous ceiling on the encoded string before we even decode it
    throw new CertError('der_base64 input exceeds the maximum allowed size');
  }
  try {
    if (hasPem) {
      // Reject anything that isn't a plausible single PEM block up front — a caller who
      // passes arbitrary text here should get a structured error, not whatever PemConverter
      // happens to do with it.
      if (!/-----BEGIN [A-Z0-9 ]+-----/.test(pem)) {
        throw new CertError('pem does not contain a PEM block');
      }
      const decoded = x509.PemConverter.decode(pem);
      if (!decoded.length) {
        throw new CertError('pem did not decode to any DER data');
      }
      return decoded[0];
    }
    const buf = Buffer.from(derBase64, 'base64');
    if (buf.length === 0) {
      throw new CertError('der_base64 did not decode to any bytes');
    }
    if (buf.length > maxBytes) {
      throw new CertError('decoded DER exceeds the maximum allowed size');
    }
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } catch (e) {
    if (e instanceof CertError) throw e;
    throw new CertError(`failed to decode input: ${(e as Error).message}`);
  }
}

export function loadCertificate(input: CertificateInput): { cert: x509.X509Certificate; der: ArrayBuffer } {
  const der = decodeDer(input.getPem(), input.getDerBase64());
  try {
    return { cert: new x509.X509Certificate(der), der };
  } catch (e) {
    throw new CertError(`failed to parse X.509 certificate: ${(e as Error).message}`);
  }
}

export function loadCsr(input: CsrInput): { csr: x509.Pkcs10CertificateRequest; der: ArrayBuffer } {
  const der = decodeDer(input.getPem(), input.getDerBase64());
  try {
    return { csr: new x509.Pkcs10CertificateRequest(der), der };
  } catch (e) {
    throw new CertError(`failed to parse PKCS#10 CSR: ${(e as Error).message}`);
  }
}

// ---- Generic (non-throwing) extension access ---------------------------------------
//
// @peculiar/x509's high-level `.extensions` getter eagerly constructs a TYPED subclass
// for every recognized extension (SubjectAlternativeNameExtension, etc.) and throws if
// ANY single extension's typed construction fails (e.g. a SAN containing an otherName/
// x400Address/ediPartyName GeneralName, which this library's GeneralName class does not
// support). Because that getter is cached, one bad extension permanently breaks ALL
// extension access on that certificate instance — including extensions that have
// nothing to do with the bad one. We therefore always go through this generic, raw
// decode (which never invokes the throwing typed factory) and only construct a typed
// extension class ourselves, per OID, when a specific node needs one — isolating a
// single extension's decode failure to just that extension.

export interface RawExtension {
  oid: string;
  critical: boolean;
  valueBytes: ArrayBuffer;
}

export function getRawExtensions(der: ArrayBuffer): RawExtension[] {
  const asnCert = AsnConvert.parse(der, AsnCertificate);
  const exts = asnCert.tbsCertificate.extensions ?? [];
  return exts.map((e) => ({ oid: e.extnID, critical: e.critical, valueBytes: e.extnValue.buffer }));
}

export function getVersion(der: ArrayBuffer): number {
  const asnCert = AsnConvert.parse(der, AsnCertificate);
  return asnCert.tbsCertificate.version + 1;
}

const EXTENSION_REQUEST_OID = '1.2.840.113549.1.9.14';

export function getRawCsrExtensions(der: ArrayBuffer): RawExtension[] {
  const asnCsr = AsnConvert.parse(der, AsnCsr);
  const attrs = asnCsr.certificationRequestInfo.attributes ?? [];
  const extReq = attrs.find((a) => a.type === EXTENSION_REQUEST_OID);
  if (!extReq || !extReq.values.length) return [];
  const extensions = AsnConvert.parse(extReq.values[0], AsnExtensions);
  return extensions.map((e) => ({ oid: e.extnID, critical: e.critical, valueBytes: e.extnValue.buffer }));
}

function typedExtension<T extends x509.Extension>(
  raw: RawExtension,
  Ctor: new (raw: BufferSource) => T,
): T {
  const generic = new x509.Extension(raw.oid, raw.critical, raw.valueBytes);
  return new Ctor(generic.rawData);
}

// ---- Distinguished Name → structured attributes ------------------------------------

// Short-name → OID for the attribute types actually seen in real certificates. Not
// exhaustive — an attribute whose short name isn't in this table still gets its raw
// value through `raw`/DnAttribute.value; only the `oid` convenience field is empty.
const SHORTNAME_TO_OID: Record<string, string> = {
  CN: '2.5.4.3',
  C: '2.5.4.6',
  L: '2.5.4.7',
  ST: '2.5.4.8',
  STREET: '2.5.4.9',
  O: '2.5.4.10',
  OU: '2.5.4.11',
  T: '2.5.4.12',
  title: '2.5.4.12',
  SN: '2.5.4.4',
  GN: '2.5.4.42',
  initials: '2.5.4.43',
  generationQualifier: '2.5.4.44',
  serialNumber: '2.5.4.5',
  pseudonym: '2.5.4.65',
  DC: '0.9.2342.19200300.100.1.25',
  UID: '0.9.2342.19200300.100.1.1',
  E: '1.2.840.113549.1.9.1',
  emailAddress: '1.2.840.113549.1.9.1',
  dnQualifier: '2.5.4.46',
  name: '2.5.4.41',
  postalCode: '2.5.4.17',
  description: '2.5.4.13',
};
const OID_RE = /^\d+(\.\d+)+$/;

export function buildDn(name: x509.Name): DistinguishedName {
  const dn = new DistinguishedName();
  dn.setRaw(name.toString());
  const attrs: DnAttribute[] = [];
  for (const rdn of name.toJSON()) {
    for (const [key, values] of Object.entries(rdn)) {
      for (const value of values as string[]) {
        const attr = new DnAttribute();
        const isOid = OID_RE.test(key);
        attr.setOid(isOid ? key : SHORTNAME_TO_OID[key] ?? '');
        attr.setShortName(isOid ? '' : key);
        attr.setValue(value);
        attrs.push(attr);
      }
    }
  }
  dn.setAttributesList(attrs);
  return dn;
}

// ---- Public key → structured info ---------------------------------------------------

const CURVE_BITS: Record<string, number> = { 'P-256': 256, 'P-384': 384, 'P-521': 521, 'K-256': 256 };

export function buildPublicKeyInfo(pk: x509.PublicKey): PublicKeyInfo {
  const info = new PublicKeyInfo();
  const alg = pk.algorithm as { name?: string; modulusLength?: number; namedCurve?: string };
  let algorithm = alg.name ?? 'UNKNOWN';
  let keySizeBits = 0;
  let curve = '';
  switch (alg.name) {
    case 'RSASSA-PKCS1-v1_5':
    case 'RSA-PSS':
    case 'RSA-OAEP':
      algorithm = 'RSA';
      keySizeBits = alg.modulusLength ?? 0;
      break;
    case 'ECDSA':
    case 'ECDH':
      algorithm = 'EC';
      curve = alg.namedCurve ?? '';
      keySizeBits = CURVE_BITS[curve] ?? 0;
      break;
    case 'Ed25519':
      keySizeBits = 256;
      break;
    case 'Ed448':
      keySizeBits = 448;
      break;
    case 'X25519':
      keySizeBits = 256;
      break;
    case 'X448':
      keySizeBits = 448;
      break;
    default:
      // DSA and any algorithm WebCrypto doesn't recognize: report the name we have,
      // no size — still a structured, non-crashing result.
      break;
  }
  info.setAlgorithm(algorithm);
  info.setKeySizeBits(keySizeBits);
  info.setCurve(curve);
  info.setPem(pk.toString('pem'));
  return info;
}

// ---- Dates ----------------------------------------------------------------------------

export function isoUtc(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// ---- Full Certificate message (shared by ParseCertificate and ParseChain) -------------

export function describeSignatureAlgorithm(alg: { name?: string; hash?: { name?: string } }): string {
  if (!alg || !alg.name) return 'UNKNOWN';
  if (alg.hash && alg.hash.name) return `${alg.hash.name}with${sigShortName(alg.name)}`;
  return alg.name;
}

function sigShortName(name: string): string {
  switch (name) {
    case 'RSASSA-PKCS1-v1_5':
      return 'RSA';
    case 'RSA-PSS':
      return 'RSA-PSS';
    case 'ECDSA':
      return 'ECDSA';
    default:
      return name;
  }
}

/** Build the full structured Certificate message for an already-loaded certificate. */
export function buildCertificateMessage(cert: x509.X509Certificate, der: ArrayBuffer): Certificate {
  const out = new Certificate();
  out.setOk(true);
  out.setVersion(getVersion(der));
  out.setSerialNumberHex(cert.serialNumber);
  out.setSubject(buildDn(cert.subjectName));
  out.setIssuer(buildDn(cert.issuerName));
  out.setNotBefore(isoUtc(cert.notBefore));
  out.setNotAfter(isoUtc(cert.notAfter));
  out.setSignatureAlgorithm(describeSignatureAlgorithm(cert.signatureAlgorithm));
  out.setPublicKey(buildPublicKeyInfo(cert.publicKey));
  return out;
}

// ---- Subject Alternative Names -------------------------------------------------------

export function buildSans(raw: RawExtension | undefined): { sans: SubjectAltNames; present: boolean } {
  const sans = new SubjectAltNames();
  if (!raw) return { sans, present: false };
  try {
    const typed = typedExtension(raw, x509.SubjectAlternativeNameExtension);
    const dns: string[] = [];
    const ip: string[] = [];
    const email: string[] = [];
    const uri: string[] = [];
    const other: string[] = [];
    for (const gn of typed.names.items) {
      switch (gn.type) {
        case 'dns':
          dns.push(gn.value);
          break;
        case 'email':
          email.push(gn.value);
          break;
        case 'ip':
          ip.push(gn.value);
          break;
        case 'url':
          uri.push(gn.value);
          break;
        default:
          other.push(`${gn.type}:${gn.value}`);
      }
    }
    sans.setDnsNamesList(dns);
    sans.setIpAddressesList(ip);
    sans.setEmailsList(email);
    sans.setUrisList(uri);
    sans.setOtherList(other);
  } catch (e) {
    // A SAN containing a GeneralName form this library's GeneralName class does not
    // support (otherName, x400Address, ediPartyName) — valid X.509, just not decodable
    // here. Report the extension as present but undecoded rather than crashing.
    sans.setOtherList([
      `undecodable: SAN extension present but contains a GeneralName form this parser cannot decode (${
        (e as Error).message
      })`,
    ]);
  }
  return { sans, present: true };
}

// ---- Key Usage / Extended Key Usage ---------------------------------------------------

const KEY_USAGE_BITS: [number, string][] = [
  [1, 'digitalSignature'],
  [2, 'nonRepudiation'],
  [4, 'keyEncipherment'],
  [8, 'dataEncipherment'],
  [16, 'keyAgreement'],
  [32, 'keyCertSign'],
  [64, 'cRLSign'],
  [128, 'encipherOnly'],
  [256, 'decipherOnly'],
];

export function buildKeyUsage(raw: RawExtension): string[] {
  const typed = typedExtension(raw, x509.KeyUsagesExtension);
  const flags = typed.usages as unknown as number;
  return KEY_USAGE_BITS.filter(([bit]) => (flags & bit) !== 0).map(([, name]) => name);
}

const EKU_NAMES: Record<string, string> = {
  '1.3.6.1.5.5.7.3.1': 'serverAuth',
  '1.3.6.1.5.5.7.3.2': 'clientAuth',
  '1.3.6.1.5.5.7.3.3': 'codeSigning',
  '1.3.6.1.5.5.7.3.4': 'emailProtection',
  '1.3.6.1.5.5.7.3.8': 'timeStamping',
  '1.3.6.1.5.5.7.3.9': 'ocspSigning',
  '2.5.29.37.0': 'anyExtendedKeyUsage',
};
export const ANY_EKU_OID = '2.5.29.37.0';

export function buildEku(raw: RawExtension): { names: string[]; any: boolean } {
  const typed = typedExtension(raw, x509.ExtendedKeyUsageExtension);
  const oids = typed.usages as unknown as string[];
  return { names: oids.map((oid) => EKU_NAMES[oid] ?? oid), any: oids.includes(ANY_EKU_OID) };
}

// ---- Basic Constraints -----------------------------------------------------------------

export function buildBasicConstraints(raw: RawExtension): { isCa: boolean; hasPathLen: boolean; pathLen: number } {
  const typed = typedExtension(raw, x509.BasicConstraintsExtension);
  return { isCa: typed.ca, hasPathLen: typed.pathLength !== undefined, pathLen: typed.pathLength ?? 0 };
}

// ---- Subject / Authority Key Identifier -------------------------------------------------

export function buildSki(raw: RawExtension): string {
  return typedExtension(raw, x509.SubjectKeyIdentifierExtension).keyId;
}

export function buildAki(raw: RawExtension): { hasKeyId: boolean; keyIdHex: string } {
  const typed = typedExtension(raw, x509.AuthorityKeyIdentifierExtension);
  return { hasKeyId: !!typed.keyId, keyIdHex: typed.keyId ?? '' };
}

// ---- Generic extension listing (ExtractExtensions) ---------------------------------------

const EXT_NAMES: Record<string, string> = {
  '2.5.29.14': 'subjectKeyIdentifier',
  '2.5.29.15': 'keyUsage',
  '2.5.29.17': 'subjectAltName',
  '2.5.29.18': 'issuerAltName',
  '2.5.29.19': 'basicConstraints',
  '2.5.29.20': 'cRLNumber',
  '2.5.29.21': 'cRLReason',
  '2.5.29.24': 'invalidityDate',
  '2.5.29.28': 'issuingDistributionPoint',
  '2.5.29.30': 'nameConstraints',
  '2.5.29.31': 'cRLDistributionPoints',
  '2.5.29.32': 'certificatePolicies',
  '2.5.29.33': 'policyMappings',
  '2.5.29.35': 'authorityKeyIdentifier',
  '2.5.29.36': 'policyConstraints',
  '2.5.29.37': 'extKeyUsage',
  '1.3.6.1.5.5.7.1.1': 'authorityInfoAccess',
  '1.3.6.1.4.1.11129.2.4.2': 'signedCertificateTimestampList',
};

export function extensionFriendlyName(oid: string): string {
  return EXT_NAMES[oid] ?? '';
}

export function summarizeExtension(raw: RawExtension): string {
  try {
    switch (raw.oid) {
      case '2.5.29.19': {
        const bc = buildBasicConstraints(raw);
        return `CA=${bc.isCa}${bc.hasPathLen ? `, pathLen=${bc.pathLen}` : ''}`;
      }
      case '2.5.29.15':
        return buildKeyUsage(raw).join(', ');
      case '2.5.29.37':
        return buildEku(raw).names.join(', ');
      case '2.5.29.17': {
        const { sans } = buildSans(raw);
        return [
          ...sans.getDnsNamesList(),
          ...sans.getIpAddressesList(),
          ...sans.getEmailsList(),
          ...sans.getUrisList(),
        ].join(', ');
      }
      case '2.5.29.14':
        return buildSki(raw);
      case '2.5.29.35':
        return buildAki(raw).keyIdHex;
      default:
        return '';
    }
  } catch {
    return '';
  }
}

// ---- PEM bundle splitting (pure text, no ASN.1 decoding) -----------------------------

const PEM_BLOCK_RE = /-----BEGIN ([A-Z0-9 ]+)-----\r?\n([\s\S]*?)-----END \1-----/g;

export function splitPemBundle(pemText: string): PemBlock[] {
  const blocks: PemBlock[] = [];
  PEM_BLOCK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = PEM_BLOCK_RE.exec(pemText)) !== null) {
    const label = m[1].trim();
    const body = m[2].trim();
    const block = new PemBlock();
    block.setLabel(label);
    block.setPem(`-----BEGIN ${label}-----\n${body}\n-----END ${label}-----\n`);
    blocks.push(block);
  }
  return blocks;
}
