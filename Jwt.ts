import { Context, Data, Effect, Secret } from "effect";
import * as _Jose from "jose";
import * as TextEncoder from "./TextEncoder";

interface JwtConfig {
  secretKey: Secret.Secret;
}

class JwtError extends Data.TaggedError("JwtError")<{
  error: unknown;
}> {}

const makeJoseJwt = (config: JwtConfig) => ({
  encrypt: (payload: _Jose.JWTPayload) =>
    Effect.gen(function* (_) {
      const { encode } = yield* TextEncoder.TextEncoder;
      const key = encode(Secret.value(config.secretKey));

      return yield* Effect.tryPromise({
        try: async () =>
          new _Jose.SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("10 sec from now")
            .sign(key),
        catch: (error) => new JwtError({ error }),
      });
    }),
});

export class Jwt extends Context.Tag("Jwt")<
  Jwt,
  ReturnType<typeof makeJoseJwt>
>() {}
