import { CertificateInput } from '../gen/messages_pb';
import { extractBasicConstraints } from './extract_basic_constraints';
import { testContext, LEAF_CERT_PEM, INTER_CERT_PEM, INTER_EXPECTED, GARBAGE_PEM } from './fixtures';

describe('ExtractBasicConstraints', () => {
  it('reports is_ca=true with pathLen=0 for the intermediate CA, matching the openssl oracle', () => {
    const input = new CertificateInput();
    input.setPem(INTER_CERT_PEM);
    const result = extractBasicConstraints(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getPresent()).toBe(true);
    expect(result.getCritical()).toBe(true);
    expect(result.getIsCa()).toBe(INTER_EXPECTED.isCa);
    expect(result.getHasPathLenConstraint()).toBe(true);
    expect(result.getPathLenConstraint()).toBe(INTER_EXPECTED.pathLen);
  });

  it('reports is_ca=false for the end-entity leaf certificate', () => {
    const input = new CertificateInput();
    input.setPem(LEAF_CERT_PEM);
    const result = extractBasicConstraints(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getPresent()).toBe(true);
    expect(result.getIsCa()).toBe(false);
    expect(result.getHasPathLenConstraint()).toBe(false);
  });

  it('returns a structured error for malformed input instead of throwing', () => {
    const input = new CertificateInput();
    input.setPem(GARBAGE_PEM);
    const result = extractBasicConstraints(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
