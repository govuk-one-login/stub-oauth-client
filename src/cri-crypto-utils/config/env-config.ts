import * as dotenv from "dotenv";
import { JWK } from "jose";

dotenv.config();

type IEnvConfig = {
  clientId: string;
  audience: string;
  subject: string;
  authorizationEndpoint: string;
  redirectUrl: string;
  publicEncryptionKeyBase64: string;
  issuer: string;
  privateSigningKey?: string | JWK;
  privateSigningKeyId?: string;
};

export const EnvConfig: IEnvConfig = (() => {
  dotenv.config();

  const safeParseJSON = (value?: string): JWK | string => {
    try {
      return JSON.parse(value || "");
    } catch (error) {
      return value as string;
    }
  };

  const config: IEnvConfig = {
    clientId: process.env.CLIENT_ID as string,
    audience: process.env.AUDIENCE as string,
    subject: process.env.SUBJECT as string,
    authorizationEndpoint: process.env.AUTHORIZATION_ENDPOINT as string,
    redirectUrl: process.env.REDIRECT_URL as string,
    publicEncryptionKeyBase64: process.env.PUBLIC_ENCRYPTION_KEY as string,
    issuer: process.env.ISSUER as string,
  };

  if (process.env.PRIVATE_SIGNING_KEY) {
    config.privateSigningKey = safeParseJSON(process.env.PRIVATE_SIGNING_KEY);
  } else {
    config.privateSigningKeyId = process.env.PRIVATE_SIGNING_KEY_ID;
  }

  return config;
})();
