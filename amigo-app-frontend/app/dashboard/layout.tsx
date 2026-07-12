"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Bell, User, LogOut, Shield } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    async function loadGlobalData() {
      try {
        const [activeAlerts, users] = await Promise.all([
          api.getActiveAlerts(),
          api.getUsers(),
        ]);
        setAlerts(activeAlerts);
        if (users.length > 0) setCurrentUser(users[0]);
      } catch (e) {
        console.error("Layout fetch error:", e);
      }
    }
    loadGlobalData();
    const interval = setInterval(loadGlobalData, 15000);
    return () => clearInterval(interval);
  }, []);

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "..";

  return (
    <div id="app">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input placeholder="Search patients..." />
          </div>
          <div className="topbar-right">
            {/* Mobile Sidebar Toggle - Handled via vanilla JS for simplicity or global state, but for this design we can use a simple class toggle */}
            <button className="icon-btn mobile-menu-btn hidden" onClick={() => document.querySelector('.sidebar')?.classList.toggle('open')} style={{ display: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            
            {/* Notifications Dropdown */}
            <div style={{ position: "relative" }}>
              <button className="icon-btn" onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}>
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && <span className="dot-red"></span>}
              </button>
              
              {showNotifs && (
                <div className="glass-card" style={{ position: "absolute", top: "45px", right: "0", width: "320px", padding: "0", zIndex: 50, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>Notifications</span>
                    <span style={{ fontSize: "11px", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "2px 8px", borderRadius: "10px" }}>{alerts.length} New</span>
                  </div>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {alerts.length === 0 ? (
                      <div style={{ padding: "20px", textAlign: "center", color: "var(--ink-soft)", fontSize: "13px" }}>No active alerts.</div>
                    ) : (
                      alerts.slice(0, 5).map(a => (
                        <div key={a.id} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }} onClick={() => router.push('/dashboard/alerts')}>
                          <div style={{ fontSize: "12px", color: "#ef4444", fontWeight: "600", marginBottom: "4px" }}>{a.type.replace(/_/g, " ").toUpperCase()}</div>
                          <div style={{ fontSize: "13px", color: "var(--ink-soft)", lineHeight: "1.4" }}>{a.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ padding: "10px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
                    <button onClick={() => router.push('/dashboard/alerts')} style={{ fontSize: "12px", color: "var(--cyan)", background: "none", border: "none" }}>View All Alerts</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div style={{ position: "relative" }}>
              <div className="user-chip" onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}>
                <div className="avatar">{initials}</div>
                <div>
                  <div className="name">{currentUser?.displayName || "Loading..."}</div>
                  <div className="role capitalize">{currentUser?.role || "—"}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>

              {showProfile && (
                <div className="glass-card" style={{ position: "absolute", top: "50px", right: "0", width: "220px", padding: "8px", zIndex: 50 }}>
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", marginBottom: "8px" }}>
                    <div style={{ fontSize: "14px", color: "#fff", fontWeight: "600" }}>{currentUser?.displayName}</div>
                    <div style={{ fontSize: "12px", color: "var(--ink-soft)" }}>{currentUser?.email}</div>
                  </div>
                  <button className="nav-item" onClick={() => router.push('/dashboard/users')} style={{ width: "100%", border: "none", background: "none", padding: "10px 12px" }}>
                    <Shield className="w-4 h-4" /> Manage Access
                  </button>
                  <button className="nav-item" onClick={() => router.push('/login')} style={{ width: "100%", border: "none", background: "none", padding: "10px 12px", color: "#ef4444" }}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
