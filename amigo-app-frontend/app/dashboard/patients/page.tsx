"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { BedDouble, Edit2, PlusCircle, Trash2, X } from "lucide-react";

interface ApiPatient {
  id: number;
  firstName: string;
  lastName: string;
  age: number | null;
  wardId: number | null;
  roomNumber: string | null;
  condition: string | null;
  nfcTag: string | null;
  assignedRobotId: number | null;
  status: string | null;
  ward: { id: number; name: string } | null;
  assignedRobot: { id: number; name: string } | null;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [robots, setRobots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState<ApiPatient | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [p, w, r] = await Promise.all([api.getPatients(), api.getWards(), api.getRobots()]);
      setPatients(p); setWards(w); setRobots(r);
    } catch (e) { console.error("Failed to load:", e); } finally { setLoading(false); }
  }

  async function deletePatient(id: number) {
    if (!confirm("Delete this patient?")) return;
    try { await api.deletePatient(id); setPatients(prev => prev.filter(p => p.id !== id)); } catch (e) { console.error(e); }
  }

  async function savePatient(form: any) {
    try {
      if (editPatient) { await api.updatePatient(editPatient.id, form); }
      else { await api.createPatient(form); }
      setShowModal(false); setEditPatient(null); loadData();
    } catch (e) { console.error(e); }
  }

  if (loading) return <div className="p-6 text-slate-400">Loading patients...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BedDouble className="w-6 h-6" style={{ color: "#3b82f6" }} />
          <h1 className="text-2xl font-bold text-white">Patients</h1>
        </div>
        <button onClick={() => { setEditPatient(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", boxShadow: "0 0 15px rgba(59,130,246,0.3)" }}>
          <PlusCircle className="w-4 h-4" /> Add Patient
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
              {["Patient", "Ward", "Room", "Condition", "NFC Tag", "Robot", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} className="border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>{p.firstName.charAt(0)}</div>
                    <span className="text-sm font-medium text-white">{p.firstName} {p.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{p.ward?.name || "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{p.roomNumber || "—"}</td>
                <td className="px-4 py-3 text-xs text-slate-400">{p.condition || "—"}</td>
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{p.nfcTag || "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{p.assignedRobot?.name || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditPatient(p); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-500 hover:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deletePatient(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">{editPatient ? "Edit Patient" : "Add Patient"}</h2>
              <button onClick={() => { setShowModal(false); setEditPatient(null); }}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
            </div>
            <PatientForm patient={editPatient} wards={wards} robots={robots} onSave={savePatient} />
          </div>
        </div>
      )}
    </div>
  );
}

function PatientForm({ patient, wards, robots, onSave }: { patient: ApiPatient | null; wards: any[]; robots: any[]; onSave: (f: any) => void }) {
  const [form, setForm] = useState({
    firstName: patient?.firstName ?? "", lastName: patient?.lastName ?? "",
    wardId: patient?.wardId ?? null, roomNumber: patient?.roomNumber ?? "",
    condition: patient?.condition ?? "", nfcTag: patient?.nfcTag ?? "",
    assignedRobotId: patient?.assignedRobotId ?? null, status: patient?.status ?? "Admitted",
  });
  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));
  return (
    <div className="space-y-4">
      {[{ l: "First Name", k: "firstName" }, { l: "Last Name", k: "lastName" }, { l: "Room", k: "roomNumber" }, { l: "Condition", k: "condition" }, { l: "NFC Tag", k: "nfcTag" }].map(f => (
        <div key={f.k}><label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>{f.l}</label>
          <input value={(form as any)[f.k]} onChange={e => set(f.k, e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.2)" }} /></div>
      ))}
      <div><label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>Ward</label>
        <select value={form.wardId ?? ""} onChange={e => set("wardId", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <option value="">Select…</option>{wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select></div>
      <div><label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>Assigned Robot</label>
        <select value={form.assignedRobotId ?? ""} onChange={e => set("assignedRobotId", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <option value="">None</option>{robots.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select></div>
      <button onClick={() => onSave(form)} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>Save Patient</button>
    </div>
  );
}
