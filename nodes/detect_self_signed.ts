import { CertificateInput, SelfSignedResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, CertError } from './cert_lib';

/**
 * Determine whether a certificate is self-signed via a PURE STRUCTURAL check — does
 * its issuer DN equal its subject DN, AND does its own public key cryptographically
 * verify its own signature over its own TBSCertificate. This is NOT trust validation
 * (no trust store, no revocation, no network) — a self-signed cert can still be
 * untrusted, and this node makes no claim about that.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function detectSelfSigned(ax: AxiomContext, input: CertificateInput): Promise<SelfSignedResult> {
  const out = new SelfSignedResult();
  try {
    const { cert } = loadCertificate(input);
    const subjectEqualsIssuer = cert.subject === cert.issuer;
    // signatureOnly:true is essential — without it, X509Certificate.verify() also
    // checks the certificate's validity dates against `new Date()` (the system clock),
    // which this package never reads. This node makes no validity/expiry claim at all.
    const signatureVerified = await cert.verify({ signatureOnly: true });
    out.setOk(true);
    out.setSubjectEqualsIssuer(subjectEqualsIssuer);
    out.setSignatureVerified(signatureVerified);
    out.setSelfSigned(subjectEqualsIssuer && signatureVerified);
    return out;
  } catch (e) {
    ax.log.warn('detectSelfSigned failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
