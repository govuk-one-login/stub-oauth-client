export type JarAuthorizationParams = {
  clientId: string;
  issuer: string;
  audience: string;
  authorizationEndpoint: string;
  redirectUrl: string;
  privateSigningKey: string;
  publicEncryptionKey: string;
};
