import { PrivateJwtRequest } from "../types";
import { EnvConfig } from "./env-config";

// Define the configuration as a TypeScript object
export const configJwtRequest: PrivateJwtRequest = {
  sendersSigningKey: JSON.parse(EnvConfig.privateSigningKey),
  claims: {
    iss: "ipv-core-stub-aws-build",
    sub: "ipv-core-stub-aws-build",
    aud: EnvConfig.audience,
  },
  // supply the generated authorization_code_value
  authorizationCode: "authorization_code_value",
  redirect_uri: EnvConfig.redirectUrl,
};
