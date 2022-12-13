import { createPrivateKey, randomUUID } from "node:crypto";
import { ClientMetadata, generators, Issuer } from "openid-client";
import { CompactEncrypt, importJWK } from "jose";
import { JarAuthorizationParams } from "./types";

const publicKeyToJwk = async (publicKey: string) => {
  const keyBuffer = Buffer.from(publicKey, "base64");
  const keyObject = JSON.parse(keyBuffer.toString("ascii"));
  return await importJWK(keyObject, "RSA256");
};

export const buildJarAuthorizationUrl = async (params: JarAuthorizationParams) => {
  const clientMetadata: ClientMetadata = {
    client_id: params.clientId,
    request_object_signing_alg: "ES256",
  };

  const signingKeyJwk = createPrivateKey({
    key: Buffer.from(params.privateSigningKey, "base64"),
    type: "pkcs8",
    format: "der",
  }).export({ format: "jwk" });

  const issuer = new Issuer({
    issuer: params.issuer,
    authorization_endpoint: params.authorizationEndpoint,
  });

  const client = new issuer.Client(clientMetadata, {
    keys: [signingKeyJwk],
  });

  const state = generators.state();

  const signedRequestObject = await client.requestObject({
    sub: randomUUID(),
    aud: params.audience,
    response_type: "code",
    redirect_uri: params.redirectUrl,
    nbf: Math.trunc(new Date().getTime() / 1000),
    state,
    govuk_signin_journey_id: randomUUID(),
    persistent_session_id: randomUUID(),
  });

  const encryptionKeyJwk = await publicKeyToJwk(params.publicEncryptionKey);
  const encryptedRequestObject = await new CompactEncrypt(new TextEncoder().encode(signedRequestObject))
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .encrypt(encryptionKeyJwk);

  return client.authorizationUrl({
    redirect_uri: params.redirectUrl,
    response_type: "code",
    scope: "openid",
    state,
    request: encryptedRequestObject,
  });
};
