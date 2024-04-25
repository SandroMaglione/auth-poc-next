import { Context, Layer } from "effect";

const make = {
  encode: (input: string) => new globalThis.TextEncoder().encode(input),
};

export class TextEncoder extends Context.Tag("TextEncoder")<
  TextEncoder,
  typeof make
>() {
  static readonly Live = Layer.succeed(this, make);
}
