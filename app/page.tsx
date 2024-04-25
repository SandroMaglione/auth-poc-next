import { getSession, logout } from "@/lib";
import { Effect, Layer } from "effect";
import { redirect } from "next/navigation";
import * as Auth from "../Auth";
import * as Date from "../Date";
import * as FormData from "../FormData";
import * as TextEncoder from "../TextEncoder";

const login = Auth.Auth.pipe(Effect.flatMap(({ login }) => login)).pipe(
  Effect.provide(
    Layer.mergeAll(Auth.Auth.Live, Date.Date.Live, TextEncoder.TextEncoder.Live)
  ),
  Effect.catchTag("ConfigError", () =>
    Effect.dieMessage("Missing configuration")
  )
);

export default async function Page() {
  const session = await getSession();
  return (
    <section>
      <form
        action={async (formData) => {
          "use server";
          // await login(formData);
          // redirect("/");
          await login.pipe(
            Effect.provideService(FormData.FormData, formData),
            Effect.andThen(Effect.sync(() => redirect("/"))),
            Effect.catchAll(() => Effect.sync(() => redirect("/error"))),
            Effect.runPromise
          );
        }}
      >
        <input type="email" placeholder="Email" />
        <br />
        <button type="submit">Login</button>
      </form>
      <form
        action={async () => {
          "use server";
          await logout();
          redirect("/");
        }}
      >
        <button type="submit">Logout</button>
      </form>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </section>
  );
}
