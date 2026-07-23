import { PemBundleInput, PemBundleResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { splitPemBundle as splitPemBundleImpl, CertError } from './cert_lib';

/**
 * Split a PEM bundle — one text blob containing several concatenated
 * "-----BEGIN ...-----"/"-----END ...-----" blocks, as CAs commonly ship a
 * leaf+intermediates chain or a combined cert+key file — into its individual blocks,
 * each re-wrapped as standalone PEM and bucketed into certificates, private_keys, and
 * other_blocks (CSRs, standalone public keys, CRLs, etc.) by its PEM header label. A
 * pure text/structure operation; no ASN.1 decoding of block contents is performed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function splitPemBundle(ax: AxiomContext, input: PemBundleInput): PemBundleResult {
  const out = new PemBundleResult();
  try {
    const pem = input.getPem();
    if (!pem || pem.trim().length === 0) {
      throw new CertError('pem is required');
    }
    const blocks = splitPemBundleImpl(pem);
    const certificates = blocks.filter((b) => b.getLabel() === 'CERTIFICATE');
    const privateKeys = blocks.filter((b) => b.getLabel().includes('PRIVATE KEY'));
    const otherBlocks = blocks.filter(
      (b) => b.getLabel() !== 'CERTIFICATE' && !b.getLabel().includes('PRIVATE KEY'),
    );
    out.setOk(true);
    out.setCertificatesList(certificates);
    out.setPrivateKeysList(privateKeys);
    out.setOtherBlocksList(otherBlocks);
    out.setTotalBlocks(blocks.length);
    return out;
  } catch (e) {
    ax.log.warn('splitPemBundle failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    return out;
  }
}
