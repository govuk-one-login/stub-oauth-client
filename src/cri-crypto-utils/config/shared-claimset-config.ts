import { JWTPayload } from "jose";

export const vcClaimSet = (() =>
  ({
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
  } as JWTPayload))();
