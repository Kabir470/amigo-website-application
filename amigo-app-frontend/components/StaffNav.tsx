"use client";

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
  
  const name = user?.email?.split("@")[0] || "Staff";

  async function logout() {
    await logOut();
    router.replace("/login");
  }

  return (
    <aside className="flex h-screen w-72 flex-none flex-col border-r border-teal-900/5 bg-white px-4 py-6">
      <Link href="/dashboard" className="px-2">
        <Brand size="h-8 w-8" textClass="text-lg" />
      </Link>

      <p className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-650/50">
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
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-650 hover:bg-mist hover:text-ink"
              }`}
            >
              <Icon className={active ? "text-teal-600" : "text-slate-650/70"} />
              <span className="leading-tight">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-teal-900/5 pt-4">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal-500 text-xs font-semibold text-white">
            {name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{name}</p>
            <p className="text-xs text-slate-650/70">Hospital staff</p>
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
