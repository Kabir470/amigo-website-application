"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { StaffNav } from "@/components/StaffNav";
import { StaffTopbar } from "@/components/StaffTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !session) {
      router.replace("/login");
    }
  }, [authLoading, session, router]);

  if (authLoading || !session) {
    return <div className="min-h-screen bg-mist flex items-center justify-center text-slate-650">Loading...</div>;
  }

  const name = user?.email?.split("@")[0] || "Staff";

  return (
    <div className="flex min-h-screen bg-mist">
      <StaffNav />
      <div className="flex-1 overflow-x-hidden">
        <StaffTopbar name={name} />
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </div>
    </div>
  );
}
