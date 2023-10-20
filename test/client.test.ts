import { JWK } from "jose";
import { buildJarAuthorizationUrl } from "../src/client";
import { EnvConfig } from "../src/cri-crypto-utils/config/env-config";
import { vcClaimSet } from "../src/cri-crypto-utils/config/shared-claimset-config";
describe("buildJarAuthorizationUrl", () => {
  it("should build signed and then encrypted authorization Jar", async () => {
    const cri = await buildJarAuthorizationUrl({
      clientId: EnvConfig.clientId,
      audience: EnvConfig.audience,
      authorizationEndpoint: EnvConfig.authorizationEndpoint,
      redirectUrl: EnvConfig.redirectUrl,
      publicEncryptionKey: EnvConfig.publicEncryptionKeyBase64,
      privateSigningKey: EnvConfig.privateSigningKey as JWK | string,
      issuer: EnvConfig.issuer,
      customClaims: vcClaimSet,
    });
    console.log(cri);
  });
});
