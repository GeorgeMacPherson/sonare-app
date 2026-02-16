"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createStudio(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Studio name is required");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  // Ensure UserProfile exists
  await prisma.userProfile.upsert({
    where: { id: data.user.id },
    update: { email: data.user.email ?? "" },
    create: { id: data.user.id, email: data.user.email ?? "" },
  });

  const base = slugify(name);
  const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;

  await prisma.studio.create({
    data: {
      name,
      slug,
      members: {
        create: { userId: data.user.id, role: "OWNER" },
      },
    },
  });

  redirect("/dashboard");
}