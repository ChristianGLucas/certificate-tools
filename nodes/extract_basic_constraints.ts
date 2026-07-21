import { CertificateInput, BasicConstraintsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, getRawExtensions, buildBasicConstraints, CertError } from './cert_lib';

const BASIC_CONSTRAINTS_OID = '2.5.29.19';

/**
 * Extract a certificate's Basic Constraints extension — is_ca (whether this
 * certificate may itself sign other certificates) and, when present, the
 * pathLenConstraint bounding how many intermediate CAs may follow it in a chain.
 * present=false (not an error) when the extension is absent, which per RFC 5280 means
 * the certificate is implicitly treated as an end-entity (not a CA).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractBasicConstraints(ax: AxiomContext, input: CertificateInput): BasicConstraintsResult {
  const out = new BasicConstraintsResult();
  try {
    const { der } = loadCertificate(input);
    const raw = getRawExtensions(der).find((e) => e.oid === BASIC_CONSTRAINTS_OID);
    out.setOk(true);
    out.setPresent(!!raw);
    out.setCritical(raw?.critical ?? false);
    if (raw) {
      const bc = buildBasicConstraints(raw);
      out.setIsCa(bc.isCa);
      out.setHasPathLenConstraint(bc.hasPathLen);
      out.setPathLenConstraint(bc.pathLen);
    } else {
      out.setIsCa(false);
      out.setHasPathLenConstraint(false);
      out.setPathLenConstraint(0);
    }
    return out;
  } catch (e) {
    ax.log.warn('extractBasicConstraints failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
