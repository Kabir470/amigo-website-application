"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatTimestamp } from "@/lib/utils";
import { FileText, Search } from "lucide-react";

interface AuditEntry {
  action: string;
  user: string;
  target: string;
  details: string;
  timestamp: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  async function loadAuditLogs() {
    try {
      // Build audit logs from delivery + alert data since there's no dedicated audit table
      const [deliveries, alerts, users] = await Promise.all([
        api.getDeliveries(),
        api.getAlerts(),
        api.getUsers(),
      ]);

      const entries: AuditEntry[] = [];

      // Create entries from completed deliveries
      deliveries.forEach((d: any) => {
        if (d.status === "Completed" && d.scannedAt) {
          entries.push({
            action: "delivery_completed",
            user: "System",
            target: d.patient ? `${d.patient.firstName} ${d.patient.lastName}` : `delivery-${d.id}`,
            details: `Delivered ${d.medicine?.name || "medication"} to ${d.patient?.roomNumber || "room"}`,
            timestamp: d.scannedAt,
          });
        }
      });

      // Create entries from resolved alerts
      alerts.forEach((a: any) => {
        entries.push({
          action: a.isResolved ? "alert_resolved" : "alert_triggered",
          user: "System",
          target: `alert-${a.id}`,
          details: a.message,
          timestamp: a.createdAt,
        });
      });

      // Create entries from user creation
      users.forEach((u: any) => {
        entries.push({
          action: "user_created",
          user: "Admin",
          target: u.displayName,
          details: `Created ${u.role} account: ${u.email}`,
          timestamp: u.createdAt,
        });
      });

      // Sort by timestamp descending
      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(entries);
    } catch (e) {
      console.error("Failed to load audit logs:", e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter(
    (l) =>
      !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  function actionColor(action: string): string {
    if (action.includes("delete") || action.includes("fail") || action.includes("triggered")) return "#ef4444";
    if (action.includes("config") || action.includes("command")) return "#f59e0b";
    if (action.includes("create") || action.includes("complete") || action.includes("resolved")) return "#10b981";
    return "#94a3b8";
  }

  if (loading) return <div className="p-6 text-slate-400">Loading audit logs...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6" style={{ color: "#3b82f6" }} />
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <span className="text-xs px-2 py-1 rounded-full"
            style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}>
            {logs.length} entries
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
          <input type="text" placeholder="Search logs…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl text-sm text-white outline-none w-56"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.2)" }} />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
              {["Time", "User", "Action", "Target", "Details"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-slate-500">No audit logs match your search.</td></tr>
            ) : filtered.map((l, i) => (
              <tr key={i} className="border-b hover:bg-white/[0.02]" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{formatTimestamp(l.timestamp)}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-300">{l.user}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ color: actionColor(l.action), background: `${actionColor(l.action)}15` }}>{l.action}</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500">{l.target}</td>
                <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
