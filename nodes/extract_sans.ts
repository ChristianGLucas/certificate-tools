import { CertificateInput, SanResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, getRawExtensions, buildSans, CertError } from './cert_lib';

const SAN_OID = '2.5.29.17';

/**
 * Extract a certificate's Subject Alternative Name (SAN) extension, split by
 * GeneralName type — DNS names, IP addresses (v4/v6), RFC 822 email addresses, and
 * URIs, plus a stringified catch-all for rarer forms (directoryName, registeredID,
 * otherName). present=false (not an error) when the certificate carries no SAN
 * extension.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractSans(ax: AxiomContext, input: CertificateInput): SanResult {
  const out = new SanResult();
  try {
    const { der } = loadCertificate(input);
    const raw = getRawExtensions(der).find((e) => e.oid === SAN_OID);
    const { sans, present } = buildSans(raw);
    out.setOk(true);
    out.setPresent(present);
    out.setCritical(raw?.critical ?? false);
    out.setSans(sans);
    return out;
  } catch (e) {
    ax.log.warn('extractSans failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
