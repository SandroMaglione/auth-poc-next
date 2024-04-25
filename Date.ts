import { Context, Effect, Layer } from "effect";

const makeFromDate = {
  now: Effect.sync(() => globalThis.Date.now()),
  from: (n: number) => Effect.succeed(new globalThis.Date(n)),
};

export class Date extends Context.Tag("Date")<Date, typeof makeFromDate>() {
  static readonly Live = Layer.succeed(this, makeFromDate);
}
