import { importJWK, jwtVerify } from "jose";
import { buildPrivateKeyJwtParams } from "../src/client";
import { PrivateJwtParams } from "../src/types";
import { TestKeys } from "./test_keys";

describe("create private key jwt", () => {
  it("should create privatekeyjwt", async () => {
    const configJwtRequest = {
      customClaims: {
        iss: "ipv-core-stub-aws-build",
        sub: "ipv-core-stub-aws-build",
        aud: "https://review-toy.dev.account.gov.uk",
        exp: 41024444800,
      },
      authorizationCode: "19e46a1d-ee01-4245-b7c3-614d58f603bb",
      redirectUrl: "http://localhost:8085/callback",
      privateSigningKey: TestKeys.privateSigningJwk,
    } as PrivateJwtParams;
    const result = await buildPrivateKeyJwtParams(configJwtRequest);

    const params = new URLSearchParams(result);
    const jsonResult = Object.fromEntries(params.entries());
    expect(jsonResult["client_assertion_type"]).toBe("urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
    expect(jsonResult["grant_type"]).toBe("authorization_code");
    expect(jsonResult["code"]).toBe(configJwtRequest.authorizationCode);

    const signature = jsonResult["client_assertion"];
    const publicSigningVerifyingKey = await importJWK(TestKeys.publicVerifyingJwk, "ES256");
    const { payload } = await jwtVerify(signature, publicSigningVerifyingKey);

    expect(payload).toEqual({
      aud: "https://review-toy.dev.account.gov.uk",
      exp: 41024444800,
      iss: "ipv-core-stub-aws-build",
      sub: "ipv-core-stub-aws-build",
    });
  });
});
