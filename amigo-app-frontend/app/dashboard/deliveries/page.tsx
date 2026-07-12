"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatTimestamp } from "@/lib/utils";
import { ClipboardList, CheckCircle2, Clock, XCircle, Activity, Filter, Box, Plus, X } from "lucide-react";

interface ApiDelivery {
  id: number;
  patientId: number | null;
  medicineId: number | null;
  assignedRobotId: number | null;
  scheduledTime: string;
  status: string;
  scannedAt: string | null;
  patient: { firstName: string; lastName: string; roomNumber: string } | null;
  medicine: { name: string } | null;
  assignedRobot: { name: string } | null;
}

const statusOptions = ["all", "Pending", "In Progress", "Completed", "Missed", "Failed"] as const;
type FilterType = (typeof statusOptions)[number];

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<ApiDelivery[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [robots, setRobots] = useState<any[]>([]);
  const [newDelivery, setNewDelivery] = useState({ patientId: "", robotId: "", medicineId: "1", time: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadDeliveries(); }, []);

  async function loadDeliveries() {
    try { setDeliveries(await api.getDeliveries()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function openModal() {
    if (patients.length === 0) {
      try {
        const [pData, rData] = await Promise.all([api.getPatients(), api.getRobots()]);
        setPatients(pData);
        setRobots(rData);
        if (pData.length > 0) setNewDelivery(prev => ({ ...prev, patientId: pData[0].id.toString() }));
        if (rData.length > 0) setNewDelivery(prev => ({ ...prev, robotId: rData[0].id.toString() }));
        
        // Default time to next hour
        const d = new Date();
        d.setHours(d.getHours() + 1);
        d.setMinutes(0);
        // Format to local ISO datetime for the input
        setNewDelivery(prev => ({ ...prev, time: new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) }));
      } catch (e) { console.error(e); }
    }
    setShowModal(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createDelivery({
        patientId: parseInt(newDelivery.patientId),
        medicineId: parseInt(newDelivery.medicineId),
        assignedRobotId: parseInt(newDelivery.robotId),
        scheduledTime: new Date(newDelivery.time).toISOString()
      });
      setShowModal(false);
      loadDeliveries();
    } catch (error) {
      console.error("Failed to create delivery", error);
      alert("Failed to schedule delivery. Ensure backend is restarted.");
    } finally {
      setCreating(false);
    }
  }

  const filtered = filter === "all" ? deliveries : deliveries.filter(d => d.status === filter);

  async function markStatus(id: number, status: string) {
    try {
      await api.updateDeliveryStatus(id, status);
      loadDeliveries();
    } catch (e) { console.error(e); }
  }

  const statusIcon: Record<string, React.ReactNode> = {
    Pending: <Clock className="w-4 h-4" style={{ color: "#f59e0b" }} />,
    "In Progress": <Activity className="w-4 h-4" style={{ color: "#3b82f6" }} />,
    Completed: <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />,
    Missed: <XCircle className="w-4 h-4" style={{ color: "#ef4444" }} />,
    Failed: <XCircle className="w-4 h-4" style={{ color: "#ef4444" }} />,
  };

  if (loading) return <div className="p-6 text-slate-400">Loading deliveries...</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border" 
               style={{ background: "rgba(59, 130, 246, 0.1)", borderColor: "rgba(59, 130, 246, 0.3)" }}>
            <ClipboardList className="w-5 h-5" style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dispense Schedule</h1>
            <p className="text-sm text-slate-400 mt-1">Manage and track medication deliveries.</p>
          </div>
        </div>
        <button onClick={openModal} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95">
          <Plus className="w-4 h-4" /> Schedule Dispense
        </button>
      </div>

      <div className="stat-grid">
        {([
          { label: "Pending", status: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
          { label: "In Progress", status: "In Progress", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: Activity },
          { label: "Completed", status: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: CheckCircle2 },
          { label: "Failed/Missed", status: "Missed", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
        ]).map(s => {
          const count = deliveries.filter(d => s.status === "Missed" ? (d.status === "Missed" || d.status === "Failed") : d.status === s.status).length;
          const isActive = filter === s.status;
          return (
            <div key={s.label} onClick={() => setFilter(isActive ? "all" : s.status as FilterType)} 
                 className={`stat-card cursor-pointer transition-all hover:-translate-y-1 ${isActive ? 'ring-2 ring-blue-500' : ''}`}
                 style={isActive ? { background: "rgba(59,130,246,0.05)" } : {}}>
              <div className="stat-top">
                <span className="label" style={{ color: isActive ? '#fff' : '' }}>{s.label}</span>
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="stat-value">{count}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Delivery Queue</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 mr-2" />
            {statusOptions.map(s => (
              <button key={s} onClick={() => setFilter(s)} 
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={filter === s 
                  ? { background: "rgba(59,130,246,0.2)", color: "#fff", border: "1px solid rgba(59,130,246,0.5)" }
                  : { background: "rgba(255,255,255,0.03)", color: "var(--ink-soft)", border: "1px solid rgba(255,255,255,0.08)" }
                }>
                {s}
              </button>
            ))}
          </div>
        </div>
        
        <table className="w-full">
          <thead>
            <tr>
              {["Patient", "Room", "Medicine", "Robot", "Status", "Scheduled", "Actions"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <Box className="w-8 h-8 text-slate-600 mx-auto mb-3 opacity-50" />
                  <p className="text-slate-400 text-sm">No deliveries found matching the current filter.</p>
                </td>
              </tr>
            ) : filtered.map(d => (
              <tr key={d.id}>
                <td>
                  <div className="font-semibold text-white">{d.patient ? `${d.patient.firstName} ${d.patient.lastName}` : "—"}</div>
                </td>
                <td><span className="font-mono text-slate-300">{d.patient?.roomNumber || "—"}</span></td>
                <td>
                  <span className="px-2 py-1 rounded bg-slate-800 text-cyan-400 text-xs font-medium border border-cyan-900">
                    {d.medicine?.name || "—"}
                  </span>
                </td>
                <td><span className="text-slate-400 text-sm">{d.assignedRobot?.name || "—"}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    {statusIcon[d.status]}
                    <span className="text-xs font-medium">{d.status}</span>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-slate-400">{formatTimestamp(d.scheduledTime)}</span>
                </td>
                <td>
                  {(d.status === "Pending" || d.status === "In Progress") ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => markStatus(d.id, "Completed")} 
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-emerald-500/20"
                        style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                        Complete
                      </button>
                      <button onClick={() => markStatus(d.id, "Failed")} 
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-red-500/20"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                        Fail
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-600 text-xs font-medium italic">No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 relative border-slate-700/50">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Schedule Dispense</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Patient</label>
                <select required value={newDelivery.patientId} onChange={e => setNewDelivery({...newDelivery, patientId: e.target.value})} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm outline-none focus:border-blue-500">
                  {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (Room {p.roomNumber})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Medication</label>
                <select required value={newDelivery.medicineId} onChange={e => setNewDelivery({...newDelivery, medicineId: e.target.value})} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm outline-none focus:border-blue-500">
                  <option value="1">Aspirin 500mg</option>
                  <option value="2">Ibuprofen 400mg</option>
                  <option value="3">Amoxicillin 250mg</option>
                  <option value="4">Lisinopril 10mg</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Assigned Robot</label>
                <select required value={newDelivery.robotId} onChange={e => setNewDelivery({...newDelivery, robotId: e.target.value})} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm outline-none focus:border-blue-500">
                  {robots.map(r => <option key={r.id} value={r.id}>{r.name} ({r.status})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Scheduled Time</label>
                <input required type="datetime-local" value={newDelivery.time} onChange={e => setNewDelivery({...newDelivery, time: e.target.value})} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm outline-none focus:border-blue-500 [color-scheme:dark]" />
              </div>
              <button type="submit" disabled={creating} className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50">
                {creating ? "Scheduling..." : "Schedule Delivery"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
