"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Button, Card, StatusPill } from "@/components/ui";

interface Robot {
  id: number;
  name: string;
  status: string;
  batteryLevel: number;
  currentLocation: string;
  ward: { name: string } | null;
}

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  roomNumber: string | null;
  condition: string;
  ward: { name: string } | null;
  assignedRobot: { name: string } | null;
  nfcTag?: string | null;
}

interface Delivery {
  id: number;
  scheduledTime: string;
  status: string;
  patient: { firstName: string; lastName: string; roomNumber: string } | null;
  medicine: { name: string } | null;
}

interface Alert {
  id: number;
  type: string;
  message: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  const [robots, setRobots] = useState<Robot[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Realtime scan state
  const [latestScanPayload, setLatestScanPayload] = useState<{ tag: string, robotId: number, time: Date, id: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setFetchError(null);
        const [robotsRes, patientsRes, deliveriesRes, alertsRes] = await Promise.all([
          api.getRobots(),
          api.getPatients(),
          api.getDeliveries(),
          api.getActiveAlerts()
        ]);

        setRobots(robotsRes);
        setPatients(patientsRes);
        setDeliveries(deliveriesRes);
        setAlerts(alertsRes);
      } catch (error: any) {
        console.error("API Fetch Error:", error);
        setFetchError("Unable to connect to the backend API.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to real-time RFID scans
  useEffect(() => {
    const channel = supabase.channel('rfid_scans_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rfid_scans' }, (payload) => {
        setLatestScanPayload({ 
          tag: payload.new.rfid_tag, 
          robotId: payload.new.robot_id, 
          time: new Date(payload.new.scanned_at || Date.now()),
          id: payload.new.id
        });
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Auto-dismiss the scan overlay after 15 seconds to return to "Scanning" state
  useEffect(() => {
    if (latestScanPayload) {
      const timer = setTimeout(() => {
        setLatestScanPayload(prev => prev?.id === latestScanPayload.id ? null : prev);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [latestScanPayload]);

  const scannedPatient = latestScanPayload ? patients.find(p => p.nfcTag === latestScanPayload.tag) : null;
  const completedDeliveries = deliveries.filter(d => d.status === 'Completed').length;
  const pendingDeliveries = deliveries.filter(d => d.status !== 'Completed');
  
  // Just take the first robot for the main status card, or mock if none
  const mainRobot = robots[0] || null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Ward overview</h1>
          <p className="text-sm text-slate-650">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          {fetchError && <p className="text-sm text-coral-500 mt-2">{fetchError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs font-medium text-slate-650">Active patients</p>
          <p className="mt-1.5 font-display text-3xl font-semibold text-ink">{loading ? "..." : patients.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-slate-650">Delivered today</p>
          <p className="mt-1.5 font-display text-3xl font-semibold text-ink">{loading ? "..." : completedDeliveries}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-slate-650">Unread alerts</p>
          <p className="mt-1.5 font-display text-3xl font-semibold text-ink">{loading ? "..." : alerts.length}</p>
        </Card>
      </div>

      {/* RFID Scanner / Live Status Card */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink">
            <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulseDot"></div>
            RFID Scanner Terminal
          </h3>
          {mainRobot && <StatusPill status={mainRobot.status === 'Active' ? 'EN ROUTE' : mainRobot.status === 'Charging' ? 'CHARGING' : mainRobot.status.toUpperCase()} />}
        </div>
        
        <div className="mt-6">
          {!latestScanPayload ? (
            // IDLE / RUNNING STATE
            <div className="flex flex-col items-center gap-4 text-slate-650 py-6">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-500/40 animate-spin" style={{ animationDuration: '8s' }}></div>
                <div className="absolute inset-2 rounded-full bg-teal-500/10 animate-pulse"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-600 relative z-10"><path d="M4 4v16h16V4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
              </div>
              <div className="text-center">
                <h4 className="text-teal-700 text-sm font-semibold tracking-wide mb-1">SYSTEM RUNNING</h4>
                <p className="text-xs">Waiting for RFID scan from Amigo Robot...</p>
              </div>
            </div>
          ) : (
            // SCANNED STATE
            <div className="w-full animate-rise py-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-[0_0_15px_rgba(15,110,110,0.15)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <h4 className="text-teal-700 text-sm font-bold uppercase tracking-wide">Scan Successful</h4>
                  <div className="text-xs text-slate-650 mt-1">
                    Robot: Amigo {latestScanPayload.robotId} • {latestScanPayload.time.toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-teal-900/10 bg-mist p-5">
                {scannedPatient ? (
                  <>
                    <h2 className="text-2xl font-bold text-ink mb-4 tracking-tight">
                      {scannedPatient.firstName} {scannedPatient.lastName}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-white p-3 border border-teal-900/5">
                        <div className="text-[10px] font-semibold uppercase text-slate-650/60 mb-1">Location</div>
                        <div className="text-sm font-medium text-ink">
                          {scannedPatient.ward?.name || "Unassigned"} — Room {scannedPatient.roomNumber || "N/A"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white p-3 border border-teal-900/5">
                        <div className="text-[10px] font-semibold uppercase text-slate-650/60 mb-1">Condition</div>
                        <div className="text-sm font-semibold text-amber-500">
                          {scannedPatient.condition || "Stable"}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-slate-650">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-3 text-coral-500"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    <p className="text-lg font-semibold text-ink mb-1">Unregistered Tag</p>
                    <p className="text-sm font-mono text-teal-600">UID: {latestScanPayload.tag}</p>
                    <p className="text-xs mt-2">This tag is not assigned to any active patient.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* Quick dispatch / Pending Deliveries */}
        <Card className="p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-650/70">
            Scheduled doses
          </p>
          <div className="space-y-3">
            {pendingDeliveries.length === 0 && (
              <p className="text-sm text-slate-650">No pending deliveries.</p>
            )}
            {pendingDeliveries.slice(0, 5).map((d) => {
              const date = new Date(d.scheduledTime);
              return (
                <div key={d.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {d.patient?.firstName} {d.patient?.lastName} · {d.medicine?.name}
                    </p>
                    <p className="text-xs text-slate-650">
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Room {d.patient?.roomNumber}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" disabled={true}>
                    {d.status}
                  </Button>
                </div>
              );
            })}
          </div>
          <Link
            href="/dashboard/deliveries"
            className="mt-4 inline-block text-xs font-medium text-teal-600 hover:underline"
          >
            Manage schedules →
          </Link>
        </Card>

        {/* Notifications / Alerts */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-650/70">
              Recent activity
            </p>
            <Link href="/dashboard/alerts" className="text-xs font-medium text-teal-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 && (
              <p className="text-sm text-slate-650">Nothing yet today.</p>
            )}
            {alerts.slice(0, 6).map((n) => (
              <div key={n.id} className="flex gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-coral-500" />
                <div>
                  <span className="font-semibold text-ink text-xs">{n.type.replace(/_/g, " ")}: </span>
                  <span className="text-slate-650">{n.message}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
