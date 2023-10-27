export class TestKeys {
  static privateSigningJwk = {
    kty: "EC",
    d: "_0A_bq8i4sKtrlRMJrYWO5OoZnT1PeJjTAFN1pj-nIg",
    use: "sig",
    crv: "P-256",
    kid: "qs1Pk2hlU7yi1ZS8KahLWiPbkS4sg2rN2_SZNCwjR0c",
    x: "bmq8WpXGO6zpasLAd_ESqKlFXp99kgfydj0apnQ3Wyw",
    y: "xaS8yXipEFCk_KJxp3V5wz2cFeWVnwTp4zGL9Qc4CAY",
    alg: "ES256",
  };

  static publicVerifyingJwk = {
    kty: "EC",
    use: "sig",
    crv: "P-256",
    kid: "qs1Pk2hlU7yi1ZS8KahLWiPbkS4sg2rN2_SZNCwjR0c",
    x: "bmq8WpXGO6zpasLAd_ESqKlFXp99kgfydj0apnQ3Wyw",
    y: "xaS8yXipEFCk_KJxp3V5wz2cFeWVnwTp4zGL9Qc4CAY",
    alg: "ES256",
  };

  static privateEncryptionKey = {
    p: "8FlU1lddJFpkboh_mLvvtf6C3sXMVFlqX58DCyd2mwA1vFNB-Bh5kGoittWCoKkcJsl6x8NJfNt3XrVJbJBoKDm08SQQ7fzhCXSQywhXUZ8phee83O98YhOIj7doFOQbxzlSjAR_uplfqeHzdWMLm73ItqAcbCeQFtiTMe9tiKM",
    kty: "RSA",
    q: "tDUoOWO-lNnFYaTdUAN5pzDoRE5TZ4Fthtm-leIrVFdYNlL2-ee4u999-ZHLp1dXYgrx1wtJMFk0IPRXP8TFUVW1H7LATa8-ti8efoqGhkqjIDbYXIEh6u26m7hAr7oN1Sav1S7zr20SlHkmNG4kWx-iJRPRlDU8cgzTOAoT0aU",
    d: "GjC5d3N-wUsoGHH5S9_lRF6OYr-hrAjYzaF-cy2JX2QPBGppdCDhoXJuxc8qBCRDa5yQExavop5CIm-mCtrPMJuZ-O575wYH_FDn5auOgzrvJRQkIfWpfpEIM2_Ceq0jnywuBRctnDMk7sSbJea5ZAHCckBVV2Tlm4KjQrD9IYNRz_TRgWo5nyVzAKvkwU0FKN9hBcNfKCAcNH_iOohGXEyZG-SVn6qQ2L8gJy_fSvlfWaxLoDNUhD5N23zZ_N5tGwXFB5b7jrpNll3tx1fqfvC5T-iEwfzAysTOT3k-BhgWU6xdaq9IRhFrKvYcZFghdZCprxOrVDE_UK4gCFBeyQ",
    e: "AQAB",
    use: "enc",
    qi: "uruXf1A-lCYKRn4nSYsyDjg_ygv3M6tfScuHqtqgQ6s2mlankM8yZlzMM2EwCxlHlo2rMADR4tLSK-k2wdBW_XE4UVniI9BTTMgZOBo2kNHRqjyYiWpuw5srLSPewyZrntmjR4AS90GNRbmoW30OYPF3ADcSRrZNI8Oji1n32co",
    dp: "PK4xDxRrfZwcsxNfM45vTMF_BQNnPPx-MLoSqKRD-4ooBu32P87eEinZrdNl8W4An4JKr1iMmytFjfGzIeerhExddGwoog0wO5TkYX4vnXnTn-0L77O-8XwBBFfHvU6B_OBqCNOx88h5MIjNUJu6-I0HuaPeySeL51iygO7z9oU",
    alg: "RSA-OAEP",
    dq: "hzEx4gwQV_8f8ucKGRLiWyl3tnbEX2xbzMTiE_O-6eE1DlwjaMwMbPV3vplAHWSK68SmNdwDpj_luatVIUPve9s-rG8fkagc9fRXfjtSPMEVq_85Rfyig2qhil0qOirsYbJKSzaUHlFHlRdmMANJRwtuSz6ZBgUCOdWhR_NXdvk",
    n: "qTC36RyYbxQLstX6i6z1SD2kB4UrxdLAS8Kh-C1Vl54NLyXsbpWU6iyRqEjfJyUopiQTrH6KxSBLHT2os-Pj7Mqk_njkdQi7MgLhzy73HLpJoildMS0UXqQkWVPmufc53qKwax-vvWan2uTr86HO9p3gQXoY-ZJBxTXx2hrLTHOvFg_il8yKLUBABI6HujugTiRaS18Rw6jyrNeACrr25sg_ugYCvMAgadNhwbhgps-yl-dqwvBdGhgIegdc3Qxq4qIcrtjIJLBl_-C_-p8bfJEG7vY9t51jBbGFOeY5w1XObvcgp0SNqiHUFFNbgIB7PEARRK5yassPCezHQD8kDw",
  };
  static publicEncryptionKey =
    "ewogICAgImt0eSI6ICJSU0EiLAogICAgImUiOiAiQVFBQiIsCiAgICAidXNlIjogImVuYyIsCiAgICAiYWxnIjogIlJTQS1PQUVQIiwKICAgICJuIjogInFUQzM2UnlZYnhRTHN0WDZpNnoxU0Qya0I0VXJ4ZExBUzhLaC1DMVZsNTROTHlYc2JwV1U2aXlScUVqZkp5VW9waVFUckg2S3hTQkxIVDJvcy1QajdNcWtfbmprZFFpN01nTGh6eTczSExwSm9pbGRNUzBVWHFRa1dWUG11ZmM1M3FLd2F4LXZ2V2FuMnVUcjg2SE85cDNnUVhvWS1aSkJ4VFh4MmhyTFRIT3ZGZ19pbDh5S0xVQkFCSTZIdWp1Z1RpUmFTMThSdzZqeXJOZUFDcnIyNXNnX3VnWUN2TUFnYWROaHdiaGdwcy15bC1kcXd2QmRHaGdJZWdkYzNReHE0cUljcnRqSUpMQmxfLUNfLXA4YmZKRUc3dlk5dDUxakJiR0ZPZVk1dzFYT2J2Y2dwMFNOcWlIVUZGTmJnSUI3UEVBUlJLNXlhc3NQQ2V6SFFEOGtEdyIKfQ==";
}
