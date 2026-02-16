import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    // No code means the auth provider didn't send what we need
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Optional: log server-side for debugging
    console.error("exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  return NextResponse.redirect(new URL("/dashboard", url.origin));
}