## CRI crypto helpers:

This README provides info on 2 scripts:
- create-jar-request-payload
- create-private-key-jwt-request

### Overview
`create-jar-request-payload.ts` is used to create the payload needed
to make a request against the CRI's session endpoint.
Interacting with a CRI involves using a [JWT-Secured Authorization Request](https://www.rfc-editor.org/rfc/rfc9101.html) (JAR) which is signed and then encrypted this is used in the initial POST request to the CRI on the private-api `/session` endpoint. The session id obtain as result of this request is used for subsequent invocation of the CRI endpoints.

`create-private-key-jwt-request.ts` is used to create the payload
request to the token endpoint of the CRI. On successful, interaction with the CRI an authorization code is produced. This will be required when making a request to the CRI `/token` endpoint. This is POST request requires the
client to authenticate against to endpoint using the [private_key_jwt](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication) method 


### Prerequisite to running the scripts

First copy the `.env.template` to a `.env` and fill it in as necessary
Ensure node is installed and run npm i to install the package dependencies

#### Config
There are series of class in the `config` folder inside the orange-team directory. The classes should be treated as config are mean't to simply input into the script files, rather specifying them on the commandline.
- env-config.ts wraps the .env file
- private-key-jwt-auth-config.ts (has minimal for claims used to make a token request)
- shared-claimset-config contain a vcClaimSet which can be used in the JAR can change before running the test.

### Creating a JAR payload request
This involves running:
`npx ts-node src/orange-team/create-jar-request-payload.ts`
or
running `npm run jr`

the output would be of the following format:

```{"client_id":"value-of-clientId", "request":"jwt.request.claims"}```

The above output can then be used on the `/session` endpoint of the private-api of the CRI to retrieve a session-id. The session-id will be used for subsequent interaction involving the CRI.

### Creating a private-key-jwt-request authentication request

Run the following:
Before running ensure that the authorization code generated from a 
successful interaction with the CRI is supplied as the value of the `authorizationCode` key in private-key-jwt-auth-config 

`npx ts-node src/orange-team/create-private-key-jwt-request.ts`
or
running `npm run pr`

This would generate the output needed to make a request to the `/token` public-api endpoint of the CRI


