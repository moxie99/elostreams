"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Entry = { email: string; created_at: string };

// Deterministic UTC formatting so server and client render identically
// (avoids hydration mismatches from locale/timezone differences).
function formatDate(iso: string): string {
  if (iso.length < 16) return iso;
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

function toCsv(entries: Entry[]): string {
  const escape = (value: string) =>
    /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  const header = "email,signed_up_at";
  const rows = entries.map((e) => `${escape(e.email)},${e.created_at}`);
  return [header, ...rows].join("\n");
}

export default function AdminDashboard({
  adminEmail,
  entries,
}: {
  adminEmail: string;
  entries: Entry[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.email.toLowerCase().includes(q));
  }, [entries, query]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  function handleExport() {
    const blob = new Blob([toCsv(filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `elostreams-waitlist-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#0A0E1A] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-widest text-white">
              ELOSTREAMS
            </p>
            <h1 className="mt-1 text-2xl font-bold">Waitlist</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-400 sm:inline">{adminEmail}</span>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={loggingOut}
              className="h-9 border-[#1E3A5F] bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        </div>

        {/* Stats + export */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#00C9A7]">
              {entries.length}
            </span>
            <span className="text-sm text-slate-400">
              total {entries.length === 1 ? "signup" : "signups"}
            </span>
          </div>
          <Button
            onClick={handleExport}
            disabled={entries.length === 0}
            className="h-9 rounded-md bg-[#00C9A7] px-4 text-sm font-semibold text-[#0A0E1A] hover:bg-[#00C9A7]/90"
          >
            Export CSV
          </Button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by email…"
            aria-label="Search emails"
            className="h-10 border-[#1E3A5F] bg-[#0D1B3E] text-sm text-white placeholder:text-slate-500 focus-visible:border-[#00C9A7] focus-visible:ring-[#00C9A7]/30"
          />
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-lg border border-[#1E3A5F]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0D1B3E] text-xs tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Signed up
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    {entries.length === 0 ? "No signups yet." : "No matches."}
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.email}
                    className="border-t border-[#1E3A5F] hover:bg-[#0D1B3E]/50"
                  >
                    <td className="px-4 py-3 text-white">{entry.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                      {formatDate(entry.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {query.trim() && filtered.length > 0 ? (
          <p className="mt-3 text-xs text-slate-500">
            Showing {filtered.length} of {entries.length}.
          </p>
        ) : null}
      </div>
    </main>
  );
}
