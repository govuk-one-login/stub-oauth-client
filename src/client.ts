import { v4 as uuidv4 } from "uuid";
import { CompactEncrypt, importJWK, importPKCS8, JWK, JWTHeaderParameters, JWTPayload, SignJWT } from "jose";
import { BaseParams, JarAuthorizationParams, PrivateKeyType } from "./types";
import { KMSClient } from "@aws-sdk/client-kms";
import { JwtSigner } from "./jwt-signer";

const publicKeyToJwk = async (publicKey: string) => {
  const decoded = Buffer.from(publicKey, "base64").toString();
  const keyObject = JSON.parse(decoded);
  return await importJWK(keyObject, "RSA256");
};

const buildQueryString = (queryParams: Record<string, string>) => {
  return Object.entries(queryParams)
    .map((pair) => pair.map(encodeURIComponent).join("="))
    .join("&");
};

const msToSeconds = (ms: number) => Math.round(ms / 1000);

const buildBaseJwtPayload = (params: BaseParams) => {
  const baseJwtPayload: JWTPayload = {
    iss: params.issuer,
    iat: ((params as Record<string, unknown>)["iat"] as number) || msToSeconds(new Date().getTime()),
    nbf: ((params as Record<string, unknown>)["nbf"] as number) || msToSeconds(new Date().getTime()),
    exp: ((params as Record<string, unknown>)["exp"] as number) || msToSeconds(new Date().getTime() + 5 * 60 * 1000),
  };

  return baseJwtPayload;
};

const isJWK = (key: string | JWK): boolean => typeof key === "object" && key !== null;

const signJwt = async (jwtPayload: JWTPayload, params: BaseParams) => {
  const jwtHeader: JWTHeaderParameters = { alg: "ES256", typ: "JWT" };
  let signedJwt: string;
  if ("privateSigningKeyId" in params && params.privateSigningKeyId) {
    (jwtHeader.typ = "JWT"), (jwtHeader.kid = params.privateSigningKeyId), (jwtHeader.kid = params.privateSigningKeyId);
    const jwtSigner = new JwtSigner(new KMSClient({}), () => params.privateSigningKeyId);
    const vcClaimSet = params.customClaims;
    signedJwt = await jwtSigner.createSignedJwt(vcClaimSet as object);
    console.dir(jwtPayload);
  } else if ("privateSigningKey" in params && params.privateSigningKey && !isJWK(params.privateSigningKey)) {
    const signingKey = await importPKCS8(
      `-----BEGIN PRIVATE KEY-----\n${params.privateSigningKey}\n-----END PRIVATE KEY-----`,
      "ES256"
    );
    signedJwt = await new SignJWT(jwtPayload).setProtectedHeader(jwtHeader).sign(signingKey);
  } else if ("privateSigningKey" in params && params.privateSigningKey && isJWK(params.privateSigningKey)) {
    const signingKey = await importJWK(params.privateSigningKey as JWK, "ES256");
    signedJwt = await new SignJWT(jwtPayload).setProtectedHeader(jwtHeader).sign(signingKey);
  } else {
    throw new Error("No signing key provided!");
  }
  return signedJwt;
};

export const buildSignedJwt = async (params: BaseParams) => {
  const jwtPayload = { ...buildBaseJwtPayload(params), ...params.customClaims };
  const signedJwt = await signJwt(jwtPayload, params);
  return signedJwt;
};

export const buildJarAuthorizationUrl = async (params: JarAuthorizationParams) => {
  const jwtPayload: JWTPayload = {
    ...buildBaseJwtPayload(params),
    client_id: params.clientId,
    redirect_uri: params.redirectUrl,
    response_type: "code",
    state: (params as Record<string, unknown>)["state"] || uuidv4(),
    govuk_signin_journey_id: uuidv4(),
    sub: ((params as Record<string, unknown>)["sub"] as string) || uuidv4(),
    aud: params.audience,
    ...params.customClaims,
  };

  const signedJwt = await signJwt(jwtPayload, params);

  const encryptionKeyJwk = await publicKeyToJwk(params.publicEncryptionKey);
  const encryptedSignedJwt = await new CompactEncrypt(new TextEncoder().encode(signedJwt))
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .encrypt(encryptionKeyJwk);

  return `${params.authorizationEndpoint}?${buildQueryString({
    client_id: params.clientId,
    request: encryptedSignedJwt,
  })}`;
};
