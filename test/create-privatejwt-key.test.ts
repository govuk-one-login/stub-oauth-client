import { randomUUID } from "crypto";
import { buildTokenRequest } from "../src/client";

describe("create private key jwt", () => {
  it("should create privatekeyjwt", async () => {
    const signingKey = {
      kty: "",
      d: "",
      use: "sig",
      crv: "P-256",
      kid: "",
      x: "",
      y: "",
      alg: "",
    };
    const jwtPayload = {
      iss: "ipv-core-stub-aws-build",
      sub: "ipv-core-stub-aws-build",
      aud: "https://review-hc.staging.account.gov.uk",
      exp: 4102444800,
      jti: randomUUID(),
    };
    const authorizationCode = "2afda6c0-ce8d-40cc-bb53-a316fcdea3f3";
    const redirect_uri = "https://cri.core.build.stubs.account.gov.uk/callback";

    const result = await buildTokenRequest({
      claims: { iss: jwtPayload.iss, sub: jwtPayload.sub, aud: jwtPayload.aud },
      sendersSigningKey: { ...signingKey },
      authorizationCode,
      redirect_uri,
    });

    expect(result).toBeNull();
  });
});
