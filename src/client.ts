import { v4 as uuidv4 } from "uuid";
import { CompactEncrypt, importJWK, importPKCS8, JWK, JWTHeaderParameters, JWTPayload, SignJWT } from "jose";
import { BaseParams, JarAuthorizationParams, PrivateJwtRequest } from "./types";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";
import { randomUUID } from "crypto";

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
    signedJwt = await signJwtViaKms(jwtHeader, jwtPayload, params.privateSigningKeyId);
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

const signJwtViaKms = async (header: JWTHeaderParameters, payload: JWTPayload, keyId: string) => {
  const kmsClient = new KMSClient({});
  const jwtParts = {
    header: Buffer.from(JSON.stringify(header)).toString("base64url"),
    payload: Buffer.from(JSON.stringify(payload)).toString("base64url"),
    signature: "",
  };
  const message = Buffer.from(jwtParts.header + "." + jwtParts.payload);
  const signCommand = new SignCommand({
    Message: message,
    MessageType: "RAW",
    KeyId: keyId,
    SigningAlgorithm: "ECDSA_SHA_256",
  });
  const response = await kmsClient.send(signCommand);
  if (!response.Signature) {
    throw new Error(`Failed to sign JWT with KMS key ${keyId}`);
  }
  jwtParts.signature = Buffer.from(response.Signature).toString("base64url");
  return jwtParts.header + "." + jwtParts.payload + "." + jwtParts.signature;
};

export const buildSignedJwt = async (params: BaseParams) => {
  const jwtPayload = { ...buildBaseJwtPayload(params), ...params.customClaims };
  const signedJwt = await signJwt(jwtPayload, params);
  return signedJwt;
};

export const buildJarAuthorizationRequest = async (params: JarAuthorizationParams) => {
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

  return {
    client_id: params.clientId,
    request: encryptedSignedJwt,
  };
};

export const buildJarAuthorizationUrl = async (params: JarAuthorizationParams) => {
  return `${params.authorizationEndpoint}?${buildQueryString(await buildJarAuthorizationRequest(params))}`;
};

export const buildTokenRequest = async (params: PrivateJwtRequest) => {
  const jwtPayload = {
    ...params.claims,
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
    jti: randomUUID(),
  };
  const jwtHeader = {
    kid: "ipv-core-stub-2-from-mkjwk.org",
    alg: "ES256",
  };
  const key = await importJWK(params.sendersSigningKey, "ES256");
  const signedJwt = await new SignJWT(jwtPayload).setProtectedHeader(jwtHeader).sign(key);

  const data = new URLSearchParams([
    ["client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"],
    ["code", params.authorizationCode],
    ["grant_type", "authorization_code"],
    ["redirect_uri", params.redirect_uri],
    ["client_assertion", signedJwt],
  ]);
  return data.toString();
};
