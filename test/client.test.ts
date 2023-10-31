import { compactDecrypt, importJWK, jwtVerify } from "jose";
import { buildJarAuthorizationRequest } from "../src/client";
import { vcClaimSet } from "../src/cri-crypto-utils/config/shared-claimset-config";
import { TestKeys } from "./test_keys";
describe("buildJarAuthorizationUrl", () => {
  it("should build signed and then encrypted authorization Jar", async () => {
    const jweRequest = await buildJarAuthorizationRequest({
      clientId: "some-clientId",
      audience: "some-audience",
      authorizationEndpoint: "https://review-toy.dev.account.gov.uk/oauth2/authorize",
      redirectUrl: "http://localhost:8085/callback",
      publicEncryptionKey: TestKeys.publicEncryptionKey,
      privateSigningKey: TestKeys.privateSigningJwk,
      issuer: "https://review-toy.dev.account.gov.uk",
      customClaims: vcClaimSet,
    });
    const privatekey = await importJWK(TestKeys.privateEncryptionKey);

    const { plaintext } = await compactDecrypt(jweRequest.request, privatekey);
    const encodedJwt = new TextDecoder().decode(plaintext);
    const publicSigningVerifyingKey = await importJWK(TestKeys.publicVerifyingJwk, "ES256");
    const { payload } = await jwtVerify(encodedJwt, publicSigningVerifyingKey);

    expect(jweRequest.client_id).toBe("some-clientId");
    expect(payload).toEqual(vcClaimSet);
  });
});
