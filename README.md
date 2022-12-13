## (EXPERIMENTAL) Stub oauth client to act as a relying party (RP)

Shared library providing methods to stub parts of the JWT/authorization/token flows in the GOV.UK One Login journey.
So we can, for example, stub within performance test code itself rather than relying on stub frontends which present a bottleneck being hosted on PaaS,
and test different parts of the journey in isolation e.g. just auth, just IPV core, just a CRI.

### Example usage

Install and import the method(s) you want to use:
```typescript
import { buildJarAuthorizationUrl } from 'di-stub-oauth-client';
```

Pass the required parameters as defined by the type.

For example, to generate a signed and encrypted JAR (JWT-secured Authorization Request) to hit the IPV core `authorize` endpoint:
```typescript
const ipvCoreAuthorizationUrl = await buildJarAuthorizationUrl({
  clientId: 'test-client',
  issuer: 'core',
  audience: '***',
  authorizationEndpoint: '***/oauth2/authorize',
  redirectUrl: '***',
  privateSigningKey: '***', // base-64 encoded private key to sign the JAR
  publicEncryptionKey: '***', // base-64 encoded public key to encrypt the JAR
});
```

This url will land you on the start of the IPV core journey under a random user id, skipping the RP and auth flows.
