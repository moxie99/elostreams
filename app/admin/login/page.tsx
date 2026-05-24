import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign in · Elostreams",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0E1A] px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-sm font-bold tracking-widest text-white">
          ELOSTREAMS
        </p>
        <h1 className="mt-6 text-2xl font-bold text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to view the waitlist.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
