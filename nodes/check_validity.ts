import { ValidityInput, ValidityResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, isoUtc, CertError } from './cert_lib';

/**
 * Check a certificate's validity period against a CALLER-SUPPLIED `now_unix_seconds`
 * (Unix seconds, UTC) — this node NEVER reads the system clock, so the result is
 * fully deterministic and reproducible for any point in time, past or future. Reports
 * expired, not_yet_valid, an overall valid flag, and days_remaining (negative once
 * expired).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function checkValidity(ax: AxiomContext, input: ValidityInput): ValidityResult {
  const out = new ValidityResult();
  try {
    const certInput = input.getCertificate();
    if (!certInput) {
      throw new CertError('certificate is required');
    }
    const { cert } = loadCertificate(certInput);
    const nowMs = input.getNowUnixSeconds() * 1000;
    const notBeforeMs = cert.notBefore.getTime();
    const notAfterMs = cert.notAfter.getTime();
    const expired = nowMs > notAfterMs;
    const notYetValid = nowMs < notBeforeMs;
    out.setOk(true);
    out.setExpired(expired);
    out.setNotYetValid(notYetValid);
    out.setValid(!expired && !notYetValid);
    out.setNotBefore(isoUtc(cert.notBefore));
    out.setNotAfter(isoUtc(cert.notAfter));
    out.setDaysRemaining(Math.floor((notAfterMs - nowMs) / 86400000));
    return out;
  } catch (e) {
    ax.log.warn('checkValidity failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
