import { NextResponse } from "next/server";

import { getAdminByEmail } from "@/lib/db";
import {
  createSession,
  hashPassword,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Pre-computed hash used to equalize response timing when an email isn't found,
// so the endpoint doesn't leak which addresses are registered admins.
const DUMMY_HASH = hashPassword("invalid-password-placeholder");

export async function POST(request: Request) {
  let email = "";
  let password = "";

  try {
    const body = (await request.json()) as {
      email?: unknown;
      password?: unknown;
    };
    email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    const admin = await getAdminByEmail(email);
    const valid = verifyPassword(password, admin?.password_hash ?? DUMMY_HASH);

    if (!admin || !valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = createSession({ sub: admin.id, email: admin.email });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("[admin/login] failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
