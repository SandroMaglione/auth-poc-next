import { Context, Effect } from "effect";
import * as Cookies from "./Cookies";
import * as Date from "./Date";
import * as FormData from "./FormData";
import * as Jwt from "./Jwt";

const make = {
  login: Effect.gen(function* () {
    const jwt = yield* Jwt.Jwt;
    const cookies = yield* Cookies.Cookies;

    const date = yield* Date.Date;

    const email = yield* FormData.getNotNull("email");
    const user = { email, name: "John" };

    const now = yield* date.now;
    const expires = yield* date.from(now + 10 * 1000);

    const session = yield* jwt.encrypt({ user, expires });
    return yield* cookies.set("session", session, expires);
  }),
};

export class Auth extends Context.Tag("Auth")<Auth, typeof make>() {}
