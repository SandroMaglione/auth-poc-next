import { Context, Effect } from "effect";
import { cookies } from "next/headers";

interface NextCookies {
  readonly _: unique symbol;
}

const NextCookies = Context.GenericTag<NextCookies, ReturnType<typeof cookies>>(
  "@app/NextCookies"
);

const make = (nextCookies: Effect.Effect.Success<typeof NextCookies>) => ({
  set: (key: string, value: string, expires: Date) =>
    Effect.sync(() => nextCookies.set(key, value, { expires, httpOnly: true })),
});

export class Cookies extends Context.Tag("Cookies")<
  Cookies,
  ReturnType<typeof make>
>() {}
