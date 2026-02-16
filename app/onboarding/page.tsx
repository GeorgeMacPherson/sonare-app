import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStudio } from "./studioActions";

type SP = { error?: string };

export default async function OnboardingPage({
  searchParams,
}: {
  // Works whether Next gives you an object or a Promise (Next 15+)
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const showMissingName = sp?.error === "missing_name";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-zinc-950 via-indigo-950/40 to-zinc-950 text-white">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl animate-floatSlow" />
        <div className="absolute right-[-120px] top-[120px] h-[520px] w-[520px] rounded-full bg-cyan-400/15 blur-3xl animate-floatSlow2" />
        <div className="absolute left-[-160px] bottom-[-160px] h-[520px] w-[520px] rounded-full bg-indigo-400/15 blur-3xl animate-floatSlow2" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-10 rounded-2xl shadow-2xl">
  Sonare is now gorgeous ✨
</div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14 md:flex-row md:items-center md:py-20">
        {/* Left marketing column */}
        <section className="animate-fadeUp md:w-1/2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.6)]" />
            Sonare Onboarding
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            Build your studio.
            <span className="block bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
              Teach with flow.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/75 md:text-base">
            Create your studio in under a minute. Add teachers and students later.
            Calm UI, quick setup, no clutter.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <span className="text-emerald-300">✦</span> Clean dashboard, fast setup
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-200">✦</span> Secure sign-in via Supabase sessions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-fuchsia-200">✦</span> Designed for real studios (Fermata Studio energy)
            </li>
          </ul>

          <p className="mt-8 text-xs text-white/60">
            Logged in as <span className="text-white/80">{data.user.email}</span>
          </p>
        </section>

        {/* Right card */}
        <section className="animate-fadeUp md:w-1/2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Create your studio</h2>
                <p className="mt-1 text-sm text-white/70">
                  This becomes your home base.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                Step 1 of 1
              </div>
            </div>

            {showMissingName && (
              <div className="mt-4 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 animate-shake">
                Please enter a studio name.
              </div>
            )}

            <form action={createStudio} className="mt-6">
              <label className="block text-sm font-medium text-white/85">
                Studio name
              </label>

              <div className="mt-2">
                <input
                  name="name"
                  required
                  autoComplete="organization"
                  placeholder="e.g. Fermata Studio"
                  className={[
                    "w-full rounded-xl border bg-white/5 px-4 py-3 text-white",
                    "border-white/10 placeholder:text-white/35",
                    "outline-none ring-0",
                    "focus:border-cyan-300/40 focus:bg-white/10 focus:shadow-[0_0_0_6px_rgba(34,211,238,0.10)]",
                  ].join(" ")}
                />
                <p className="mt-2 text-xs text-white/55">
                  Tip: keep it short. You can rename later.
                </p>
              </div>

              <button
                type="submit"
                className={[
                  "group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl",
                  "bg-gradient-to-r from-fuchsia-500/90 via-indigo-500/90 to-cyan-500/90",
                  "px-4 py-3 text-sm font-semibold text-white",
                  "shadow-[0_16px_60px_rgba(99,102,241,0.35)]",
                  "transition-all duration-200",
                  "hover:brightness-110 hover:shadow-[0_18px_70px_rgba(236,72,153,0.25)]",
                  "active:translate-y-[1px]",
                ].join(" ")}
              >
                Create studio
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <p className="mt-4 text-center text-xs text-white/55">
                By continuing, you agree to Sonare’s vibe: calm, clear, and a little sparkly ✨
              </p>
            </form>
          </div>

          {/* tiny footer glow */}
          <div className="mt-5 text-center text-xs text-white/45">
            Sonare • modern studio OS
          </div>
        </section>
      </div>
    </main>
  );
}