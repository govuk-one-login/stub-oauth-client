import { randomUUID } from "crypto";
import { buildTokenRequest } from "../src/client";
import * as dotenv from "dotenv";
import { configJwtRequest } from "../src/orange-team/private-key-config";

dotenv.config();
describe("create private key jwt", () => {
  it("should create privatekeyjwt", async () => {
    const signingKey = configJwtRequest.sendersSigningKey;
    const jwtPayload = {
      iss: configJwtRequest.claims.iss,
      sub: configJwtRequest.claims.sub,
      aud: configJwtRequest.claims.aud,
      exp: 4102444800,
      jti: randomUUID(),
    };
    const authorizationCode = configJwtRequest.authorizationCode;
    const redirect_uri = configJwtRequest.redirect_uri;

    const result = await buildTokenRequest({
      claims: { iss: jwtPayload.iss, sub: jwtPayload.sub, aud: jwtPayload.aud },
      sendersSigningKey: { ...signingKey },
      authorizationCode,
      redirect_uri,
    });

    expect(result).toBe(
      "client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer&code=authorization_code_value&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fcri.core.build.stubs.account.gov.uk%2Fcallback&client_assertion=eyJraWQiOiJpcHYtY29yZS1zdHViLTItZnJvbS1ta2p3ay5vcmciLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJpcHYtY29yZS1zdHViLWF3cy1idWlsZCIsInN1YiI6Imlwdi1jb3JlLXN0dWItYXdzLWJ1aWxkIiwiYXVkIjoiaHR0cHM6Ly9yZXZpZXctaGMuc3RhZ2luZy5hY2NvdW50Lmdvdi51ayIsImV4cCI6MTY5NzYyNTc0OSwianRpIjoiZDE0NGY5NDktNzU2Mi00MjdiLWFmOTEtMDQxYTUwMzk0MGE2In0.ldLnGIHXuy_VEdRBJoBAmMczYC24CCxa48mqpflDsgx0Z_OUervLlGXNm632y8nkuxRuBVweQd2Dh3_2FixlTQ"
    );
  });
});
