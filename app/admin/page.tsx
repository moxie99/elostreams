import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { getWaitlistEntries } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Waitlist · Admin · Elostreams",
};

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const entries = await getWaitlistEntries();

  return <AdminDashboard adminEmail={session.email} entries={entries} />;
}
