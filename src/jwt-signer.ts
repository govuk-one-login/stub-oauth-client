import { KMSClient, MessageType, SignCommand, SigningAlgorithmSpec } from "@aws-sdk/client-kms";
import { createHash } from "crypto";
import sigFormatter from "ecdsa-sig-formatter";
import { JWEHeaderParameters, base64url } from "jose";

export class JwtSigner {
  constructor(private readonly kmsClient: KMSClient, private readonly getSigningKmsKeyId: () => string) {}

  public async createSignedJwt(claimsSet: object): Promise<string> {
    const header = this.getJwtHeader(this.getSigningKmsKeyId());
    const jwtHeader = base64url.encode(JSON.stringify(header));
    const jwtPayload = base64url.encode(JSON.stringify(claimsSet));

    const response = await this.signWithKms(jwtHeader, jwtPayload, header.kid as string);

    const signature = sigFormatter.derToJose(Buffer.from(response).toString("base64"), "ES256");

    return `${jwtHeader}.${jwtPayload}.${signature}`;
  }

  private async signWithKms(jwtHeader: string, jwtPayload: string, KeyId: string): Promise<Uint8Array> {
    const signingHash = this.getSigningInputHash(`${jwtHeader}.${jwtPayload}`);

    try {
      const signingResponse = await this.kmsClient.send(
        new SignCommand({
          KeyId,
          Message: signingHash,
          SigningAlgorithm: SigningAlgorithmSpec.ECDSA_SHA_256,
          MessageType: MessageType.DIGEST,
        })
      );

      if (!signingResponse?.Signature) {
        throw new Error("KMS response does not contain a valid Signature.");
      }

      return signingResponse.Signature;
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        throw new Error(`KMS response is not in JSON format. ${error}`);
      } else if (error instanceof Error) {
        throw new Error(`KMS signing error: ${error}`);
      } else {
        throw new Error(`An unknown error occurred while signing with KMS: ${error}`);
      }
    }
  }

  private getSigningInputHash(input: string): Uint8Array {
    return createHash("sha256").update(Buffer.from(input)).digest();
  }

  private getJwtHeader(kid?: string): JWEHeaderParameters {
    if (!kid) {
      throw Error("Signing Kms KeyId is missing");
    }
    return {
      kid,
      typ: "JWT",
      alg: "ES256",
    };
  }
}
