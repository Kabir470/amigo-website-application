"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconSearch, IconBell } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth/AuthContext";

export function StaffTopbar({ name: propName }: { name?: string }) {
  const [q, setQ] = useState("");
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || propName || user?.email?.split("@")[0] || "Staff";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/dashboard/patients?q=${encodeURIComponent(q.trim())}`);
  }

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-teal-900/5 dark:border-slate-800/80 bg-white dark:bg-[#111C21] px-8 py-4 transition-colors">
      <form onSubmit={handleSearch} className="w-full max-w-sm">
        <div className="flex items-center gap-2 rounded-lg border border-teal-900/10 dark:border-slate-800 bg-mist dark:bg-slate-900/70 px-3.5 py-2.5">
          <IconSearch className="h-4 w-4 flex-none text-slate-650/60 dark:text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patients…"
            className="w-full bg-transparent text-sm text-ink dark:text-slate-100 placeholder:text-slate-650/50 dark:placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </form>

      <div className="flex flex-none items-center gap-3">
        <ThemeToggle />
        <Link
          href="/dashboard/alerts"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-900/10 dark:border-slate-800 text-slate-650 dark:text-slate-300 transition hover:bg-mist dark:hover:bg-slate-800/80 hover:text-teal-600 dark:hover:text-teal-400"
          title="Alerts"
        >
          <IconBell className="h-4.5 w-4.5" />
        </Link>
        <div className="flex items-center gap-2.5 rounded-full border border-teal-900/10 dark:border-slate-800 py-1.5 pl-1.5 pr-3.5 bg-white dark:bg-slate-900/50">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={name}
              onError={() => setImgError(true)}
              className="h-7 w-7 flex-none rounded-full object-cover ring-1 ring-teal-500/20"
            />
          ) : (
            <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal-500 text-[11px] font-semibold text-white">
              {initials}
            </div>
          )}
          <div className="leading-tight">
            <p className="text-sm font-medium text-ink dark:text-slate-100">{name}</p>
            <p className="text-xs text-slate-650/60 dark:text-slate-400">Authenticated</p>
          </div>
        </div>
      </div>
    </header>
  );
}
