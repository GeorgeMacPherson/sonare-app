import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createStudio } from "./studioActions";

type SP = { error?: string };

// Next can sometimes treat searchParams as async in newer versions.
// This makes it work whether it’s a plain object or a Promise.
async function resolveSearchParams(input: unknown): Promise<SP> {
  if (input && typeof input === "object" && "then" in (input as any)) {
    return (await (input as Promise<SP>)) ?? {};
  }
  return (input as SP) ?? {};
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const userId = data.user.id;

  // ✅ If they already have a studio membership, they’re done onboarding.
  const existingMembership = await prisma.studioMember.findFirst({
    where: { userId },
    select: { studioId: true },
  });

  if (existingMembership) redirect("/dashboard");

  const sp = await resolveSearchParams(searchParams);

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>Welcome to Sonare</h1>
      <p>Create your studio to get started.</p>

      {sp.error === "missing_name" && (
        <p style={{ color: "crimson" }}>Please enter a studio name.</p>
      )}

      <form action={createStudio} style={{ marginTop: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Studio name</label>

        <input
          name="name"
          placeholder="e.g. Fermata Studio"
          autoComplete="organization"
          style={{
            width: "100%",
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />

        <button
          type="submit"
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #111",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          Create studio
        </button>
      </form>
    </main>
  );
}