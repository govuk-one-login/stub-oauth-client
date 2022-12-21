import { v4 as uuidv4 } from "uuid";
import { CompactEncrypt, importJWK, importPKCS8, JWTHeaderParameters, JWTPayload, SignJWT } from "jose";
import { JarAuthorizationParams } from "./types";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";

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

export const buildJarAuthorizationUrl = async (params: JarAuthorizationParams) => {
  const jwtPayload: JWTPayload = {
    client_id: params.clientId,
    redirect_uri: params.redirectUrl,
    response_type: "code",
    state: uuidv4(),
    govuk_signin_journey_id: uuidv4(),
    sub: uuidv4(),
    iss: params.issuer,
    aud: params.audience,
    iat: msToSeconds(new Date().getTime()),
    nbf: msToSeconds(new Date().getTime()),
    exp: msToSeconds(new Date().getTime() + 5 * 60 * 1000),
    ...params.customClaims,
  };

  const jwtHeader: JWTHeaderParameters = { alg: "ES256" };
  let signedJwt: string;
  if ("privateSigningKeyId" in params) {
    signedJwt = await signJwtViaKms(jwtHeader, jwtPayload, params.privateSigningKeyId);
  } else {
    const signingKey = await importPKCS8(
      `-----BEGIN PRIVATE KEY-----\n${params.privateSigningKey}\n-----END PRIVATE KEY-----`,
      "ES256"
    );
    signedJwt = await new SignJWT(jwtPayload).setProtectedHeader(jwtHeader).sign(signingKey);
  }

  const encryptionKeyJwk = await publicKeyToJwk(params.publicEncryptionKey);
  const encryptedSignedJwt = await new CompactEncrypt(new TextEncoder().encode(signedJwt))
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .encrypt(encryptionKeyJwk);

  return `${params.authorizationEndpoint}?${buildQueryString({
    client_id: params.clientId,
    request: encryptedSignedJwt,
  })}`;
};
