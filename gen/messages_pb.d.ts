// package: christiangeorgelucas.certificate_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class CertificateInput extends jspb.Message {
  getPem(): string;
  setPem(value: string): void;

  getDerBase64(): string;
  setDerBase64(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CertificateInput.AsObject;
  static toObject(includeInstance: boolean, msg: CertificateInput): CertificateInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CertificateInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CertificateInput;
  static deserializeBinaryFromReader(message: CertificateInput, reader: jspb.BinaryReader): CertificateInput;
}

export namespace CertificateInput {
  export type AsObject = {
    pem: string,
    derBase64: string,
  }
}

export class DnAttribute extends jspb.Message {
  getOid(): string;
  setOid(value: string): void;

  getShortName(): string;
  setShortName(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DnAttribute.AsObject;
  static toObject(includeInstance: boolean, msg: DnAttribute): DnAttribute.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DnAttribute, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DnAttribute;
  static deserializeBinaryFromReader(message: DnAttribute, reader: jspb.BinaryReader): DnAttribute;
}

export namespace DnAttribute {
  export type AsObject = {
    oid: string,
    shortName: string,
    value: string,
  }
}

export class DistinguishedName extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  clearAttributesList(): void;
  getAttributesList(): Array<DnAttribute>;
  setAttributesList(value: Array<DnAttribute>): void;
  addAttributes(value?: DnAttribute, index?: number): DnAttribute;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistinguishedName.AsObject;
  static toObject(includeInstance: boolean, msg: DistinguishedName): DistinguishedName.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DistinguishedName, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistinguishedName;
  static deserializeBinaryFromReader(message: DistinguishedName, reader: jspb.BinaryReader): DistinguishedName;
}

export namespace DistinguishedName {
  export type AsObject = {
    raw: string,
    attributesList: Array<DnAttribute.AsObject>,
  }
}

export class PublicKeyInfo extends jspb.Message {
  getAlgorithm(): string;
  setAlgorithm(value: string): void;

  getKeySizeBits(): number;
  setKeySizeBits(value: number): void;

  getCurve(): string;
  setCurve(value: string): void;

  getPem(): string;
  setPem(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublicKeyInfo.AsObject;
  static toObject(includeInstance: boolean, msg: PublicKeyInfo): PublicKeyInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PublicKeyInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublicKeyInfo;
  static deserializeBinaryFromReader(message: PublicKeyInfo, reader: jspb.BinaryReader): PublicKeyInfo;
}

export namespace PublicKeyInfo {
  export type AsObject = {
    algorithm: string,
    keySizeBits: number,
    curve: string,
    pem: string,
  }
}

export class SubjectAltNames extends jspb.Message {
  clearDnsNamesList(): void;
  getDnsNamesList(): Array<string>;
  setDnsNamesList(value: Array<string>): void;
  addDnsNames(value: string, index?: number): string;

  clearIpAddressesList(): void;
  getIpAddressesList(): Array<string>;
  setIpAddressesList(value: Array<string>): void;
  addIpAddresses(value: string, index?: number): string;

  clearEmailsList(): void;
  getEmailsList(): Array<string>;
  setEmailsList(value: Array<string>): void;
  addEmails(value: string, index?: number): string;

  clearUrisList(): void;
  getUrisList(): Array<string>;
  setUrisList(value: Array<string>): void;
  addUris(value: string, index?: number): string;

  clearOtherList(): void;
  getOtherList(): Array<string>;
  setOtherList(value: Array<string>): void;
  addOther(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubjectAltNames.AsObject;
  static toObject(includeInstance: boolean, msg: SubjectAltNames): SubjectAltNames.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubjectAltNames, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubjectAltNames;
  static deserializeBinaryFromReader(message: SubjectAltNames, reader: jspb.BinaryReader): SubjectAltNames;
}

export namespace SubjectAltNames {
  export type AsObject = {
    dnsNamesList: Array<string>,
    ipAddressesList: Array<string>,
    emailsList: Array<string>,
    urisList: Array<string>,
    otherList: Array<string>,
  }
}

export class Certificate extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getVersion(): number;
  setVersion(value: number): void;

  getSerialNumberHex(): string;
  setSerialNumberHex(value: string): void;

  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): DistinguishedName | undefined;
  setSubject(value?: DistinguishedName): void;

  hasIssuer(): boolean;
  clearIssuer(): void;
  getIssuer(): DistinguishedName | undefined;
  setIssuer(value?: DistinguishedName): void;

  getNotBefore(): string;
  setNotBefore(value: string): void;

  getNotAfter(): string;
  setNotAfter(value: string): void;

  getSignatureAlgorithm(): string;
  setSignatureAlgorithm(value: string): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): PublicKeyInfo | undefined;
  setPublicKey(value?: PublicKeyInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Certificate.AsObject;
  static toObject(includeInstance: boolean, msg: Certificate): Certificate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Certificate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Certificate;
  static deserializeBinaryFromReader(message: Certificate, reader: jspb.BinaryReader): Certificate;
}

export namespace Certificate {
  export type AsObject = {
    ok: boolean,
    error: string,
    version: number,
    serialNumberHex: string,
    subject?: DistinguishedName.AsObject,
    issuer?: DistinguishedName.AsObject,
    notBefore: string,
    notAfter: string,
    signatureAlgorithm: string,
    publicKey?: PublicKeyInfo.AsObject,
  }
}

export class FingerprintResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getSha1Hex(): string;
  setSha1Hex(value: string): void;

  getSha1Base64(): string;
  setSha1Base64(value: string): void;

  getSha256Hex(): string;
  setSha256Hex(value: string): void;

  getSha256Base64(): string;
  setSha256Base64(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FingerprintResult.AsObject;
  static toObject(includeInstance: boolean, msg: FingerprintResult): FingerprintResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FingerprintResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FingerprintResult;
  static deserializeBinaryFromReader(message: FingerprintResult, reader: jspb.BinaryReader): FingerprintResult;
}

export namespace FingerprintResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    sha1Hex: string,
    sha1Base64: string,
    sha256Hex: string,
    sha256Base64: string,
  }
}

export class ValidityInput extends jspb.Message {
  hasCertificate(): boolean;
  clearCertificate(): void;
  getCertificate(): CertificateInput | undefined;
  setCertificate(value?: CertificateInput): void;

  getNowUnixSeconds(): number;
  setNowUnixSeconds(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidityInput.AsObject;
  static toObject(includeInstance: boolean, msg: ValidityInput): ValidityInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidityInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidityInput;
  static deserializeBinaryFromReader(message: ValidityInput, reader: jspb.BinaryReader): ValidityInput;
}

export namespace ValidityInput {
  export type AsObject = {
    certificate?: CertificateInput.AsObject,
    nowUnixSeconds: number,
  }
}

export class ValidityResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getExpired(): boolean;
  setExpired(value: boolean): void;

  getNotYetValid(): boolean;
  setNotYetValid(value: boolean): void;

  getValid(): boolean;
  setValid(value: boolean): void;

  getNotBefore(): string;
  setNotBefore(value: string): void;

  getNotAfter(): string;
  setNotAfter(value: string): void;

  getDaysRemaining(): number;
  setDaysRemaining(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidityResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidityResult): ValidityResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidityResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidityResult;
  static deserializeBinaryFromReader(message: ValidityResult, reader: jspb.BinaryReader): ValidityResult;
}

export namespace ValidityResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    expired: boolean,
    notYetValid: boolean,
    valid: boolean,
    notBefore: string,
    notAfter: string,
    daysRemaining: number,
  }
}

export class KeyUsageResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getPresent(): boolean;
  setPresent(value: boolean): void;

  getCritical(): boolean;
  setCritical(value: boolean): void;

  clearKeyUsagesList(): void;
  getKeyUsagesList(): Array<string>;
  setKeyUsagesList(value: Array<string>): void;
  addKeyUsages(value: string, index?: number): string;

  getEkuPresent(): boolean;
  setEkuPresent(value: boolean): void;

  getEkuCritical(): boolean;
  setEkuCritical(value: boolean): void;

  clearExtendedKeyUsagesList(): void;
  getExtendedKeyUsagesList(): Array<string>;
  setExtendedKeyUsagesList(value: Array<string>): void;
  addExtendedKeyUsages(value: string, index?: number): string;

  getAnyExtendedKeyUsage(): boolean;
  setAnyExtendedKeyUsage(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyUsageResult.AsObject;
  static toObject(includeInstance: boolean, msg: KeyUsageResult): KeyUsageResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyUsageResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyUsageResult;
  static deserializeBinaryFromReader(message: KeyUsageResult, reader: jspb.BinaryReader): KeyUsageResult;
}

export namespace KeyUsageResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    present: boolean,
    critical: boolean,
    keyUsagesList: Array<string>,
    ekuPresent: boolean,
    ekuCritical: boolean,
    extendedKeyUsagesList: Array<string>,
    anyExtendedKeyUsage: boolean,
  }
}

export class BasicConstraintsResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getPresent(): boolean;
  setPresent(value: boolean): void;

  getCritical(): boolean;
  setCritical(value: boolean): void;

  getIsCa(): boolean;
  setIsCa(value: boolean): void;

  getHasPathLenConstraint(): boolean;
  setHasPathLenConstraint(value: boolean): void;

  getPathLenConstraint(): number;
  setPathLenConstraint(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BasicConstraintsResult.AsObject;
  static toObject(includeInstance: boolean, msg: BasicConstraintsResult): BasicConstraintsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BasicConstraintsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BasicConstraintsResult;
  static deserializeBinaryFromReader(message: BasicConstraintsResult, reader: jspb.BinaryReader): BasicConstraintsResult;
}

export namespace BasicConstraintsResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    present: boolean,
    critical: boolean,
    isCa: boolean,
    hasPathLenConstraint: boolean,
    pathLenConstraint: number,
  }
}

export class ExtensionEntry extends jspb.Message {
  getOid(): string;
  setOid(value: string): void;

  getName(): string;
  setName(value: string): void;

  getCritical(): boolean;
  setCritical(value: boolean): void;

  getValueBase64(): string;
  setValueBase64(value: string): void;

  getParsedSummary(): string;
  setParsedSummary(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtensionEntry.AsObject;
  static toObject(includeInstance: boolean, msg: ExtensionEntry): ExtensionEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtensionEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtensionEntry;
  static deserializeBinaryFromReader(message: ExtensionEntry, reader: jspb.BinaryReader): ExtensionEntry;
}

export namespace ExtensionEntry {
  export type AsObject = {
    oid: string,
    name: string,
    critical: boolean,
    valueBase64: string,
    parsedSummary: string,
  }
}

export class ExtensionsResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearExtensionsList(): void;
  getExtensionsList(): Array<ExtensionEntry>;
  setExtensionsList(value: Array<ExtensionEntry>): void;
  addExtensions(value?: ExtensionEntry, index?: number): ExtensionEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtensionsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtensionsResult): ExtensionsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtensionsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtensionsResult;
  static deserializeBinaryFromReader(message: ExtensionsResult, reader: jspb.BinaryReader): ExtensionsResult;
}

export namespace ExtensionsResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    extensionsList: Array<ExtensionEntry.AsObject>,
  }
}

export class SelfSignedResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getSubjectEqualsIssuer(): boolean;
  setSubjectEqualsIssuer(value: boolean): void;

  getSignatureVerified(): boolean;
  setSignatureVerified(value: boolean): void;

  getSelfSigned(): boolean;
  setSelfSigned(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SelfSignedResult.AsObject;
  static toObject(includeInstance: boolean, msg: SelfSignedResult): SelfSignedResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SelfSignedResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SelfSignedResult;
  static deserializeBinaryFromReader(message: SelfSignedResult, reader: jspb.BinaryReader): SelfSignedResult;
}

export namespace SelfSignedResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    subjectEqualsIssuer: boolean,
    signatureVerified: boolean,
    selfSigned: boolean,
  }
}

export class PublicKeyResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): PublicKeyInfo | undefined;
  setPublicKey(value?: PublicKeyInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublicKeyResult.AsObject;
  static toObject(includeInstance: boolean, msg: PublicKeyResult): PublicKeyResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PublicKeyResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublicKeyResult;
  static deserializeBinaryFromReader(message: PublicKeyResult, reader: jspb.BinaryReader): PublicKeyResult;
}

export namespace PublicKeyResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    publicKey?: PublicKeyInfo.AsObject,
  }
}

export class CsrInput extends jspb.Message {
  getPem(): string;
  setPem(value: string): void;

  getDerBase64(): string;
  setDerBase64(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CsrInput.AsObject;
  static toObject(includeInstance: boolean, msg: CsrInput): CsrInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CsrInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CsrInput;
  static deserializeBinaryFromReader(message: CsrInput, reader: jspb.BinaryReader): CsrInput;
}

export namespace CsrInput {
  export type AsObject = {
    pem: string,
    derBase64: string,
  }
}

export class CsrResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): DistinguishedName | undefined;
  setSubject(value?: DistinguishedName): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): PublicKeyInfo | undefined;
  setPublicKey(value?: PublicKeyInfo): void;

  getSignatureAlgorithm(): string;
  setSignatureAlgorithm(value: string): void;

  getSignatureValid(): boolean;
  setSignatureValid(value: boolean): void;

  getHasRequestedSans(): boolean;
  setHasRequestedSans(value: boolean): void;

  hasRequestedSans(): boolean;
  clearRequestedSans(): void;
  getRequestedSans(): SubjectAltNames | undefined;
  setRequestedSans(value?: SubjectAltNames): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CsrResult.AsObject;
  static toObject(includeInstance: boolean, msg: CsrResult): CsrResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CsrResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CsrResult;
  static deserializeBinaryFromReader(message: CsrResult, reader: jspb.BinaryReader): CsrResult;
}

export namespace CsrResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    subject?: DistinguishedName.AsObject,
    publicKey?: PublicKeyInfo.AsObject,
    signatureAlgorithm: string,
    signatureValid: boolean,
    hasRequestedSans: boolean,
    requestedSans?: SubjectAltNames.AsObject,
  }
}

export class SanResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getPresent(): boolean;
  setPresent(value: boolean): void;

  getCritical(): boolean;
  setCritical(value: boolean): void;

  hasSans(): boolean;
  clearSans(): void;
  getSans(): SubjectAltNames | undefined;
  setSans(value?: SubjectAltNames): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SanResult.AsObject;
  static toObject(includeInstance: boolean, msg: SanResult): SanResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SanResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SanResult;
  static deserializeBinaryFromReader(message: SanResult, reader: jspb.BinaryReader): SanResult;
}

export namespace SanResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    present: boolean,
    critical: boolean,
    sans?: SubjectAltNames.AsObject,
  }
}

export class PemBundleInput extends jspb.Message {
  getPem(): string;
  setPem(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PemBundleInput.AsObject;
  static toObject(includeInstance: boolean, msg: PemBundleInput): PemBundleInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PemBundleInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PemBundleInput;
  static deserializeBinaryFromReader(message: PemBundleInput, reader: jspb.BinaryReader): PemBundleInput;
}

export namespace PemBundleInput {
  export type AsObject = {
    pem: string,
  }
}

export class PemBlock extends jspb.Message {
  getLabel(): string;
  setLabel(value: string): void;

  getPem(): string;
  setPem(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PemBlock.AsObject;
  static toObject(includeInstance: boolean, msg: PemBlock): PemBlock.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PemBlock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PemBlock;
  static deserializeBinaryFromReader(message: PemBlock, reader: jspb.BinaryReader): PemBlock;
}

export namespace PemBlock {
  export type AsObject = {
    label: string,
    pem: string,
  }
}

export class PemBundleResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearCertificatesList(): void;
  getCertificatesList(): Array<PemBlock>;
  setCertificatesList(value: Array<PemBlock>): void;
  addCertificates(value?: PemBlock, index?: number): PemBlock;

  clearPrivateKeysList(): void;
  getPrivateKeysList(): Array<PemBlock>;
  setPrivateKeysList(value: Array<PemBlock>): void;
  addPrivateKeys(value?: PemBlock, index?: number): PemBlock;

  clearOtherBlocksList(): void;
  getOtherBlocksList(): Array<PemBlock>;
  setOtherBlocksList(value: Array<PemBlock>): void;
  addOtherBlocks(value?: PemBlock, index?: number): PemBlock;

  getTotalBlocks(): number;
  setTotalBlocks(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PemBundleResult.AsObject;
  static toObject(includeInstance: boolean, msg: PemBundleResult): PemBundleResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PemBundleResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PemBundleResult;
  static deserializeBinaryFromReader(message: PemBundleResult, reader: jspb.BinaryReader): PemBundleResult;
}

export namespace PemBundleResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    certificatesList: Array<PemBlock.AsObject>,
    privateKeysList: Array<PemBlock.AsObject>,
    otherBlocksList: Array<PemBlock.AsObject>,
    totalBlocks: number,
  }
}

export class ChainInput extends jspb.Message {
  clearCertificatesList(): void;
  getCertificatesList(): Array<CertificateInput>;
  setCertificatesList(value: Array<CertificateInput>): void;
  addCertificates(value?: CertificateInput, index?: number): CertificateInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainInput.AsObject;
  static toObject(includeInstance: boolean, msg: ChainInput): ChainInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChainInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainInput;
  static deserializeBinaryFromReader(message: ChainInput, reader: jspb.BinaryReader): ChainInput;
}

export namespace ChainInput {
  export type AsObject = {
    certificatesList: Array<CertificateInput.AsObject>,
  }
}

export class ChainLink extends jspb.Message {
  getFromIndex(): number;
  setFromIndex(value: number): void;

  getToIndex(): number;
  setToIndex(value: number): void;

  getIssuerMatchesSubject(): boolean;
  setIssuerMatchesSubject(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainLink.AsObject;
  static toObject(includeInstance: boolean, msg: ChainLink): ChainLink.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChainLink, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainLink;
  static deserializeBinaryFromReader(message: ChainLink, reader: jspb.BinaryReader): ChainLink;
}

export namespace ChainLink {
  export type AsObject = {
    fromIndex: number,
    toIndex: number,
    issuerMatchesSubject: boolean,
  }
}

export class ChainResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearCertificatesList(): void;
  getCertificatesList(): Array<Certificate>;
  setCertificatesList(value: Array<Certificate>): void;
  addCertificates(value?: Certificate, index?: number): Certificate;

  clearLinksList(): void;
  getLinksList(): Array<ChainLink>;
  setLinksList(value: Array<ChainLink>): void;
  addLinks(value?: ChainLink, index?: number): ChainLink;

  getDetectedOrdering(): string;
  setDetectedOrdering(value: string): void;

  getFullyLinked(): boolean;
  setFullyLinked(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainResult.AsObject;
  static toObject(includeInstance: boolean, msg: ChainResult): ChainResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChainResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainResult;
  static deserializeBinaryFromReader(message: ChainResult, reader: jspb.BinaryReader): ChainResult;
}

export namespace ChainResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    certificatesList: Array<Certificate.AsObject>,
    linksList: Array<ChainLink.AsObject>,
    detectedOrdering: string,
    fullyLinked: boolean,
  }
}

export class KeyIdentifiersResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getSkiPresent(): boolean;
  setSkiPresent(value: boolean): void;

  getSkiHex(): string;
  setSkiHex(value: string): void;

  getAkiPresent(): boolean;
  setAkiPresent(value: boolean): void;

  getAkiHasKeyId(): boolean;
  setAkiHasKeyId(value: boolean): void;

  getAkiKeyIdHex(): string;
  setAkiKeyIdHex(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyIdentifiersResult.AsObject;
  static toObject(includeInstance: boolean, msg: KeyIdentifiersResult): KeyIdentifiersResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyIdentifiersResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyIdentifiersResult;
  static deserializeBinaryFromReader(message: KeyIdentifiersResult, reader: jspb.BinaryReader): KeyIdentifiersResult;
}

export namespace KeyIdentifiersResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    skiPresent: boolean,
    skiHex: string,
    akiPresent: boolean,
    akiHasKeyId: boolean,
    akiKeyIdHex: string,
  }
}

export class SummaryResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getSummary(): string;
  setSummary(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SummaryResult.AsObject;
  static toObject(includeInstance: boolean, msg: SummaryResult): SummaryResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SummaryResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SummaryResult;
  static deserializeBinaryFromReader(message: SummaryResult, reader: jspb.BinaryReader): SummaryResult;
}

export namespace SummaryResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    summary: string,
  }
}

