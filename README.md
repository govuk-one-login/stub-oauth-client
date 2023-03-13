## Stub oauth client to act as a relying party (RP)

Shared library providing methods to stub parts of the JWT/authorization/token flows in the GOV.UK One Login journey.
So we can, for example, stub within performance test code itself rather than relying on stub frontends which present a bottleneck being hosted on PaaS,
and test different parts of the journey in isolation e.g. just auth, just IPV core, just a CRI.

### CLI tool

To use this simply as a CLI tool to generate an authorization JWT, first copy the `.env.template` to a `.env` and set the required parameters as below.
Then build the project with `npm run build` and run the main script with `npm run main` (requires node v16.x or higher). This will print a JAR authorization
url to the console.

### Importing as a library

Install via GitHub link (this will install and compile the TS source):
```
npm i git+ssh://git@github.com:alphagov/di-stub-oauth-client#<branch-name>
```

Import the method(s) you want to use:
```typescript
import { buildJarAuthorizationUrl } from 'di-stub-oauth-client';
```

Pass the required parameters as defined by the type.

For example, to generate a signed and encrypted JAR (JWT-secured Authorization Request) to hit the IPV core `authorize` endpoint:
```typescript
const ipvCoreAuthorizationUrl = await buildJarAuthorizationUrl({
  clientId: 'test-client',
  issuer: 'test-client',
  audience: '***',
  authorizationEndpoint: '***/oauth2/authorize',
  redirectUrl: '***',
  privateSigningKey: '***', // base-64 encoded private key to sign the JAR
  publicEncryptionKey: '***', // base-64 encoded public key to encrypt the JAR
});
```

This url will land you on the start of the IPV core journey under a random user id, skipping the RP and auth flows.

#### Private key signing via KMS

Instead of providing the raw `privateSigningKey` you can provide a KMS key ID via `privateSigningKeyId`. Your script will need to assume a suitable
role in the AWS account of the key you are using. 

For example you could use aws-vault:
```
aws-vault exec core-build -- <command to run your script>
```

#### Setting custom claims

You can optionally set `customClaims`, an object of additional claims which will be added to the JWT payload.
You can also use this to override any of the default claims such as `exp`.
