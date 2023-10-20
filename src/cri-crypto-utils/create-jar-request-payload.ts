import { JWTPayload } from "jose";
import { buildJarAuthorizationRequest } from "../client";
import { EnvConfig } from "./config/env-config";
import { vcClaimSet } from "./config/shared-claimset-config";
import { PrivateKeyType } from "../types";
/**
 * Use this when making initial request to the CRI's private-api /session
 * endpoint
 * Run with npx ts-node src/cri-crypto-utils/create-jar-request-payload.ts
 * or npm run jr
 * @param specifiedClaims // can be used to provide an entirely new shared-claims
 * vcClaimSet already contain a sample shared claims, use this like config
 * change values in there as needed.
 * @returns
 * {"client_id":"value-of-clientId", "request":"jwt.request.claims"}
 */
export const getJarAuthorizationPayload = async (specifiedClaims?: JWTPayload) => {
  try {
    const result = await buildJarAuthorizationRequest({
      clientId: EnvConfig.clientId,
      audience: EnvConfig.audience,
      authorizationEndpoint: EnvConfig.authorizationEndpoint,
      redirectUrl: EnvConfig.redirectUrl,
      publicEncryptionKey: EnvConfig.publicEncryptionKeyBase64,
      privateSigningKey: EnvConfig.privateSigningKey as PrivateKeyType,
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
