"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button, Card, StatusPill, Field, inputClass } from "@/components/ui";
import { IconClipboard, IconClock, IconPulse, IconCheckCircle, IconXCircle } from "@/components/icons";

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

const tabs = ["All", "Pending", "In Progress", "Completed", "Failed"] as const;

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<ApiDelivery[]>([]);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

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

  async function markStatus(id: number, status: string) {
    setBusyId(id);
    try {
      await api.updateDeliveryStatus(id, status);
      await loadDeliveries();
    } catch (e) { console.error(e); }
    setBusyId(null);
  }

  const pendingCount = deliveries.filter((d) => d.status === "Pending").length;
  const inProgressCount = deliveries.filter((d) => d.status === "In Progress").length;
  const completedCount = deliveries.filter((d) => d.status === "Completed").length;
  const failedCount = deliveries.filter((d) => d.status === "Failed" || d.status === "Missed").length;

  const filtered = deliveries.filter((d) => {
    if (tab === "All") return true;
    if (tab === "Failed") return d.status === "Failed" || d.status === "Missed";
    return d.status === tab;
  });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <IconClipboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Dispense Schedule</h1>
            <p className="text-sm text-slate-650">Manage and track medication deliveries.</p>
          </div>
        </div>
        <Button onClick={openModal}>
          Schedule Dispense
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-5 cursor-pointer hover:-translate-y-0.5 transition" onClick={() => setTab("Pending")}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-650">Pending</p>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <IconClock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-ink">{pendingCount}</p>
        </Card>
        <Card className="p-5 cursor-pointer hover:-translate-y-0.5 transition" onClick={() => setTab("In Progress")}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-650">In Progress</p>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <IconPulse className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-ink">{inProgressCount}</p>
        </Card>
        <Card className="p-5 cursor-pointer hover:-translate-y-0.5 transition" onClick={() => setTab("Completed")}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-650">Completed</p>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-400/15 text-sage-500">
              <IconCheckCircle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-ink">{completedCount}</p>
        </Card>
        <Card className="p-5 cursor-pointer hover:-translate-y-0.5 transition" onClick={() => setTab("Failed")}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-650">Failed / Missed</p>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral-400/15 text-coral-500">
              <IconXCircle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-ink">{failedCount}</p>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-900/5 px-6 py-4">
          <p className="font-display text-lg font-semibold text-ink">Delivery Queue</p>
          <div className="flex items-center gap-1 rounded-full bg-mist p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  tab === t ? "bg-white text-teal-700 shadow-card" : "text-slate-650"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-650/60">
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-3 py-3 font-medium">Room</th>
                <th className="px-3 py-3 font-medium">Medicine</th>
                <th className="px-3 py-3 font-medium">Robot</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Scheduled</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-900/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-650">
                    No deliveries in this view.
                  </td>
                </tr>
              )}
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="px-6 py-4 font-medium text-ink">
                    {d.patient ? `${d.patient.firstName} ${d.patient.lastName}` : "—"}
                  </td>
                  <td className="px-3 py-4 text-slate-650">{d.patient?.roomNumber ?? "—"}</td>
                  <td className="px-3 py-4">
                    {d.medicine?.name ? (
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                        {d.medicine.name}
                      </span>
                    ) : (
                      <span className="text-slate-650/60">—</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-slate-650">{d.assignedRobot?.name || "—"}</td>
                  <td className="px-3 py-4">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-slate-650">
                    {new Date(d.scheduledTime).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {(d.status === "Pending" || d.status === "In Progress") ? (
                      <div className="flex items-center gap-3">
                        <button
                          disabled={busyId === d.id}
                          onClick={() => markStatus(d.id, "Completed")}
                          className="text-xs font-medium text-teal-600 hover:underline disabled:opacity-50"
                        >
                          Complete
                        </button>
                        <button
                          disabled={busyId === d.id}
                          onClick={() => markStatus(d.id, "Failed")}
                          className="text-xs font-medium text-coral-500 hover:underline disabled:opacity-50"
                        >
                          Fail
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-650/50">No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Schedule Dispense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold text-ink mb-6">Schedule Dispense</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Field label="Patient">
                <select required value={newDelivery.patientId} onChange={e => setNewDelivery({...newDelivery, patientId: e.target.value})} className={inputClass}>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (Room {p.roomNumber})</option>)}
                </select>
              </Field>
              <Field label="Medication">
                <select required value={newDelivery.medicineId} onChange={e => setNewDelivery({...newDelivery, medicineId: e.target.value})} className={inputClass}>
                  <option value="1">Aspirin 500mg</option>
                  <option value="2">Ibuprofen 400mg</option>
                  <option value="3">Amoxicillin 250mg</option>
                  <option value="4">Lisinopril 10mg</option>
                </select>
              </Field>
              <Field label="Assigned Robot">
                <select required value={newDelivery.robotId} onChange={e => setNewDelivery({...newDelivery, robotId: e.target.value})} className={inputClass}>
                  {robots.map(r => <option key={r.id} value={r.id}>{r.name} ({r.status})</option>)}
                </select>
              </Field>
              <Field label="Scheduled Time">
                <input required type="datetime-local" value={newDelivery.time} onChange={e => setNewDelivery({...newDelivery, time: e.target.value})} className={inputClass} />
              </Field>
              <div className="flex items-center gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={creating} className="flex-1">
                  {creating ? "Scheduling..." : "Schedule"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
