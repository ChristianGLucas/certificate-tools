// Shared test fixtures — NOT a test file itself (no `_test.ts` suffix, so jest never
// collects it as a suite). Every certificate/CSR below was generated once with the
// system `openssl` CLI (an implementation fully independent of @peculiar/x509, the
// library this package wraps) and is embedded here as a fixed, deterministic PEM
// constant. The "expected" values recorded alongside each fixture were read directly
// off `openssl x509 -noout -text` / `-fingerprint` / CSR `-text` output at generation
// time — an INDEPENDENT ORACLE this package's own code never touches — so every node
// test that compares its node's output against these constants is a real oracle test,
// not a self-consistency check.
import { AxiomContext, AxiomLogger, AxiomSecrets, AxiomReflection, AxiomMutation } from '../gen/axiomContext';

const testReflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const testMutation: AxiomMutation = {
  flow: {
    addNode: (_packageName: string, _packageVersion: string) => 0,
    addEdge: (_srcInstance: number, _dstInstance: number) => {},
  },
};

export const testContext: AxiomContext = {
  log: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  } satisfies AxiomLogger,
  secrets: {
    get: (_name: string): [string, boolean] => ['', false],
  } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection: testReflection,
  mutation: testMutation,
};

// ---- ROOT — self-signed RSA-2048 CA -------------------------------------------------
export const ROOT_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIDvTCCAqWgAwIBAgIUKEshH2y1oKF0DafpCCj6YQPMB34wDQYJKoZIhvcNAQEL
BQAwbjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcM
DVNhbiBGcmFuY2lzY28xGDAWBgNVBAoMD0V4YW1wbGUgUm9vdCBDQTEYMBYGA1UE
AwwPRXhhbXBsZSBSb290IENBMB4XDTI2MDcyMTIxNDQ0MFoXDTM2MDcxODIxNDQ0
MFowbjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcM
DVNhbiBGcmFuY2lzY28xGDAWBgNVBAoMD0V4YW1wbGUgUm9vdCBDQTEYMBYGA1UE
AwwPRXhhbXBsZSBSb290IENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
AQEAtuUuBI1eDoBuiXMGWf5gIgGaBnBVJE2arvsDstKh/UblQCodyVZuf/sxUqXl
yO6czfH7HztTwYW7++gKArGSBHkH0pQWpaPLCgtvOgLsZg4LZpgSlEZeiTgt0PL9
jKbcNk1LDvU54pc1VdcLDaK8/Zm3GUMEViN3A3r6Hns2KW/nJiv7T2GRn4vbZqLt
w35sI0wdPsaZQa3IjF6ZJ+ynV34pQWdxQR0Gl4bNr6CX0A38XyZPJDQK6uWsy2KD
t2hDE8jF9uAIGwAYD2mlaIRhcumx6JPkFvLPMsnXyPJW7IdExHSt0u0cTmO1in6s
lMLj/0r6c7g3ZiiAvzGFmqCvtwIDAQABo1MwUTAdBgNVHQ4EFgQUXyYR6v1OwWZ4
Dk09CwYsSmDl22YwHwYDVR0jBBgwFoAUXyYR6v1OwWZ4Dk09CwYsSmDl22YwDwYD
VR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAs783IjB22K73MuCeCyaa
dQryjyYwpejZEt7DI0eJN/MR0xGtLjXB7xZZpk2qn68rM6p0++jtQCeg70iB/DaN
ZZ/2OXzdW6HRBe4+IeNnvNheta8DkA0Ea4ujevLEdwImW9OLt713rbXh8GOcd3Sc
cOFwiE+69+tGsp1934YycmRP68sn7L8aTkjnDZ2SUNw6NHo6gEZQt2FARQhAueg3
8rJgJy780raB1xJbfoNZ0CfroywkTKcNe8Xm5jOIIWRnjciKs+a+zaqM5OJibZgJ
eykjbSFwUqf0s0ztamkfBMwcqw2JzP5Sm3sx6KM83zsOIwMngGTqrar170GY6qd5
8A==
-----END CERTIFICATE-----
`;
export const ROOT_EXPECTED = {
  subjectRaw: 'C=US, ST=California, L=San Francisco, O=Example Root CA, CN=Example Root CA',
  issuerRaw: 'C=US, ST=California, L=San Francisco, O=Example Root CA, CN=Example Root CA',
  serialHex: '284b211f6cb5a0a1740da7e90828fa6103cc077e',
  notBefore: '2026-07-21T21:44:40Z',
  notAfter: '2036-07-18T21:44:40Z',
  sha1Fingerprint: '201a420bc9a9fda3e18fdae82116896def6d648b',
  sha256Fingerprint: '1ec4d0ddf9c2eb9fadb6434180566e0e902d71ba43d73fe1f8f484377db1d95e',
  keySizeBits: 2048,
};

// ---- INTERMEDIATE — signed by ROOT, CA:TRUE pathlen:0 ------------------------------
export const INTER_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIDszCCApugAwIBAgIUYhC9m31lmY7Q9LxtmhedO+r2YtIwDQYJKoZIhvcNAQEL
BQAwbjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcM
DVNhbiBGcmFuY2lzY28xGDAWBgNVBAoMD0V4YW1wbGUgUm9vdCBDQTEYMBYGA1UE
AwwPRXhhbXBsZSBSb290IENBMB4XDTI2MDcyMTIxNDQ0MVoXDTMxMDcyMDIxNDQ0
MVowUTELMAkGA1UEBhMCVVMxIDAeBgNVBAoMF0V4YW1wbGUgSW50ZXJtZWRpYXRl
IENBMSAwHgYDVQQDDBdFeGFtcGxlIEludGVybWVkaWF0ZSBDQTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBALTgIVAYE33TBYaNu+SVUd/qFnwyoAGRIvAl
bHu/CkPkzGngonHdFjuQ9J7OQS4qefL0g6WwN9rD1R/WvK8YqJj70MNNgEvP6WhW
r6oGnGZ5UpKva8zCmIFsEYg6cSddtsxGzdC1eV0t18w8jmokNb4QxuCO/Ee20vVh
tpg+AG3UIInjE1oO/6DoK9KYk62tFz1ItHSWzoJyO0e95c6Yt4wQpE3aJaXgyQ1D
bNXRfd8ZWElVgGGDnZaHCkDC3imTTz8IfsjqRsbiVyYHrFcjUdq/8g+4RY7W7oaC
L3pGML90kzPJTiY6mrDnRlPeI9fJbi2IZYHL8sp8KCjCqNAzr90CAwEAAaNmMGQw
EgYDVR0TAQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAQYwHQYDVR0OBBYEFOAB
mvbs0d0BwZ6Vb0U5zgGmkGPlMB8GA1UdIwQYMBaAFF8mEer9TsFmeA5NPQsGLEpg
5dtmMA0GCSqGSIb3DQEBCwUAA4IBAQA26zxsGdKfPLzkIOFKpo98Zn5kqMGiXk5L
5iuoUGipa8ftc7y6XgJ/SrzNbdkmDWkG5CAZUc8vdo1pNdnUFuOugeZ6mVPYGNvu
lv3j+dO+I+zp2CXufGCuCa2ymK3e70r6Z9jPD3SeZ/X8JXkA3ju7/YcXkrCCenfG
xw2RIzLnHn+X4LYc1qBQbVtc/hRjd21+XaKcw+LDtlJNtI1CtDLTq4x/ZA1KqGw/
s3bHmdL2CbIV3r8dmJvByW4UMvRE7tmaYiFHoxKWrzvj82H6rGKZNta218EWJovl
jX6P3TWaDe7E88he4LK+j6f+8DumDLPw20b6ouMayR5vqPNWYhs4
-----END CERTIFICATE-----
`;
export const INTER_EXPECTED = {
  subjectRaw: 'C=US, O=Example Intermediate CA, CN=Example Intermediate CA',
  issuerRaw: ROOT_EXPECTED.subjectRaw,
  isCa: true,
  pathLen: 0,
  keyUsages: ['keyCertSign', 'cRLSign'],
  skiHex: 'e0019af6ecd1dd01c19e956f4539ce01a69063e5',
  akiHex: '5f2611eafd4ec166780e4d3d0b062c4a60e5db66',
};

// ---- LEAF — signed by INTERMEDIATE, end-entity TLS server cert with SANs -----------
export const LEAF_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIID/zCCAuegAwIBAgIUbOs2lpgqSru5Ff6jIN5EqJnKoUUwDQYJKoZIhvcNAQEL
BQAwUTELMAkGA1UEBhMCVVMxIDAeBgNVBAoMF0V4YW1wbGUgSW50ZXJtZWRpYXRl
IENBMSAwHgYDVQQDDBdFeGFtcGxlIEludGVybWVkaWF0ZSBDQTAeFw0yNjA3MjEy
MTQ0NDFaFw0yNzA3MjEyMTQ0NDFaMDkxCzAJBgNVBAYTAlVTMRQwEgYDVQQKDAtF
eGFtcGxlIEluYzEUMBIGA1UEAwwLZXhhbXBsZS5jb20wggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQDDzkdiQJ3jGj2YXMGpYMDtiD3f6Lk4dNt2lOXOI5dC
3xA2JgBwfH+iJYCFkpLA9v8rZ4mtHG5KDGOTdQAa9tn2djImgNBZ3oIHwvsXMcsL
i78cufr3cF99Swqym7DzDGnIAjpPXcAZa9F2llQw1BoFe1IYngC1D4JmKC4RXCcv
GjovIY7IQnZ47uKQnZklIRWc8EV+7/Ound+2zG0b6IQePxkvSUSKX2DnUJMtiesB
xXGyCOlmirGXQrYHDCSMc/m/uTEZtZIfbQrUQyZc43f8eI0xuDSpOh65BwZ+rJ2g
qO/O7PXMZM+9qyjhmddyGaY871xqtfp6ZsrrHxsC3cBNAgMBAAGjgeYwgeMwCQYD
VR0TBAIwADAOBgNVHQ8BAf8EBAMCBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsG
AQUFBwMCMB0GA1UdDgQWBBRmUnchuypEq3ya3yaBv6ELulVYwjAfBgNVHSMEGDAW
gBTgAZr27NHdAcGelW9FOc4BppBj5TBnBgNVHREEYDBeggtleGFtcGxlLmNvbYIP
d3d3LmV4YW1wbGUuY29thwRduNgihxAmBigAAiAAAQJIGJMlyBlGgRFhZG1pbkBl
eGFtcGxlLmNvbYYTaHR0cHM6Ly9leGFtcGxlLmNvbTANBgkqhkiG9w0BAQsFAAOC
AQEAfFTIjLSK2PekB0ivCLmhmDlBpYg6NuYT+jwmaEueLJbYAFFQt6Jioei4W3C8
OZ3fU2Ww8w7D/VUFPmOQ5ns0n9m1E/C86QIbINgp0tOWDEx0Er8pNP5Tpzy4U+j8
u6mL8PzD6s6mDwzXH/bl10aMVWYG6amg59qnYku/wojSjrVKX4EqKh8x7t39QOYb
1nZ4ShjG2rJJg8rE0YpvyTPwz5K0Thys/4ssWH6aMi+nuLhAoUumBn2Fd2VGuWiq
kPnqHP/ZbXAGXh78FaPxrRaLl8Us0zAaV5KIxPLGHrf1lyyuwc4XWF+w8u1Q4CBN
1nVGtNaIeuWp1syNtWI9h/PK3A==
-----END CERTIFICATE-----
`;
export const LEAF_EXPECTED = {
  subjectRaw: 'C=US, O=Example Inc, CN=example.com',
  issuerRaw: INTER_EXPECTED.subjectRaw,
  serialHex: '6ceb3696982a4abbb915fea320de44a899caa145',
  notBefore: '2026-07-21T21:44:41Z',
  notAfter: '2027-07-21T21:44:41Z',
  keySizeBits: 2048,
  sha1Fingerprint: '95658b75436609460575b8aade8a6e6a5346fee8',
  sha256Fingerprint: '7659d25e73fc7d52c7c6542bf305325c98f8c7dca6db499783d21d4f858e37ee',
  keyUsages: ['digitalSignature', 'keyEncipherment'],
  extendedKeyUsages: ['serverAuth', 'clientAuth'],
  skiHex: '66527721bb2a44ab7c9adf2681bfa10bba5558c2',
  akiHex: 'e0019af6ecd1dd01c19e956f4539ce01a69063e5',
  sanDnsNames: ['example.com', 'www.example.com'],
  sanIps: ['93.184.216.34', '2606:2800:220:1:248:1893:25c8:1946'],
  sanEmails: ['admin@example.com'],
  sanUris: ['https://example.com'],
};

// ---- EC (P-256) self-signed leaf ----------------------------------------------------
export const EC_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIBhzCCAS2gAwIBAgIUQFFto9EE64jVpusmAk5La/4jIL4wCgYIKoZIzj0EAwIw
GTEXMBUGA1UEAwwOZWMtZXhhbXBsZS5jb20wHhcNMjYwNzIxMjE0NTU2WhcNMjcw
NzIxMjE0NTU2WjAZMRcwFQYDVQQDDA5lYy1leGFtcGxlLmNvbTBZMBMGByqGSM49
AgEGCCqGSM49AwEHA0IABBkk2mf7yO2aNipz8V9Y6h+ytYWJ9mLSlSqTIDZ3MRcl
75WedSEVz803Wh4C2Lntxzm/99BNZayW0llQdJtL96ejUzBRMB0GA1UdDgQWBBRm
0e/qsmVBW2fZWYm80LBM44E8VjAfBgNVHSMEGDAWgBRm0e/qsmVBW2fZWYm80LBM
44E8VjAPBgNVHRMBAf8EBTADAQH/MAoGCCqGSM49BAMCA0gAMEUCIAr9RJhw5Qay
0EaayZaAemAITmg5F2XZAgVGUmMoRVTaAiEA70O+MBu8SMyJRfMnhVkZVhOhWq4S
ayIZHA/yCzRqw0Y=
-----END CERTIFICATE-----
`;
export const EC_EXPECTED = {
  keySizeBits: 256,
  curve: 'P-256',
};

// ---- Ed25519 self-signed leaf --------------------------------------------------------
export const ED_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIBRjCB+aADAgECAhQXIq8rg2q1DrjCQwJZWPLMY6cbCTAFBgMrZXAwGTEXMBUG
A1UEAwwOZWQtZXhhbXBsZS5jb20wHhcNMjYwNzIxMjE0NTU2WhcNMjcwNzIxMjE0
NTU2WjAZMRcwFQYDVQQDDA5lZC1leGFtcGxlLmNvbTAqMAUGAytlcAMhAItCySeq
GaNa/dPznulMOLkEfPmfdlBjdH+7SpSjucz6o1MwUTAdBgNVHQ4EFgQUV6/c0Ebu
qP7IVb2ws7NfOD+zmm8wHwYDVR0jBBgwFoAUV6/c0EbuqP7IVb2ws7NfOD+zmm8w
DwYDVR0TAQH/BAUwAwEB/zAFBgMrZXADQQDf+LQf49hmCLPRcMngi/pvQpVPgrMY
FVwSCjpVDdmzYVCwO5PlSuLSUjNZGZZp4EZfYEks7hdhqGN2zFwhg2UL
-----END CERTIFICATE-----
`;
export const ED_EXPECTED = {
  keySizeBits: 256,
  algorithm: 'Ed25519',
};

// ---- CSR — PKCS#10 with a requested SAN extension -----------------------------------
export const CSR_PEM = `-----BEGIN CERTIFICATE REQUEST-----
MIICtzCCAZ8CAQAwMDEYMBYGA1UEAwwPY3NyLWV4YW1wbGUuY29tMRQwEgYDVQQK
DAtFeGFtcGxlIEluYzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL4e
mqPmzZbK2h6kwpqKrdpDTJOwOvog8uiXo2cw6X7KhV+R6Rssj1pQX9E687oUfSWK
ss5q5cDVt1lmp0pHRdZy+Zd1zqSyEzXQcSUZuSC5AeLlZMjJ9f+lcY+cFoi3uMuk
tycGrnB4n+4LNGOP8QRYbGgfH0RPcDCC5gm4/PXXX2Qt0YjiX+0H1dpdm2WyFNrj
Hnt46YHaBWYGRInfj9m0MNQo5DW6XCBICUYgjZ/J5bHe6S1HRefYjTK65XxCKcrY
YSVpuuHn6qte+YTdersIaseIdENwFl8O5xGjXCgiG1QJrsb+c77UTut6hD5msOHd
VAp2EFRNDDVnRFL6hSMCAwEAAaBCMEAGCSqGSIb3DQEJDjEzMDEwLwYDVR0RBCgw
JoIPY3NyLWV4YW1wbGUuY29tghN3d3cuY3NyLWV4YW1wbGUuY29tMA0GCSqGSIb3
DQEBCwUAA4IBAQBHble8hIgQMP0SKziBD6OIONhOKiU8AyLvsLskww4dA+s7IkbF
USH+SygJQBjGJd6p3cKV0zz1CSBnEJWg/Z+89+dr8AaFK1zriC+vwfqId5ICmX7z
Ly1EEpSMf0NTag+G94z42Nyp4AGv4iedVqgdL5IpLfRAhp6fhr6weACEhMSJ2Thv
2UE5N0eefbgk4TwC4tYdu0Z3uEb7oxV/nZ4uINfaxQEbrgI4bLCGRoYUxa6K8Y8V
hY5hFV8lIU1TAUUMZtxG4E8tm0ZwjTKjQL9JRLNg7U1jJ0PTodBGrCHyv5Sne31Q
ZQgvympBdcuaah8pOc/NLEND2MRa4GavrEIL
-----END CERTIFICATE REQUEST-----
`;
export const CSR_EXPECTED = {
  subjectRaw: 'CN=csr-example.com, O=Example Inc',
  keySizeBits: 2048,
  sanDnsNames: ['csr-example.com', 'www.csr-example.com'],
};

export const GARBAGE_PEM = `-----BEGIN CERTIFICATE-----
dGhpcyBpcyBub3QgYSB2YWxpZCBjZXJ0aWZpY2F0ZQ==
-----END CERTIFICATE-----
`;

// EC private key matching EC_CERT_PEM's public key — used only to exercise PEM-bundle
// splitting (label bucketing). This package never parses private key material.
export const EC_PRIVATE_KEY_PEM = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIIU5wuUXPCq7TYTphd5P19UpXr2dgl2VcMJf1/NPjsW1oAoGCCqGSM49
AwEHoUQDQgAEGSTaZ/vI7Zo2KnPxX1jqH7K1hYn2YtKVKpMgNncxFyXvlZ51IRXP
zTdaHgLYue3HOb/30E1lrJbSWVB0m0v3pw==
-----END EC PRIVATE KEY-----
`;
