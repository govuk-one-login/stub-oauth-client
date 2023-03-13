import * as dotenv from "dotenv";
import { buildJarAuthorizationUrl, JarAuthorizationParams } from ".";

dotenv.config();

(async () => {
  try {
    const params: JarAuthorizationParams = {
      clientId: process.env.CLIENT_ID || "",
      issuer: process.env.ISSUER || "",
      audience: process.env.AUDIENCE || "",
      authorizationEndpoint: process.env.AUTHORIZATION_ENDPOINT || "",
      redirectUrl: process.env.REDIRECT_URL || "",
      privateSigningKey: process.env.PRIVATE_SIGNING_KEY || "",
      privateSigningKeyId: process.env.PRIVATE_SIGNING_KEY_ID || "",
      publicEncryptionKey: process.env.PUBLIC_ENCRYPTION_KEY || "",
    };
    const authorizationUrl = await buildJarAuthorizationUrl(params);
    console.log("Generated JAR authorization url:");
    console.log(authorizationUrl);
  } catch (e) {
    console.error(e);
  }
})();
