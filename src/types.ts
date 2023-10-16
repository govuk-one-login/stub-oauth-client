import { JWK } from "jose";

export type CustomClaims = {
  sub?: string;
  shared_claims?: Record<string, unknown>;
  vc?: Record<string, unknown>;
  iss?: string;
  persistent_session_id?: string;
  response_type?: string;
  client_id?: string;
  govuk_signin_journey_id?: string;
  aud?: string;
  nbf?: number;
  scope?: string;
  redirect_uri?: string;
  state?: string;
  exp?: number;
  iat?: number;
};
export type PrivateKeyType = { privateSigningKey: string | JWK } | { privateSigningKeyId: string } 
export type BaseParams = {
  issuer: string;
  customClaims?: CustomClaims;
} & PrivateKeyType;

export type SignedJwtParams = BaseParams;

export type JarAuthorizationParams = BaseParams & {
  clientId: string;
  audience: string;
  authorizationEndpoint: string;
  redirectUrl: string;
  publicEncryptionKey: string;
};
