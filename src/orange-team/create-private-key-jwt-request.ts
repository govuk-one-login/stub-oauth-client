import { buildTokenRequest } from "../client";
import { PrivateJwtRequest } from "../types";
import { configJwtRequest } from "./private-key-config";

/**
 * Run with npx ts-node src/orange-team/create-privatekeyJwt-request.ts
 * NOTE: Ensure your supply authorizationCode in "private-key-config"
 * Retrieves private JWT request parameters and returns them as a JSON string.
 * @param request - The PrivateJwtRequest object.
 * @returns A JSON string representing the request parameters.
 */
const getPrivateJwtRequestParams = async (request: PrivateJwtRequest): Promise<string> => {
  try {
    const tokenRequest = await buildTokenRequest(request);
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
