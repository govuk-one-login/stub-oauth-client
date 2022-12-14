import base64 from "base-64";
import { v4 as uuidv4 } from "uuid";
import { CompactEncrypt, importJWK, importPKCS8, SignJWT } from "jose";
import { JarAuthorizationParams } from "./types";

const publicKeyToJwk = async (publicKey: string) => {
  const decoded = base64.decode(publicKey);
  const keyObject = JSON.parse(decoded);
  return await importJWK(keyObject, "RSA256");
};

const buildQueryString = (queryParams: Record<string, string>) => {
  return Object.entries(queryParams)
    .map((pair) => pair.map(encodeURIComponent).join("="))
    .join("&");
};

export const buildJarAuthorizationUrl = async (params: JarAuthorizationParams) => {
  const state = uuidv4();

  const signingKey = await importPKCS8(
    `-----BEGIN PRIVATE KEY-----\n${params.privateSigningKey}\n-----END PRIVATE KEY-----`,
    "ES256"
  );

  const signedJwt = await new SignJWT({
    client_id: params.clientId,
    redirect_uri: params.redirectUrl,
    response_type: "code",
    state,
    govuk_signin_journey_id: uuidv4(),
    persistent_session_id: uuidv4(),
  })
    .setProtectedHeader({ alg: "ES256" })
    .setIssuedAt()
    .setIssuer(params.issuer)
    .setAudience(params.audience)
    .setSubject(uuidv4())
    .setExpirationTime("5m")
    .setNotBefore("0m")
    .sign(signingKey);

  const encryptionKeyJwk = await publicKeyToJwk(params.publicEncryptionKey);
  const encryptedSignedJwt = await new CompactEncrypt(new TextEncoder().encode(signedJwt))
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .encrypt(encryptionKeyJwk);

  return `${params.authorizationEndpoint}?${buildQueryString({
    client_id: params.clientId,
    redirect_uri: params.redirectUrl,
    response_type: "code",
    scope: "openid",
    state,
    request: encryptedSignedJwt,
  })}`;
};
