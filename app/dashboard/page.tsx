import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import LogoutButton from "@/app/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const userId = data.user.id;

  // Check if user belongs to a studio
  const membership = await prisma.studioMember.findFirst({
    where: { userId },
    include: { studio: true },
  });

  if (!membership) redirect("/onboarding");

  return (
    <main className="min-h-screen p-8 flex items-start justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">{membership.studio.name}</h1>
          <LogoutButton />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold">Welcome back 👋</h2>
          <p className="muted mt-2">You are inside your studio 🎹 — here's your workspace.</p>
        </div>
      </div>
    </main>
  );
}