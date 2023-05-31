import * as dotenv from "dotenv";
import { buildSignedJwt, SignedJwtParams } from ".";

dotenv.config();

(async () => {
  try {
    const params: SignedJwtParams = {
      issuer: process.env.ISSUER || "",
      privateSigningKey: process.env.PRIVATE_SIGNING_KEY || "",
      customClaims: {
        sub: "urn:uuid:example",
        aud: "https://example.audience",
        vc: {
          evidence: [
            {
              validityScore: 2,
              strengthScore: 4,
              type: "IdentityCheck",
            },
          ],
          type: ["VerifiableCredential", "IdentityCheckCredential"],
        },
      },
    };
    const signedJwt = await buildSignedJwt(params);
    console.log(signedJwt);
  } catch (e) {
    console.error(e);
  }
})();
