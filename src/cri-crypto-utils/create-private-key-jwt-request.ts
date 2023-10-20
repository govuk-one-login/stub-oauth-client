import { buildPrivateKeyJwtParams } from "../client";
import { PrivateJwtParams } from "../types";
import { configJwtRequest } from "./config/private-key-jwt-auth-config";

/**
 * Run with npx ts-node src/cri-crypto-utils/create-private-key-jwt-request.ts
 * or npm run pr
 * NOTE: Ensure your supply authorizationCode in "private-key-config"
 * Enables creating form-url-encoded query params for allowing private-jwt-key authentication
 * to the public /token endpoint of the CRI.
 * @param request - The PrivateJwtRequest object.
 * @returns A form-url-encoded string params of the following:
 * - client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
 * - client_assertion="signed.jwt.(iss,aud,exp,jti)"
 * - redirect_uri="the callback url i.e. https://cri.core.build.stubs.account.gov.uk/callback"
 * - grant_type="authorization_code" (This is an Authorization Code flow OAuth profile)
 * - code="The authorization Code value generated on successful CRI interaction"
 */
const getPrivateJwtRequestParams = async (request: PrivateJwtParams): Promise<string> => {
  try {
    const tokenRequest = await buildPrivateKeyJwtParams(request);
    return JSON.stringify(tokenRequest);
  } catch (error) {
    console.error("Error while building token request:", error);
    return JSON.stringify({ error: "Failed to build token request" });
  }
};

(async () => {
  try {
    const result = await getPrivateJwtRequestParams(configJwtRequest);
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
    console.log(JSON.stringify({ error: "Invalid input JSON" }));
  }
})();
