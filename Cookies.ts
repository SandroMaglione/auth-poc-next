import { Context, Effect, Layer } from "effect";
import { cookies } from "next/headers";

interface NextCookies {
  readonly _: unique symbol;
}

const NextCookies = Context.GenericTag<NextCookies, ReturnType<typeof cookies>>(
  "@app/NextCookies"
);

const makeNext = (nextCookies: Effect.Effect.Success<typeof NextCookies>) => ({
  set: (key: string, value: string, expires: Date) =>
    Effect.sync(() => nextCookies.set(key, value, { expires, httpOnly: true })),
});

export class Cookies extends Context.Tag("Cookies")<
  Cookies,
  ReturnType<typeof makeNext>
>() {
  static readonly LiveNext = Layer.effect(
    this,
    Effect.map(NextCookies, makeNext)
  ).pipe(
    Layer.provide(
      Layer.effect(
        NextCookies,
        Effect.sync(() => cookies())
      )
    )
  );
}
