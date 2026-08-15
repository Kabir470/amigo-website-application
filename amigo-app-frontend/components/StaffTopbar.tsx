"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconSearch, IconBell } from "@/components/icons";

export function StaffTopbar({ name }: { name: string }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/dashboard/patients?q=${encodeURIComponent(q.trim())}`);
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-teal-900/5 bg-white px-8 py-4">
      <form onSubmit={handleSearch} className="w-full max-w-sm">
        <div className="flex items-center gap-2 rounded-lg border border-teal-900/10 bg-mist px-3.5 py-2.5">
          <IconSearch className="h-4 w-4 flex-none text-slate-650/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patients…"
            className="w-full bg-transparent text-sm text-ink placeholder:text-slate-650/50 focus:outline-none"
          />
        </div>
      </form>

      <div className="flex flex-none items-center gap-3">
        <Link
          href="/dashboard/alerts"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-900/10 text-slate-650 transition hover:bg-mist"
        >
          <IconBell className="h-4.5 w-4.5" />
        </Link>
        <div className="flex items-center gap-2.5 rounded-full border border-teal-900/10 py-1.5 pl-1.5 pr-3.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-[11px] font-semibold text-white">
            {initials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-ink">{name}</p>
            <p className="text-xs text-slate-650/60">Authenticated</p>
          </div>
        </div>
      </div>
    </header>
  );
}
