"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Settings, PlusCircle, Trash2, X, Bot } from "lucide-react";

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

  if (loading) return <div className="p-6 text-slate-400">Loading settings...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6" style={{ color: "#3b82f6" }} />
        <h1 className="text-2xl font-bold text-white">System Configuration</h1>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" style={{ color: "#06b6d4" }} />
            <h2 className="font-semibold text-white">Registered Robots</h2>
          </div>
          <button onClick={() => { setEditRobot(null); setShowModal(true); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>
            <PlusCircle className="w-4 h-4" /> Add Robot
          </button>
        </div>

        {robots.length === 0 ? (
          <p className="text-slate-500 text-sm">No robots registered yet.</p>
        ) : (
          <div className="space-y-3">
            {robots.map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <p className="text-sm font-medium text-white">{r.name}</p>
                  <p className="text-xs text-slate-500">
                    Ward: {r.ward?.name || "—"} · Location: {r.currentLocation || "—"} · v{r.firmwareVersion || "—"} · {r.batteryLevel}% battery
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditRobot(r); setShowModal(true); }}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}>Edit</button>
                  <button onClick={() => deleteRobot(r.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card p-5" style={{ border: "1px solid rgba(59,130,246,0.15)" }}>
        <h2 className="font-semibold text-white mb-3">Security Settings</h2>
        <div className="space-y-3">
          {[
            { label: "Authentication", value: "Supabase PostgreSQL — Session-based", status: "Configured" },
            { label: "Role-Based Access Control", value: "Admin & Nurse roles enforced via API", status: "Ready" },
            { label: "Device API Key Auth", value: "Per-robot API key — stored in env vars", status: "Ready" },
            { label: "Transport Encryption", value: "All traffic over HTTPS/TLS", status: "Ready" },
            { label: "Audit Logging", value: "All actions logged via delivery + alert history", status: "Ready" },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <p className="text-sm font-medium text-white">{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{s.value}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">{editRobot ? "Edit Robot" : "Add Robot"}</h2>
              <button onClick={() => { setShowModal(false); setEditRobot(null); }}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
            </div>
            <RobotForm robot={editRobot} wards={wards} onSave={saveRobot} />
          </div>
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
      {[{ l: "Robot Name", k: "name", p: "Amigo A7" }, { l: "Location", k: "currentLocation", p: "Room 101" }, { l: "Firmware", k: "firmwareVersion", p: "v2.3.1" }].map(f => (
        <div key={f.k}><label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>{f.l}</label>
          <input value={(form as any)[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.p}
            className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.2)" }} /></div>
      ))}
      <div><label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>Ward</label>
        <select value={form.wardId ?? ""} onChange={e => set("wardId", e.target.value ? Number(e.target.value) : null)}
          className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <option value="">Select…</option>{wards.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select></div>
      <button onClick={() => onSave(form)} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>Save Robot</button>
    </div>
  );
}
