import { CertificateInput, SummaryResult, DistinguishedName } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, buildDn, isoUtc, CertError } from './cert_lib';

/**
 * Render a certificate as a single human-readable summary line — subject CN (or full
 * subject DN when no CN attribute is present), issuer CN, and the validity period —
 * for logging, audit tables, or a quick-glance display.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function summarizeCertificate(ax: AxiomContext, input: CertificateInput): SummaryResult {
  const out = new SummaryResult();
  try {
    const { cert } = loadCertificate(input);
    const subject = buildDn(cert.subjectName);
    const issuer = buildDn(cert.issuerName);
    const subjectLabel = cnLabel(subject);
    const issuerLabel = cnLabel(issuer);
    const notBefore = isoUtc(cert.notBefore).slice(0, 10);
    const notAfter = isoUtc(cert.notAfter).slice(0, 10);
    out.setOk(true);
    out.setSummary(`${subjectLabel} issued by ${issuerLabel}, valid ${notBefore} to ${notAfter}`);
    return out;
  } catch (e) {
    ax.log.warn('summarizeCertificate failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}

/** "CN=value" when a CN attribute is present, else the full raw DN string. */
function cnLabel(dn: DistinguishedName): string {
  const cn = dn.getAttributesList().find((a) => a.getShortName() === 'CN');
  return cn ? `CN=${cn.getValue()}` : dn.getRaw();
}
