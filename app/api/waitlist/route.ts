import { NextResponse } from "next/server";

import { ensureWaitlistTable, pool } from "@/lib/db";

// Needs the Node.js runtime (pg uses Node networking) and must run per-request.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string | null = null;

  try {
    const body = (await request.json()) as { email?: unknown };
    if (typeof body.email === "string") {
      email = body.email.trim().toLowerCase();
    }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await ensureWaitlistTable();
    // Parameterized query — no SQL injection. ON CONFLICT makes re-submits idempotent.
    await pool.query(
      `INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[waitlist] insert failed:", error);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }
}
