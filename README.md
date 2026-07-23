# certificate-tools

Deterministic, offline parsing and structural inspection of X.509 certificates,
PKCS#10 certificate signing requests, certificate chains, and PEM bundles. Built
for the [Axiom](https://axiom.dev) marketplace under the `christiangeorgelucas`
handle.

Wraps [`@peculiar/x509`](https://github.com/PeculiarVentures/x509) (MIT) — a pure
TypeScript X.509/PKI library built on WebCrypto, with an MIT/BSD-3-Clause/0BSD
transitive dependency tree (no copyleft, no native code).

## What this package does — and does not do

- Every certificate/CSR is supplied by the caller as **PEM text or base64 DER**.
  This package **never** dials a host, fetches a URL, or performs an OCSP/CRL
  lookup — it inspects only the material it is given.
- Any validity/expiry check (`CheckValidity`) compares against a
  **caller-supplied `now_unix_seconds`** and never reads the system clock, so
  results are fully deterministic and reproducible for any point in time.
- Self-signed detection (`DetectSelfSigned`) and chain-linkage checks
  (`ParseChain`) are **pure structural checks** — they are explicitly **not**
  trust validation, which would require a trust store and network revocation
  checks this package deliberately never touches.
- Malformed PEM/DER/ASN.1 input returns a structured error, never a crash or
  hang. The platform owns size/resource limits; this package imposes none of
  its own.

## Nodes

| Node | What it does |
|---|---|
| `ParseCertificate` | Parse a PEM/DER X.509 cert into structured fields (subject/issuer DN, serial, validity, sig algorithm, public key). |
| `ExtractSans` | Extract Subject Alternative Names (DNS, IP, email, URI). |
| `ComputeFingerprint` | SHA-1 + SHA-256 fingerprint of the certificate's DER encoding. |
| `CheckValidity` | Expiry/validity check against a caller-supplied `now`. |
| `ExtractKeyUsage` | Key Usage + Extended Key Usage extensions. |
| `ExtractBasicConstraints` | `isCA` + `pathLenConstraint`. |
| `ExtractExtensions` | Every X.509v3 extension, generically decoded. |
| `DetectSelfSigned` | Structural self-signed check (DN equality + self-signature verification). |
| `ExtractPublicKey` | Public key algorithm/size/curve/PEM. |
| `ParseCsr` | Parse a PKCS#10 CSR (subject, public key, requested SANs, proof of possession). |
| `SplitPemBundle` | Split a multi-block PEM bundle into individual cert/key/other blocks. |
| `ParseChain` | Structural chain-linkage + ordering detection for a list of certificates. |
| `ExtractKeyIdentifiers` | Subject/Authority Key Identifier extensions. |
| `SummarizeCertificate` | One-line human-readable certificate summary. |

## License

MIT — Copyright (c) 2026 Christian George Lucas. See [LICENSE](./LICENSE).
