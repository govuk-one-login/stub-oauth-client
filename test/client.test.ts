import { buildJarAuthorizationUrl } from "../src/client";
import { EnvConfig } from "../src/orange-team/config/env-config";
import { vcClaimSet } from "../src/orange-team/config/shared-claimset-config";
describe("buildJarAuthorizationUrl", () => {
  it("should build signed and then encrypted authorization Jar", async () => {
    const cri = await buildJarAuthorizationUrl({
      clientId: EnvConfig.clientId,
      audience: EnvConfig.audience,
      authorizationEndpoint: EnvConfig.authorizationEndpoint,
      redirectUrl: EnvConfig.redirectUrl,
      publicEncryptionKey: EnvConfig.publicEncryptionKeyBase64,
      privateSigningKey: JSON.parse(EnvConfig.privateSigningKeyJwk),
      issuer: EnvConfig.issuer,
      customClaims: vcClaimSet,
    });
    expect(cri).toEqual(null);
  });
});
