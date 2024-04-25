import { Context, Data, Effect } from "effect";

class NullFormData extends Data.TaggedError("NullFormData")<
  Readonly<{
    name: string;
  }>
> {}

export interface FormData {
  readonly _: unique symbol;
}

export const FormData = Context.GenericTag<FormData, globalThis.FormData>(
  "@app/FormData"
);

export const getNotNull = (name: string) =>
  FormData.pipe(
    Effect.flatMap((formData) => Effect.fromNullable(formData.get(name))),
    Effect.map((formValue) => formValue.toString()),
    Effect.mapError(() => new NullFormData({ name }))
  );
