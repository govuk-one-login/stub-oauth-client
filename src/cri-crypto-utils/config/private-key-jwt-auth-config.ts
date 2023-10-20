import { EnvConfig } from "./env-config";
import { randomUUID } from "crypto";
import { PrivateJwtParams, PrivateKeyType } from "../../types";

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
    authorizationCode: "19e46a1d-ee01-4245-b7c3-614d58f603bb",
    redirectUrl: EnvConfig.redirectUrl,
    privateSigningKey: EnvConfig.privateSigningKey as PrivateKeyType,
    //privateSigningKeyId: EnvConfig.privateSigningKeyId
  } as PrivateJwtParams))();
