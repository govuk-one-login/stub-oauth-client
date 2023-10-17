import * as dotenv from "dotenv";

dotenv.config();

export const EnvConfig = {
  clientId: process.env.CLIENT_ID || "",
  audience: process.env.AUDIENCE || "",
  subject: process.env.SUBJECT || "",
  authorizationEndpoint: process.env.AUTHORIZATION_ENDPOINT || "",
  redirectUrl: process.env.REDIRECT_URL || "",
  publicEncryptionKey: process.env.PUBLIC_ENCRYPTION_KEY || "",
  privateSigningKey: process.env.PRIVATE_SIGNING_KEY || "",
  issuer: process.env.ISSUER || "",
};
