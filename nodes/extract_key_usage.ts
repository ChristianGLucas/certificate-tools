import { CertificateInput, KeyUsageResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, getRawExtensions, buildKeyUsage, buildEku, CertError } from './cert_lib';

const KEY_USAGE_OID = '2.5.29.15';
const EKU_OID = '2.5.29.37';

/**
 * Extract a certificate's Key Usage and Extended Key Usage extensions — the bits
 * governing what the key/certificate may legitimately be used for (digitalSignature,
 * keyEncipherment, keyCertSign, serverAuth, clientAuth, codeSigning, etc.), each with
 * its criticality flag. Extended Key Usage OIDs are resolved to a friendly name where
 * recognized, else returned as the raw dotted OID. present=false (not an error) when
 * the extension is absent.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractKeyUsage(ax: AxiomContext, input: CertificateInput): KeyUsageResult {
  const out = new KeyUsageResult();
  try {
    const { der } = loadCertificate(input);
    const extensions = getRawExtensions(der);
    const kuRaw = extensions.find((e) => e.oid === KEY_USAGE_OID);
    const ekuRaw = extensions.find((e) => e.oid === EKU_OID);

    out.setOk(true);
    out.setPresent(!!kuRaw);
    out.setCritical(kuRaw?.critical ?? false);
    out.setKeyUsagesList(kuRaw ? buildKeyUsage(kuRaw) : []);
    out.setEkuPresent(!!ekuRaw);
    out.setEkuCritical(ekuRaw?.critical ?? false);
    if (ekuRaw) {
      const eku = buildEku(ekuRaw);
      out.setExtendedKeyUsagesList(eku.names);
      out.setAnyExtendedKeyUsage(eku.any);
    } else {
      out.setExtendedKeyUsagesList([]);
      out.setAnyExtendedKeyUsage(false);
    }
    return out;
  } catch (e) {
    ax.log.warn('extractKeyUsage failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
