import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ErrorBanner from "./ErrorBanner";
import { createStudio } from "./studioActions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = await createClient(); // ⭐⭐⭐ THIS IS THE FIX

  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>Welcome to Sonare</h1>
      <p>Create your studio to get started.</p>

      <ErrorBanner />

      <form action={createStudio} style={{ marginTop: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Studio name
        </label>
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