import { buildPrivateKeyJwtParams } from "../src/client";
import { configJwtRequest } from "../src/cri-crypto-utils/config/private-key-jwt-auth-config";

describe("create private key jwt", () => {
  it("should create privatekeyjwt", async () => {
    const result = await buildPrivateKeyJwtParams(configJwtRequest);

    console.log(result);
  });
});
