import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as: {data.user.email}</p>
    </main>
  );
}