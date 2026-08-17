"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Brand } from "@/components/Logo";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  IconGrid,
  IconBed,
  IconClipboard,
  IconRobot,
  IconBell,
  IconUsers,
  IconFile,
  IconGear,
} from "@/components/icons";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: IconGrid },
  { href: "/dashboard/patients", label: "Patients Details", icon: IconBed },
  { href: "/dashboard/deliveries", label: "Deliveries", icon: IconClipboard },
  { href: "/dashboard/robot", label: "Amigo Robot Modifications", icon: IconRobot },
  { href: "/dashboard/alerts", label: "Alerts", icon: IconBell },
  { href: "/dashboard/users", label: "Manage Users", icon: IconUsers },
  { href: "/dashboard/audit-log", label: "Audit Log", icon: IconFile },
  { href: "/dashboard/settings", label: "System Settings", icon: IconGear },
];

export function StaffNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [imgError, setImgError] = useState(false);

  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Staff";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  async function logout() {
    await logOut();
    router.replace("/login");
  }

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-none flex-col overflow-y-auto border-r border-teal-900/5 dark:border-slate-800/80 bg-white dark:bg-[#111C21] px-4 py-6 transition-colors">
      <Link href="/dashboard" className="px-2">
        <Brand size="h-8 w-8" textClass="text-lg" />
      </Link>

      <p className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-650/50 dark:text-slate-400">
        Admin panel
      </p>

      <nav className="mt-2 flex flex-1 flex-col gap-0.5">
        {links.map((link) => {
          // Exact match for dashboard, startsWith for subpages
          const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300"
                  : "text-slate-650 dark:text-slate-300 hover:bg-mist dark:hover:bg-slate-800/50 hover:text-ink dark:hover:text-white"
              }`}
            >
              <Icon className={active ? "text-teal-600 dark:text-teal-400" : "text-slate-650/70 dark:text-slate-400"} />
              <span className="leading-tight">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-teal-900/5 dark:border-slate-800/80 pt-4">
        <div className="flex items-center gap-3 px-1">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={name}
              onError={() => setImgError(true)}
              className="h-9 w-9 flex-none rounded-full object-cover ring-1 ring-teal-500/20"
            />
          ) : (
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal-500 text-xs font-semibold text-white">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink dark:text-slate-100">{name}</p>
            <p className="text-xs text-slate-650/70 dark:text-slate-400">Hospital staff</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 px-1 text-xs font-medium text-coral-500 hover:underline text-left"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
