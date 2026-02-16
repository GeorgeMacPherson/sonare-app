"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 50);
}

async function makeUniqueSlug(base: string) {
  let slug = base || "studio";
  let i = 0;

  while (true) {
    const exists = await prisma.studio.findUnique({ where: { slug } });
    if (!exists) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

export async function createStudio(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    // Keep it simple: bounce back with query param for now
    redirect("/onboarding?error=missing_name");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect("/login");

  const user = data.user;

  // Ensure UserProfile exists (id must match Supabase user.id)
  await prisma.userProfile.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email ?? `${user.id}@unknown.local`,
    },
    update: {
      // keep email fresh in case they changed it later
      email: user.email ?? `${user.id}@unknown.local`,
    },
  });

  const baseSlug = slugify(name);
  const slug = await makeUniqueSlug(baseSlug);

  // Create studio + OWNER membership in one transaction
  const studio = await prisma.$transaction(async (tx) => {
    const created = await tx.studio.create({
      data: { name, slug },
    });

    await tx.studioMember.create({
      data: {
        studioId: created.id,
        userId: user.id,
        role: "OWNER",
      },
    });

    return created;
  });

  // (Optional) you can store "active studio" later. For now just go dashboard.
  redirect(`/dashboard?studio=${studio.slug}`);
}