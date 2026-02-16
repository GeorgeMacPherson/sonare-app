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
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Sonare Login</h1>

      <form style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          placeholder="password (for password mode)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
        />

        <button onClick={signIn} type="submit">Sign in (password)</button>
        <button onClick={signUp} type="button">Sign up (password)</button>
        <button onClick={magicLink} type="button">Send magic link</button>

        {status && <p>{status}</p>}
      </form>
    </main>
  );
}