import { PrivateJwtRequest } from "../../types";
import { EnvConfig } from "./env-config";

// Define the configuration as a TypeScript object
export const configJwtRequest: PrivateJwtRequest = {
  sendersSigningKey: JSON.parse(EnvConfig.privateSigningKeyJwk),
  claims: {
    iss: "ipv-core-stub-aws-build",
    sub: "ipv-core-stub-aws-build",
    aud: EnvConfig.audience,
  },
  // supply the generated authorization_code_value
  authorizationCode: "64d9f159-dd09-4b6f-aba3-4629e6a8aafb",
  redirect_uri: EnvConfig.redirectUrl,
};
