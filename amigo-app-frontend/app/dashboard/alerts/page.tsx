"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatTimestamp } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Bell, BellOff } from "lucide-react";

interface ApiAlert {
  id: number;
  type: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

const alertTypeColors: Record<string, { color: string; bg: string; border: string }> = {
  missed_delivery: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  rfid_unknown: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  rfid_mismatch: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  robot_offline: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  low_battery: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  failed_login: { color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)" },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAlerts(); }, []);

  async function loadAlerts() {
    try { setAlerts(await api.getAlerts()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const visible = alerts.filter(a => a.isResolved === showResolved);
  const activeCount = alerts.filter(a => !a.isResolved).length;

  async function resolve(id: number) {
    try { await api.resolveAlert(id); loadAlerts(); } catch (e) { console.error(e); }
  }

  if (loading) return <div className="p-6 text-slate-400">Loading alerts...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6" style={{ color: "#f59e0b" }} />
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          {!showResolved && activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white" style={{ background: "#ef4444" }}>{activeCount}</span>
          )}
        </div>
        <button onClick={() => setShowResolved(!showResolved)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={showResolved ? { background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }
            : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>
          {showResolved ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          {showResolved ? "Show Active" : "Show Resolved"}
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: "#10b981" }} />
          <p className="text-slate-400">{showResolved ? "No resolved alerts." : "No active alerts — all clear!"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(a => {
            const style = alertTypeColors[a.type] || { color: "#94a3b8", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" };
            return (
              <div key={a.id} className="glass-card p-4 flex items-start gap-4 transition-all" style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: style.color }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: style.color }}>{a.type.replace(/_/g, " ")}</span>
                  </div>
                  <p className="text-sm text-white">{a.message}</p>
                  <p className="text-xs mt-1" style={{ color: "#475569" }}>{formatTimestamp(a.createdAt)}</p>
                </div>
                {!a.isResolved && (
                  <button onClick={() => resolve(a.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
