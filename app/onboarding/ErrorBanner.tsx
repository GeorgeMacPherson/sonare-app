"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "missing_name") {
    return <p style={{ color: "crimson" }}>Please enter a studio name.</p>;
  }

  if (error === "not_member") {
    return <p style={{ color: "crimson" }}>You don’t have access to a studio yet.</p>;
  }

  return null;
}