export type BaseParams = {
  issuer: string;
  customClaims?: Record<string, unknown>;
} & ({ privateSigningKey: string } | { privateSigningKeyId: string });

export type SignedJwtParams = BaseParams;

export type JarAuthorizationParams = BaseParams & {
  clientId: string;
  audience: string;
  authorizationEndpoint: string;
  redirectUrl: string;
  publicEncryptionKey: string;
};
