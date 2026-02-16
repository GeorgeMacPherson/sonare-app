import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStudio } from "./studioActions";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>Create your studio</h1>
      <form action={createStudio} style={{ display: "grid", gap: 12 }}>
        <input name="name" placeholder="Studio name" required />
        <button type="submit">Create studio</button>
      </form>
    </main>
  );
}