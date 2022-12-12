import * as dotenv from 'dotenv';
dotenv.config();
import { createHash, createPrivateKey } from "node:crypto";
import { AuthorizationParameters, ClientMetadata, generators, Issuer } from "openid-client";

const SCOPES = [
  "openid",
  "email",
  "phone",
  "offline_access"
];
const VTR = `["P2.Cl.Cm"]`;

const hash = (value: string) => {
  return createHash("sha256").update(value).digest("base64url");
};

const getAuthorizationUrl = async () => {
  const clientMetadata: ClientMetadata = {
    client_id: process.env.CLIENT_ID || "",
    token_endpoint_auth_method: "private_key_jwt",
    token_endpoint_auth_signing_alg: "PS256",
    id_token_signed_response_alg: "ES256",
  };

  const jwk = createPrivateKey({
    key: Buffer.from(process.env.PRIVATE_KEY || "", "base64"),
    type: "pkcs8",
    format: "der",
  }).export({ format: "jwk" });

  const { metadata: issuerMetadata } = await Issuer.discover(process.env.DISCOVERY_ENDPOINT || "");
  const issuer = new Issuer(issuerMetadata);

  const client = new issuer.Client(clientMetadata, {
    keys: [jwk]
  });
  
  const nonce = generators.nonce();
  const state = generators.state();

  const authorizationParameters: AuthorizationParameters = {
    redirect_uri: process.env.REDIRECT_URL,
    response_type: "code",
    scope: SCOPES.join(" "),
    state: hash(state),
    nonce: hash(nonce),
    vtr: VTR,
    ui_locales: "en-GB en"
  };

  return client.authorizationUrl(authorizationParameters);
}

(async () => {
  try {
    const authorizationUrl = await getAuthorizationUrl();
    console.log("Here's your authorization url: " + authorizationUrl);
  } catch (e) {
    console.error(e);
  }
})();
