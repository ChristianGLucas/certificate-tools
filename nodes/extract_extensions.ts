import { CertificateInput, ExtensionsResult, ExtensionEntry } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, getRawExtensions, extensionFriendlyName, summarizeExtension, CertError } from './cert_lib';

/**
 * Extract EVERY X.509v3 extension present on a certificate as a generic, structured
 * entry — OID, recognized friendly name (when known), criticality flag, and the raw
 * extnValue as base64 — including extensions this package has no dedicated node for.
 * The node to reach for when auditing a certificate's full extension set rather than
 * one specific extension.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractExtensions(ax: AxiomContext, input: CertificateInput): ExtensionsResult {
  const out = new ExtensionsResult();
  try {
    const { der } = loadCertificate(input);
    const raws = getRawExtensions(der);
    const entries = raws.map((raw) => {
      const entry = new ExtensionEntry();
      entry.setOid(raw.oid);
      entry.setName(extensionFriendlyName(raw.oid));
      entry.setCritical(raw.critical);
      entry.setValueBase64(Buffer.from(raw.valueBytes).toString('base64'));
      entry.setParsedSummary(summarizeExtension(raw));
      return entry;
    });
    out.setOk(true);
    out.setExtensionsList(entries);
    return out;
  } catch (e) {
    ax.log.warn('extractExtensions failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
