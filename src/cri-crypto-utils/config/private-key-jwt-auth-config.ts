import { EnvConfig } from "./env-config";
import { randomUUID } from "crypto";
import { PrivateJwtParams, PrivateKeyType } from "../../types";
if (typeof process.env.npm_config_code === "undefined") {
  throw new Error("Specify AuthorizationCode i.e. npm run pr --code='code value here'");
}
// Define the configuration as a TypeScript object
export const configJwtRequest = (() =>
  ({
    customClaims: {
      iss: "ipv-core-stub-aws-build",
      sub: "ipv-core-stub-aws-build",
      aud: EnvConfig.audience,
      exp: 41024444800,
      jti: randomUUID(),
    },
    // supply the generated authorization_code_value
    authorizationCode: process.env.npm_config_code,
    redirectUrl: EnvConfig.redirectUrl,
    privateSigningKey: EnvConfig.privateSigningKey as PrivateKeyType,
    privateSigningKeyId: EnvConfig.privateSigningKeyId,
  } as PrivateJwtParams))();
