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
      {/* ambient blobs using palette variables */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl animate-floatSlow"
          style={{ background: `radial-gradient(circle, rgba(var(--accent-1),0.22), transparent 40%)` }}
        />
        <div
          className="absolute right-[-120px] top-[120px] h-[520px] w-[520px] rounded-full blur-3xl animate-floatSlow2"
          style={{ background: `radial-gradient(circle, rgba(var(--accent-2),0.16), transparent 36%)` }}
        />
        <div
          className="absolute left-[-160px] bottom-[-160px] h-[520px] w-[520px] rounded-full blur-3xl animate-floatSlow2"
          style={{ background: `radial-gradient(circle, rgba(var(--accent-1),0.12), transparent 36%)` }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 55%)' }} />
      </div>

      <div style={{ background: `linear-gradient(90deg, rgba(var(--accent-2),0.95), rgba(var(--accent-1),0.95))` }} className="text-black p-6 rounded-2xl shadow-2xl">
        Sonare is now gorgeous ✨
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14 md:flex-row md:items-center md:py-20">
        {/* Left marketing column */}
        <section className="animate-fadeUp md:w-1/2">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/6 bg-[rgba(255,255,255,0.6)] px-3 py-1 text-xs text-black/70 backdrop-blur">
            <span className="h-2 w-2 rounded-full" style={{ background: 'rgb(var(--accent-1))', boxShadow: '0 0 18px rgba(114,205,108,0.28)' }} />
            Sonare Onboarding
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            Build your studio.
            <span className="block bg-clip-text text-transparent" style={{ background: 'linear-gradient(90deg, rgba(var(--accent-2),0.9), rgba(var(--accent-1),0.9))' }}>
              Teach with flow.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/75 md:text-base">
            Create your studio in under a minute. Add teachers and students later.
            Calm UI, quick setup, no clutter.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgb(var(--accent-1))' }}>✦</span> Clean dashboard, fast setup
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgb(var(--accent-2))' }}>✦</span> Secure sign-in via Supabase sessions
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgba(var(--accent-1),0.9)' }}>✦</span> Designed for real studios (Fermata Studio energy)
            </li>
          </ul>

          <p className="mt-8 text-xs text-white/60">
            Logged in as <span className="text-white/80">{data.user.email}</span>
          </p>
        </section>

        {/* Right card */}
        <section className="animate-fadeUp md:w-1/2">
              <div className="rounded-2xl border border-black/8 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl md:p-8" style={{ background: 'linear-gradient(180deg, rgba(var(--glass)), rgba(var(--glass)) 70%)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Create your studio</h2>
                <p className="mt-1 text-sm text-white/70">
                  This becomes your home base.
                </p>
              </div>
                <div className="rounded-full border border-black/8 px-3 py-1 text-xs text-black/70" style={{ background: 'rgba(255,255,255,0.6)' }}>
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
                    "w-full rounded-xl border px-4 py-3",
                    "border-black/8 placeholder:text-black/35 bg-[rgba(255,255,255,0.5)]",
                    "outline-none ring-0",
                    "focus:shadow-[0_0_0_6px_rgba(114,205,108,0.12)]",
                  ].join(" ")}
                />
                <p className="mt-2 text-xs text-white/55">
                  Tip: keep it short. You can rename later.
                </p>
              </div>

              <button
                type="submit"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-black transition-all duration-200"
                style={{ background: 'linear-gradient(90deg, rgba(var(--accent-2),0.95), rgba(var(--accent-1),0.95))', boxShadow: '0 16px 60px rgba(92,196,106,0.18)' }}
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