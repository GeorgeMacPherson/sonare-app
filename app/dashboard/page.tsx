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
    <main style={{ padding: 24 }}>
      <LogoutButton />
      <h1>{membership.studio.name}</h1>
      <p>You are inside your studio 🎹</p>
    </main>
  );
}