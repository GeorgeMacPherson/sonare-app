"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Working...");

    const { error } = await supabase.auth.signUp({ email, password });
    setStatus(error ? error.message : "Signed up! (Check email if confirmation is on)");
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Working...");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus(error ? error.message : "Signed in! Go to /dashboard");
  }

  async function magicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Sending magic link...");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setStatus(error ? error.message : "Check your email for the magic link ✨");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md stripe-top card">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Sonare Login</h1>
          <p className="text-sm muted">Studio management for music teachers</p>
        </div>

        <form className="grid gap-4" onSubmit={signIn}>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[rgba(99,102,241,0.18)] outline-none"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[rgba(99,102,241,0.18)] outline-none"
            placeholder="password (for password mode)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />

          <div className="flex flex-col gap-3">
            <button className="btn-primary" type="submit">Sign in (password)</button>
            <button
              className="w-full text-sm py-2 rounded-lg border border-gray-200"
              onClick={signUp}
              type="button"
            >
              Sign up (password)
            </button>
            <button
              className="w-full text-sm py-2 rounded-lg border border-gray-200"
              onClick={magicLink}
              type="button"
            >
              Send magic link
            </button>
          </div>

          {status && <p className="text-sm muted">{status}</p>}
        </form>
      </div>
    </main>
  );
}