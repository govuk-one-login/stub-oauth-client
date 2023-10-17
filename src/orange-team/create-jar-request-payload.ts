import { buildJarAuthorizationRequest } from "../client";
import { CustomClaims } from "../types";
import { EnvConfig } from "./env-config";
import { vcClaimSet } from "./shared-claimset-config";

/**
 * Run with npx ts-node src/orange-team/create-jar-request-payload.ts
 * @param specifiedClaims
 * @returns
 */
export const getJarAuthorizationPayload = async (specifiedClaims?: CustomClaims) => {
  try {
    const result = await buildJarAuthorizationRequest({
      clientId: EnvConfig.clientId,
      audience: EnvConfig.audience,
      authorizationEndpoint: EnvConfig.authorizationEndpoint,
      redirectUrl: EnvConfig.redirectUrl,
      publicEncryptionKey: EnvConfig.publicEncryptionKey,
      privateSigningKey: JSON.parse(EnvConfig.privateSigningKey),
      issuer: EnvConfig.issuer,
      customClaims: specifiedClaims || vcClaimSet,
    });
    return result;
  } catch (error) {
    console.error("Error building Jar Authorization Request:", error);
    return null;
  }
};

(async () => {
  try {
    // modify vcClaimSet i.e. shared-claimset-config to make request
    const result = await getJarAuthorizationPayload(vcClaimSet);
    if (result) {
      console.log(JSON.stringify(result));
    } else {
      console.error("Jar Authorization Request was not created due to errors.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
