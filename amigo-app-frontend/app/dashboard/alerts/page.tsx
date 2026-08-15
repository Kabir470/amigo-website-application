"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatTimestamp } from "@/lib/utils";
import { Card, Button } from "@/components/ui";
import { AlertTriangle, CheckCircle2, Bell, BellOff } from "lucide-react";

interface ApiAlert {
  id: number;
  type: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

const alertTypeColors: Record<string, string> = {
  missed_delivery: "bg-amber-400",
  rfid_unknown: "bg-coral-500",
  rfid_mismatch: "bg-coral-500",
  robot_offline: "bg-coral-500",
  low_battery: "bg-amber-400",
  failed_login: "bg-teal-500",
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink">Alerts & Notifications</h1>
            {!showResolved && activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-coral-500 text-white">{activeCount}</span>
            )}
          </div>
          <p className="text-sm text-slate-650">System warnings, robot errors, and dispatch updates.</p>
        </div>
        <Button onClick={() => setShowResolved(!showResolved)} variant="secondary">
          {showResolved ? (
            <><Bell className="w-4 h-4 mr-2" /> Show Active</>
          ) : (
            <><BellOff className="w-4 h-4 mr-2" /> Show Resolved</>
          )}
        </Button>
      </div>

      <Card className="divide-y divide-teal-900/5">
        {visible.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
            <p className="text-slate-650">{showResolved ? "No resolved alerts." : "No active alerts — all clear!"}</p>
          </div>
        ) : (
          visible.map(a => (
            <div key={a.id} className="flex items-start justify-between px-6 py-4 transition hover:bg-mist">
              <div className="flex items-start gap-4">
                <span className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full shadow-sm ${alertTypeColors[a.type] || "bg-slate-400"}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-650">{a.type.replace(/_/g, " ")}</span>
                  </div>
                  <p className="text-sm font-medium text-ink">{a.message}</p>
                  <p className="text-xs mt-1 text-slate-650/70">{formatTimestamp(a.createdAt)}</p>
                </div>
              </div>
              {!a.isResolved && (
                <button onClick={() => resolve(a.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 transition-all hover:bg-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge
                </button>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
