export type JarAuthorizationParams = {
  clientId: string;
  issuer: string;
  audience: string;
  authorizationEndpoint: string;
  redirectUrl: string;
  customClaims?: Record<string, unknown>;
  publicEncryptionKey: string;
} & ({ privateSigningKey: string } | { privateSigningKeyId: string });
