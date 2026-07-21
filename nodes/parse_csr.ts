import { CsrInput, CsrResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCsr, getRawCsrExtensions, buildDn, buildPublicKeyInfo, buildSans, CertError } from './cert_lib';

const SAN_OID = '2.5.29.17';

/**
 * Parse a PKCS#10 Certificate Signing Request (PEM or DER) into its subject
 * Distinguished Name, requested public key, signature algorithm, and whether the
 * CSR's self-signature verifies against its own carried public key (proof of
 * possession) — plus any Subject Alternative Names requested via its
 * extensionRequest attribute. Malformed input returns ok=false with a structured
 * error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function parseCsr(ax: AxiomContext, input: CsrInput): Promise<CsrResult> {
  const out = new CsrResult();
  try {
    const { csr, der } = loadCsr(input);
    out.setOk(true);
    out.setSubject(buildDn(csr.subjectName));
    out.setPublicKey(buildPublicKeyInfo(csr.publicKey));
    out.setSignatureAlgorithm(csr.signatureAlgorithm.name ?? 'UNKNOWN');
    // Proof of possession only — no dates are involved in a CSR, so there is no
    // clock-dependence to worry about here.
    out.setSignatureValid(await csr.verify());

    const sanRaw = getRawCsrExtensions(der).find((e) => e.oid === SAN_OID);
    if (sanRaw) {
      const { sans } = buildSans(sanRaw);
      out.setHasRequestedSans(true);
      out.setRequestedSans(sans);
    } else {
      out.setHasRequestedSans(false);
    }
    return out;
  } catch (e) {
    ax.log.warn('parseCsr failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
