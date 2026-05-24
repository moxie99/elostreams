"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  if (status === "success") {
    return (
      <p className="mt-4 text-sm font-medium text-[#00C9A7]">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  const loading = status === "loading";

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          placeholder="Enter your email for early access"
          aria-label="Email address"
          className="h-10 flex-1 rounded-md border-[#1E3A5F] bg-[#0A0E1A] text-sm text-white placeholder:text-slate-500 focus-visible:border-[#00C9A7] focus-visible:ring-[#00C9A7]/30"
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-10 rounded-md bg-[#00C9A7] px-5 text-sm font-semibold text-[#0A0E1A] hover:bg-[#00C9A7]/90"
        >
          {loading ? "Joining…" : "Join Waitlist"}
        </Button>
      </form>
      {status === "error" ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
