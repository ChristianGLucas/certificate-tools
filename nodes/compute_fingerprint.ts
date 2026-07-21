import { createHash } from 'crypto';
import { CertificateInput, FingerprintResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, CertError } from './cert_lib';

/**
 * Compute the SHA-1 and SHA-256 fingerprint (digest of the certificate's raw DER
 * encoding) — the standard identifier used for certificate pinning, trust-store
 * lookups, and "is this the cert I expect" comparisons. Returns each digest as both
 * lowercase hex and standard base64.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function computeFingerprint(ax: AxiomContext, input: CertificateInput): FingerprintResult {
  const out = new FingerprintResult();
  try {
    const { der } = loadCertificate(input);
    const buf = Buffer.from(der);
    const sha1 = createHash('sha1').update(buf).digest();
    const sha256 = createHash('sha256').update(buf).digest();
    out.setOk(true);
    out.setSha1Hex(sha1.toString('hex'));
    out.setSha1Base64(sha1.toString('base64'));
    out.setSha256Hex(sha256.toString('hex'));
    out.setSha256Base64(sha256.toString('base64'));
    return out;
  } catch (e) {
    ax.log.warn('computeFingerprint failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
