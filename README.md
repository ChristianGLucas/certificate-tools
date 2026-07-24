# certificate-tools

Deterministic, offline parsing and structural inspection of X.509 certificates,
PKCS#10 certificate signing requests, certificate chains, and PEM bundles. Built
for the [Axiom](https://axiomide.com) marketplace under the `christiangeorgelucas`
handle.

Wraps [`@peculiar/x509`](https://github.com/PeculiarVentures/x509) (MIT) — a pure
TypeScript X.509/PKI library built on WebCrypto, with an MIT/BSD-3-Clause/0BSD
transitive dependency tree (no copyleft, no native code).

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/certificate-tools@0.1.1

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/certificate-tools/ParseCertificate --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/certificate-tools/0.1.1/ParseCertificate \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/certificate-tools/ParseCertificate`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

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
