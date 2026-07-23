import { ChainInput, ChainResult, ChainLink, Certificate } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { loadCertificate, buildCertificateMessage, CertError } from './cert_lib';

/**
 * Parse an ordered list of certificates and report the chain's structural linkage —
 * for each adjacent pair, whether one's issuer DN matches the next's subject DN —
 * plus the detected ordering (leaf_to_root, root_to_leaf, unordered, single, unknown)
 * and whether every adjacent pair links in that direction. A PURE STRUCTURAL check
 * (DN string equality, no cross-certificate signature re-verification, no trust
 * store) — NOT trust/path validation.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseChain(ax: AxiomContext, input: ChainInput): ChainResult {
  const out = new ChainResult();
  try {
    const inputs = input.getCertificatesList();
    if (inputs.length === 0) {
      throw new CertError('at least one certificate is required');
    }

    const loaded = inputs.map((ci, i) => {
      try {
        return loadCertificate(ci);
      } catch (e) {
        throw new CertError(`certificate at index ${i}: ${(e as Error).message}`);
      }
    });
    const certMessages: Certificate[] = loaded.map(({ cert, der }) => buildCertificateMessage(cert, der));

    const links: ChainLink[] = [];
    // forwardLinks[i]: certs[i].issuer == certs[i+1].subject (the "leaf -> root" direction:
    // input[0] is the leaf, each next cert is the issuer of the previous one).
    const forwardLinks: boolean[] = [];
    // backwardLinks[i]: certs[i+1].issuer == certs[i].subject (the "root -> leaf" direction).
    const backwardLinks: boolean[] = [];
    for (let i = 0; i < loaded.length - 1; i++) {
      const a = loaded[i].cert;
      const b = loaded[i + 1].cert;
      const forward = a.issuer === b.subject;
      const backward = b.issuer === a.subject;
      forwardLinks.push(forward);
      backwardLinks.push(backward);

      const link = new ChainLink();
      link.setFromIndex(i);
      link.setToIndex(i + 1);
      link.setIssuerMatchesSubject(forward);
      links.push(link);
    }

    let detectedOrdering: string;
    let fullyLinked: boolean;
    if (loaded.length === 1) {
      detectedOrdering = 'single';
      fullyLinked = true;
    } else if (forwardLinks.every(Boolean)) {
      detectedOrdering = 'leaf_to_root';
      fullyLinked = true;
    } else if (backwardLinks.every(Boolean)) {
      detectedOrdering = 'root_to_leaf';
      fullyLinked = true;
    } else {
      detectedOrdering = 'unordered';
      fullyLinked = false;
    }

    out.setOk(true);
    out.setCertificatesList(certMessages);
    out.setLinksList(links);
    out.setDetectedOrdering(detectedOrdering);
    out.setFullyLinked(fullyLinked);
    return out;
  } catch (e) {
    ax.log.warn('parseChain failed', { error: (e as Error).message });
    out.setOk(false);
    out.setError(e instanceof CertError ? e.message : `unexpected error: ${(e as Error).message}`);
    out.setDetectedOrdering('unknown');
    out.setFullyLinked(false);
    return out;
  }
}
