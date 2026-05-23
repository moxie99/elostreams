"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="mt-4 text-sm font-medium text-[#00C9A7]">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (email.trim()) setSubmitted(true);
      }}
      className="mt-4 flex flex-col gap-3 sm:flex-row"
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email for early access"
        aria-label="Email address"
        className="h-10 flex-1 rounded-md border-[#1E3A5F] bg-[#0A0E1A] text-sm text-white placeholder:text-slate-500 focus-visible:border-[#00C9A7] focus-visible:ring-[#00C9A7]/30"
      />
      <Button
        type="submit"
        className="h-10 rounded-md bg-[#00C9A7] px-5 text-sm font-semibold text-[#0A0E1A] hover:bg-[#00C9A7]/90"
      >
        Join Waitlist
      </Button>
    </form>
  );
}
