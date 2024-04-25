import { Context, Effect, Layer } from "effect";
import * as Cookies from "./Cookies";
import * as Date from "./Date";
import * as FormData from "./FormData";
import * as Jwt from "./Jwt";

const make = ({
  cookies,
  jwt,
}: {
  jwt: Effect.Effect.Success<typeof Jwt.Jwt>;
  cookies: Effect.Effect.Success<typeof Cookies.Cookies>;
}) => ({
  login: Effect.gen(function* () {
    // const jwt = yield* Jwt.Jwt;
    // const cookies = yield* Cookies.Cookies;

    const date = yield* Date.Date;

    const email = yield* FormData.getNotNull("email");
    const user = { email, name: "John" };

    const now = yield* date.now;
    const expires = yield* date.from(now + 10 * 1000);

    const session = yield* jwt.encrypt({ user, expires });
    return yield* cookies.set("session", session, expires);
  }),
});

export class Auth extends Context.Tag("Auth")<Auth, ReturnType<typeof make>>() {
  static readonly Live = Layer.effect(
    this,
    Effect.map(
      Effect.all({
        jwt: Jwt.Jwt,
        cookies: Cookies.Cookies,
      }),
      make
    )
  ).pipe(Layer.provide(Layer.merge(Jwt.Jwt.Live, Cookies.Cookies.LiveNext)));
}
