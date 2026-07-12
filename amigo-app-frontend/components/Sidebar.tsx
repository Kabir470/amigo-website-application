"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BedDouble,
  Bot,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "Patients Details", icon: BedDouble },
  { href: "/dashboard/deliveries", label: "Dispense Schedule", icon: ClipboardList },
  { href: "/dashboard/robot", label: "Amigo Robot Modifications", icon: Bot },
  { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/dashboard/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/audit", label: "Audit Log", icon: FileText },
  { href: "/dashboard/settings", label: "System Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sidebar">
      <div className="logo-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="logo-badge">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="12" rx="3" stroke="#43d6e0" strokeWidth="1.7"/><circle cx="9" cy="14" r="1.4" fill="#43d6e0"/><circle cx="15" cy="14" r="1.4" fill="#43d6e0"/><path d="M12 8V4" stroke="#43d6e0" strokeWidth="1.7" strokeLinecap="round"/><circle cx="12" cy="3" r="1.3" fill="#43d6e0"/></svg>
          </div>
          <span>Amigo</span>
        </div>
        <button 
          className="mobile-close-btn" 
          onClick={() => document.querySelector('.sidebar')?.classList.remove('open')}
          style={{ background: "none", border: "none", color: "var(--ink-soft)", cursor: "pointer", padding: "4px" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="nav-label">ADMIN PANEL</div>
      <ul className="nav-list">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link 
                href={href} 
                className={`nav-item ${active ? "active" : ""}`}
                onClick={() => document.querySelector('.sidebar')?.classList.remove('open')}
              >
                <Icon width="17" height="17" strokeWidth="1.7" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="nav-foot">
        <button className="nav-item" onClick={() => router.push("/login")}>
          <LogOut width="17" height="17" strokeWidth="1.7" />
          Logout
        </button>
      </div>
    </aside>
  );
}
