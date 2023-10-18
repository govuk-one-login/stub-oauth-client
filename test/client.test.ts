import { buildJarAuthorizationUrl } from "../src/client";
import { CustomClaims } from "../src/types";
import { EnvConfig } from "../src/orange-team/env-config";

describe("buildJarAuthorizationUrl", () => {
  const vcClaimSet: CustomClaims = {
    sub: "urn:fdc:gov.uk:2022:0df67954-5537-4c98-92d9-e95f0b2e6f44",
    shared_claims: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://vocab.london.cloudapps.digital/contexts/identity-v1.jsonld",
      ],
      name: [
        {
          nameParts: [
            { type: "GivenName", value: "Jim" },
            { type: "FamilyName", value: "Ferguson" },
          ],
        },
      ],
      birthDate: [{ value: "1948-04-23" }],
      address: [
        {
          buildingNumber: "",
          buildingName: "",
          streetName: "",
          addressLocality: "",
          postalCode: "",
          validFrom: "2021-01-01",
        },
      ],
    },
    iss: "https://cri.core.build.stubs.account.gov.uk",
    persistent_session_id: "a67c497b-ac49-46a0-832c-8e7864c6d4cf",
    response_type: "code",
    client_id: "ipv-core-stub-aws-build",
    govuk_signin_journey_id: "84521e2b-43ab-4437-a118-f7c3a6d24c8e",
    aud: "https://review-hc.staging.account.gov.uk",
    nbf: 1697516406,
    scope: "openid",
    redirect_uri: "https://cri.core.build.stubs.account.gov.uk/callback",
    state: "diWgdrCGYnjrZK7cMPEKwJXvpGn6rvhCBteCl_I2ejg",
    exp: 4102444800,
    iat: 1697516406,
  };
  it("should build signed and then encrypted authorization Jar", async () => {
    const cri = await buildJarAuthorizationUrl({
      clientId: EnvConfig.clientId,
      audience: EnvConfig.audience,
      authorizationEndpoint: EnvConfig.authorizationEndpoint,
      redirectUrl: EnvConfig.redirectUrl,
      publicEncryptionKey: EnvConfig.publicEncryptionKey,
      /** https://github.com/govuk-one-login/ipv-config/blob/main/stubs/di-ipv-core-stub/.env#L4
       * Convert the above to JWK
       * i.e "value in .env" | base64 -D
       * or find /stubs/core/cri/env/CORE_STUB_SIGNING_PRIVATE_KEY_JWK_BASE64
       */
      privateSigningKey: JSON.parse(EnvConfig.privateSigningKey),
      issuer: EnvConfig.issuer,
      customClaims: vcClaimSet,
    });
    expect(cri).toEqual(null);
  });
});
