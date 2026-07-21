import { CertificateInput, ChainInput } from '../gen/messages_pb';
import { parseChain } from './parse_chain';
import { testContext, LEAF_CERT_PEM, INTER_CERT_PEM, ROOT_CERT_PEM } from './fixtures';

function certInput(pem: string): CertificateInput {
  const c = new CertificateInput();
  c.setPem(pem);
  return c;
}

describe('ParseChain', () => {
  it('detects leaf_to_root ordering and full linkage for a correctly-ordered chain', () => {
    const input = new ChainInput();
    input.setCertificatesList([certInput(LEAF_CERT_PEM), certInput(INTER_CERT_PEM), certInput(ROOT_CERT_PEM)]);
    const result = parseChain(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getDetectedOrdering()).toBe('leaf_to_root');
    expect(result.getFullyLinked()).toBe(true);
    expect(result.getCertificatesList().length).toBe(3);
    expect(result.getLinksList().length).toBe(2);
    expect(result.getLinksList()[0].getIssuerMatchesSubject()).toBe(true);
    expect(result.getLinksList()[1].getIssuerMatchesSubject()).toBe(true);
  });

  it('detects root_to_leaf ordering for a reversed chain', () => {
    const input = new ChainInput();
    input.setCertificatesList([certInput(ROOT_CERT_PEM), certInput(INTER_CERT_PEM), certInput(LEAF_CERT_PEM)]);
    const result = parseChain(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDetectedOrdering()).toBe('root_to_leaf');
    expect(result.getFullyLinked()).toBe(true);
  });

  it('reports unordered + fully_linked=false for certificates that do not chain', () => {
    const input = new ChainInput();
    // leaf and root have no direct issuer/subject relationship (root did not issue leaf)
    input.setCertificatesList([certInput(LEAF_CERT_PEM), certInput(ROOT_CERT_PEM)]);
    const result = parseChain(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDetectedOrdering()).toBe('unordered');
    expect(result.getFullyLinked()).toBe(false);
    expect(result.getLinksList()[0].getIssuerMatchesSubject()).toBe(false);
  });

  it('reports "single" ordering for exactly one certificate', () => {
    const input = new ChainInput();
    input.setCertificatesList([certInput(LEAF_CERT_PEM)]);
    const result = parseChain(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDetectedOrdering()).toBe('single');
    expect(result.getFullyLinked()).toBe(true);
  });

  it('returns a structured error for an empty certificate list', () => {
    const input = new ChainInput();
    input.setCertificatesList([]);
    const result = parseChain(testContext, input);
    expect(result.getOk()).toBe(false);
  });

  it('returns a structured error identifying the bad index when one certificate is malformed', () => {
    const bad = new CertificateInput();
    bad.setPem('not a certificate');
    const input = new ChainInput();
    input.setCertificatesList([certInput(LEAF_CERT_PEM), bad]);
    const result = parseChain(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError()).toContain('index 1');
  });
});
