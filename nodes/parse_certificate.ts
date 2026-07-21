import { CertificateInput, Certificate } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, buildCertificateMessage, CertError } from './cert_lib';

/**
 * Parse a PEM or DER X.509 certificate into its full structured fields — version,
 * serial number (hex), subject and issuer Distinguished Names, validity period
 * (notBefore/notAfter, RFC 3339 UTC), signature algorithm, and the decoded public key.
 * Malformed input returns ok=false with a structured error rather than throwing.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseCertificate(ax: AxiomContext, input: CertificateInput): Certificate {
  try {
    const { cert, der } = loadCertificate(input);
    return buildCertificateMessage(cert, der);
  } catch (e) {
    ax.log.warn('parseCertificate failed', { error: (e as Error).message });
    const out = new Certificate();
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
