"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Brand } from "@/components/Logo";

const links = [
  { href: "/patient/dashboard", label: "My schedule" },
  { href: "/patient/history", label: "Delivery history" },
  { href: "/patient/profile", label: "Profile" },
];

export function PatientNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-teal-900/5 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/patient/dashboard">
          <Brand size="h-8 w-8" textClass="text-lg" />
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-teal-50 text-teal-700" : "text-slate-650 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="ml-2 rounded-full px-4 py-2 text-sm font-medium text-coral-500 hover:bg-coral-400/10"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
