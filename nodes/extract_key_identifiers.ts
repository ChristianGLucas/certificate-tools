import { CertificateInput, KeyIdentifiersResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, getRawExtensions, buildSki, buildAki, CertError } from './cert_lib';

const SKI_OID = '2.5.29.14';
const AKI_OID = '2.5.29.35';

/**
 * Extract a certificate's Subject Key Identifier (SKI) and Authority Key Identifier
 * (AKI, keyIdentifier form) extensions as hex strings — the values used to match a
 * certificate to its issuer's key across a chain independent of DN matching. Each is
 * present=false (not an error) when its extension is absent.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractKeyIdentifiers(ax: AxiomContext, input: CertificateInput): KeyIdentifiersResult {
  const out = new KeyIdentifiersResult();
  try {
    const { der } = loadCertificate(input);
    const extensions = getRawExtensions(der);
    const skiRaw = extensions.find((e) => e.oid === SKI_OID);
    const akiRaw = extensions.find((e) => e.oid === AKI_OID);

    out.setOk(true);
    out.setSkiPresent(!!skiRaw);
    out.setSkiHex(skiRaw ? buildSki(skiRaw) : '');
    out.setAkiPresent(!!akiRaw);
    if (akiRaw) {
      const aki = buildAki(akiRaw);
      out.setAkiHasKeyId(aki.hasKeyId);
      out.setAkiKeyIdHex(aki.keyIdHex);
    } else {
      out.setAkiHasKeyId(false);
      out.setAkiKeyIdHex('');
    }
    return out;
  } catch (e) {
    ax.log.warn('extractKeyIdentifiers failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
