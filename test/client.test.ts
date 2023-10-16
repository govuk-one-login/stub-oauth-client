import { buildJarAuthorizationUrl } from "../src/client";
import { CustomClaims } from "../src/types";
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
      birthDate: [{ value: "1948-04-24" }],
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
      clientId: "ipv-core-stub-aws-build",
      audience: "https://review-hc.staging.account.gov.uk",
      authorizationEndpoint: "https://cri.core.build.stubs.account.gov.uk/oauth2/authorize",
      redirectUrl: "https://cri.core.build.stubs.account.gov.uk/callback",
      publicEncryptionKey:
        "ewogICJ1c2UiOiAiZW5jIiwKICAiYWxnIjogIkVTMjU2IiwKICAia3R5IjogIlJTQSIsCiAgImUiOiAiQVFBQiIsCiAgIm4iOiAib3A5bUZOUW1PdWc3TXdCRW5yaEpqWFAxSTRKMEhnb294cldvZG56S3ppRjJ2S0U4MHJETjZETmNXTG1KcEdlcWNvNHotbFpOQk9JRUc0MGh0X2JMLVc5bVVERi1JRk9jU0s0aHZKOXcyeHNsOHE3YnFxY3J2SFRNUXB3VU1HTzlQc0Jzb1cyWDZ2S0MzMFRWQ25GRktKUkgyYzBBYXUxTllzMGduRktJOUwxSjRacWJTQWlrNG81eW40dHdEQUV0N3VxWjRPMTdaSkhVdXVvNDdzeXNBYkhwczdHVHU5a1F1cFdzUU5QeC02UjhyT01QWVBrdnV6OWZta1lfWHc1R05JdGpiQklHVTdQV005bGZEVHVWRlRCNFVZNkJkVUZocE0tem90NGZsNFFRV09ISFdPSnlSMElCTjBWc01pTlBIeVRkcURtN3UwaEl0UGxPcGVsQjN3Igp9",
      /** https://github.com/govuk-one-login/ipv-config/blob/main/stubs/di-ipv-core-stub/.env#L4
       * Convert the above to JWK
       * i.e "value in .env" | base64 -D
       * or find /stubs/core/cri/env/CORE_STUB_SIGNING_PRIVATE_KEY_JWK_BASE64
       */
      privateSigningKey: {
        kty: "",
        d: "",
        use: "",
        crv: "",
        kid: "",
        x: "",
        y: "",
        alg: "",
      },
      issuer: "https://cri.core.build.stubs.account.gov.uk",
      customClaims: vcClaimSet,
    });
    expect(cri).toEqual(null);
  });
});
