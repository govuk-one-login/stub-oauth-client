import { randomUUID } from "crypto";
import { buildTokenRequest } from "../src/client";
import { configJwtRequest } from "../src/orange-team/config/private-key-jwt-auth-config";

describe("create private key jwt", () => {
  it("should create privatekeyjwt", async () => {
    const jwtPayload = {
      ...configJwtRequest.claims,
      exp: 4102444800,
      jti: randomUUID(),
    };

    const result = await buildTokenRequest({
      claims: { iss: jwtPayload.iss, sub: jwtPayload.sub, aud: jwtPayload.aud },
      sendersSigningKey: { ...configJwtRequest.sendersSigningKey },
      authorizationCode: configJwtRequest.authorizationCode,
      redirect_uri: configJwtRequest.redirect_uri,
    });

    expect(result).toBe(
      "client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer&code=authorization_code_value&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fcri.core.build.stubs.account.gov.uk%2Fcallback&client_assertion=eyJraWQiOiJpcHYtY29yZS1zdHViLTItZnJvbS1ta2p3ay5vcmciLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJpcHYtY29yZS1zdHViLWF3cy1idWlsZCIsInN1YiI6Imlwdi1jb3JlLXN0dWItYXdzLWJ1aWxkIiwiYXVkIjoiaHR0cHM6Ly9yZXZpZXctaGMuc3RhZ2luZy5hY2NvdW50Lmdvdi51ayIsImV4cCI6MTY5NzYyNTc0OSwianRpIjoiZDE0NGY5NDktNzU2Mi00MjdiLWFmOTEtMDQxYTUwMzk0MGE2In0.ldLnGIHXuy_VEdRBJoBAmMczYC24CCxa48mqpflDsgx0Z_OUervLlGXNm632y8nkuxRuBVweQd2Dh3_2FixlTQ"
    );
  });
});
