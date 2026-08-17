"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, Button, Field, inputClass } from "@/components/ui";
import { IconGear, IconRobot } from "@/components/icons";
import { ThemeSelector } from "@/components/ThemeToggle";
import { PlusCircle, Trash2, X, ShieldCheck, Palette } from "lucide-react";

interface ApiRobot {
  id: number;
  name: string;
  status: string;
  batteryLevel: number;
  currentLocation: string | null;
  firmwareVersion: string | null;
  ward: { id: number; name: string } | null;
  wardId: number | null;
}

export default function SettingsPage() {
  const [robots, setRobots] = useState<ApiRobot[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editRobot, setEditRobot] = useState<ApiRobot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [r, w] = await Promise.all([api.getRobots(), api.getWards()]);
      setRobots(r); setWards(w);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function deleteRobot(id: number) {
    if (!confirm("Delete this robot?")) return;
    try { await api.deleteRobot(id); setRobots(prev => prev.filter(r => r.id !== id)); } catch (e) { console.error(e); }
  }

  async function saveRobot(form: any) {
    try {
      if (editRobot) { await api.updateRobot(editRobot.id, { ...editRobot, ...form }); }
      else { await api.createRobot({ ...form, status: "Active", batteryLevel: 100 }); }
      setShowModal(false); setEditRobot(null); loadData();
    } catch (e) { console.error(e); }
  }

  if (loading) return <div className="p-6 text-slate-400 dark:text-slate-500">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
          <IconGear className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-slate-100">System Configuration</h1>
          <p className="text-sm text-slate-650 dark:text-slate-400">Ward configuration, robot registration, appearance, and system preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance & Theme Setting */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-teal-900/5 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="font-semibold text-ink dark:text-slate-100">Appearance & Theme</h2>
            </div>
            <span className="text-xs text-slate-650/70 dark:text-slate-400 font-medium">UI Preference</span>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-650 dark:text-slate-300">
              Customize the dashboard color mode for optimal readability and comfort in hospital environments.
            </p>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-ink dark:text-slate-200">Color Mode</p>
                <p className="text-xs text-slate-650/70 dark:text-slate-400">Switch between Light, Dark, or match System</p>
              </div>
              <ThemeSelector />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-2 p-5 border-b border-teal-900/5 dark:border-slate-800/80">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="font-semibold text-ink dark:text-slate-100">Security Settings</h2>
          </div>
          <div className="flex-1 p-5">
            <div className="divide-y divide-teal-900/5 dark:divide-slate-800/60">
              {[
                { label: "Authentication", value: "Supabase PostgreSQL — Session-based", status: "Configured" },
                { label: "Role-Based Access Control", value: "Admin & Nurse roles enforced via API", status: "Ready" },
                { label: "Device API Key Auth", value: "Per-robot API key — stored in env vars", status: "Ready" },
                { label: "Transport Encryption", value: "All traffic over HTTPS/TLS", status: "Ready" },
                { label: "Audit Logging", value: "All actions logged via delivery + alert history", status: "Ready" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-slate-200">{s.label}</p>
                    <p className="text-xs mt-0.5 text-slate-650 dark:text-slate-400">{s.value}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Registered Robots */}
        <Card className="flex flex-col lg:col-span-2">
          <div className="flex items-center justify-between p-5 border-b border-teal-900/5 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <IconRobot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="font-semibold text-ink dark:text-slate-100">Registered Robots</h2>
            </div>
            <Button size="sm" onClick={() => { setEditRobot(null); setShowModal(true); }}>
              <PlusCircle className="w-4 h-4 mr-1.5" /> Add Robot
            </Button>
          </div>

          <div className="flex-1 p-5 space-y-3">
            {robots.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No robots registered yet.</p>
            ) : (
              robots.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-mist dark:bg-slate-900/60 border border-teal-900/5 dark:border-slate-800/80">
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-slate-100">{r.name}</p>
                    <p className="text-xs text-slate-650 dark:text-slate-400">
                      Ward: {r.ward?.name || "—"} · Location: {r.currentLocation || "—"} · v{r.firmwareVersion || "—"} · {r.batteryLevel}% battery
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditRobot(r); setShowModal(true); }}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50 transition hover:bg-teal-100 dark:hover:bg-teal-900/80">Edit</button>
                    <button onClick={() => deleteRobot(r.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-rose-950/50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 dark:bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-ink dark:text-slate-100">{editRobot ? "Edit Robot" : "Add Robot"}</h2>
              <button onClick={() => { setShowModal(false); setEditRobot(null); }}><X className="w-5 h-5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200" /></button>
            </div>
            <RobotForm robot={editRobot} wards={wards} onSave={saveRobot} />
          </Card>
        </div>
      )}
    </div>
  );
}

function RobotForm({ robot, wards, onSave }: { robot: ApiRobot | null; wards: any[]; onSave: (f: any) => void }) {
  const [form, setForm] = useState({
    name: robot?.name ?? "", wardId: robot?.wardId ?? null,
    currentLocation: robot?.currentLocation ?? "", firmwareVersion: robot?.firmwareVersion ?? "v2.3.1",
  });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <Field label="Robot Name">
        <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Amigo A7" className={inputClass} />
      </Field>
      <Field label="Location">
        <input value={form.currentLocation} onChange={e => set("currentLocation", e.target.value)} placeholder="Room 101" className={inputClass} />
      </Field>
      <Field label="Firmware">
        <input value={form.firmwareVersion} onChange={e => set("firmwareVersion", e.target.value)} placeholder="v2.3.1" className={inputClass} />
      </Field>
      <Field label="Ward">
        <select value={form.wardId ?? ""} onChange={e => set("wardId", e.target.value ? Number(e.target.value) : null)} className={inputClass}>
          <option value="">Select…</option>
          {wards.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </Field>
      <div className="mt-6">
        <Button onClick={() => onSave(form)} className="w-full">Save Robot</Button>
      </div>
    </div>
  );
}
