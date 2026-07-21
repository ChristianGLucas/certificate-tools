import { CertificateInput, PublicKeyResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, buildPublicKeyInfo, CertError } from './cert_lib';

/**
 * Extract a certificate's public key on its own — algorithm (RSA/EC/Ed25519/Ed448/DSA
 * or the raw OID when unrecognized), key size in bits, named curve for EC keys, and
 * the SubjectPublicKeyInfo re-encoded as standalone PEM (suitable, for example, as the
 * public-key input to christiangeorgelucas/jwt-tools' VerifySignature node for
 * RS/PS/ES/EdDSA-signed JWTs).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractPublicKey(ax: AxiomContext, input: CertificateInput): PublicKeyResult {
  const out = new PublicKeyResult();
  try {
    const { cert } = loadCertificate(input);
    out.setOk(true);
    out.setPublicKey(buildPublicKeyInfo(cert.publicKey));
    return out;
  } catch (e) {
    ax.log.warn('extractPublicKey failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
