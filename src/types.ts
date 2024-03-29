import { JWK, JWTPayload } from "jose";

export type PrivateKeyType = { privateSigningKey: string | JWK } | { privateSigningKeyId: string };
export type BaseParams = {
  issuer?: string;
  customClaims?: JWTPayload;
} & PrivateKeyType;

export type SignedJwtParams = BaseParams;

export type JarAuthorizationParams = BaseParams & {
  clientId: string;
  audience: string;
  authorizationEndpoint: string;
  redirectUrl: string;
  publicEncryptionKey: string;
};

export type PrivateJwtParams = BaseParams & {
  authorizationCode: string;
  redirectUrl: string;
};
