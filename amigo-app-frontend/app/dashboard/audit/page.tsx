"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatTimestamp } from "@/lib/utils";
import { IconFile } from "@/components/icons";
import { Card, inputClass } from "@/components/ui";
import { Search } from "lucide-react";

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
      const [deliveries, alerts, users] = await Promise.all([
        api.getDeliveries(),
        api.getAlerts(),
        api.getUsers(),
      ]);

      const entries: AuditEntry[] = [];

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

      alerts.forEach((a: any) => {
        entries.push({
          action: a.isResolved ? "alert_resolved" : "alert_triggered",
          user: "System",
          target: `alert-${a.id}`,
          details: a.message,
          timestamp: a.createdAt,
        });
      });

      users.forEach((u: any) => {
        entries.push({
          action: "user_created",
          user: "Admin",
          target: u.displayName,
          details: `Created ${u.role} account: ${u.email}`,
          timestamp: u.createdAt,
        });
      });

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
    if (action.includes("delete") || action.includes("fail") || action.includes("triggered"))
      return "text-coral-600 dark:text-rose-300 bg-coral-50 dark:bg-rose-950/60 border-coral-200 dark:border-rose-800/50";
    if (action.includes("config") || action.includes("command"))
      return "text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/50";
    if (action.includes("create") || action.includes("complete") || action.includes("resolved"))
      return "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/50";
    return "text-slate-650 dark:text-slate-300 bg-mist dark:bg-slate-900/60 border-slate-200 dark:border-slate-800";
  }

  if (loading) return <div className="p-6 text-slate-400 dark:text-slate-500">Loading audit logs...</div>;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <IconFile className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink dark:text-slate-100">Audit Log</h1>
            <p className="text-sm text-slate-650 dark:text-slate-400">Every dispatch, alert, and account action recorded by the system.</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input type="text" placeholder="Search logs…" value={search} onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-9 w-64`} />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-650/60 dark:text-slate-400 border-b border-teal-900/5 dark:border-slate-800/80">
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-3 py-3 font-medium">User</th>
                <th className="px-3 py-3 font-medium">Action</th>
                <th className="px-3 py-3 font-medium">Target</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-900/5 dark:divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-650 dark:text-slate-400">
                    No activity recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((l, i) => (
                  <tr key={i} className="transition hover:bg-mist dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-650 dark:text-slate-400">{formatTimestamp(l.timestamp)}</td>
                    <td className="px-3 py-4 font-medium text-ink dark:text-slate-100">{l.user}</td>
                    <td className="px-3 py-4">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded border ${actionColor(l.action)}`}>
                        {l.action}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">{l.target}</td>
                    <td className="px-6 py-4 text-xs text-slate-650 dark:text-slate-300 max-w-xs truncate">{l.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
