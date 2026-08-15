"use client";

import { useEffect, useState, Suspense } from "react";
import { api } from "@/lib/api";
import { Button, Card, Field, inputClass } from "@/components/ui";

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

function PatientsPageInner() {
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [robots, setRobots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState<ApiPatient | null>(null);
  
  const [form, setForm] = useState({
    firstName: "", lastName: "",
    wardId: null as number | null, roomNumber: "",
    condition: "", nfcTag: "",
    assignedRobotId: null as number | null, status: "Admitted",
  });
  const [submitting, setSubmitting] = useState(false);

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

  async function savePatient(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editPatient) { await api.updatePatient(editPatient.id, form); }
      else { await api.createPatient(form); }
      setShowModal(false); setEditPatient(null); loadData();
    } catch (err) { console.error(err); }
    setSubmitting(false);
  }
  
  function openAdd() {
    setEditPatient(null);
    setForm({ firstName: "", lastName: "", wardId: null, roomNumber: "", condition: "", nfcTag: "", assignedRobotId: null, status: "Admitted" });
    setShowModal(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Patients Details</h1>
          <p className="text-sm text-slate-650">Register patients, manage conditions, and assign NFC tags.</p>
        </div>
        <Button onClick={() => setShowModal(!showModal)}>
          {showModal ? "Close" : "Add Patient"}
        </Button>
      </div>

      {showModal && (
        <Card className="mb-6 p-6">
          <form onSubmit={savePatient} className="grid grid-cols-2 gap-4">
            <Field label="First name">
              <input required className={inputClass} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
            </Field>
            <Field label="Last name">
              <input required className={inputClass} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
            </Field>
            <Field label="Room Number">
              <input className={inputClass} value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder="101A" />
            </Field>
            <Field label="Ward">
              <select className={inputClass} value={form.wardId || ""} onChange={(e) => setForm({ ...form, wardId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">None</option>
                {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Condition">
              <input className={inputClass} value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="Stable" />
            </Field>
            <Field label="NFC Tag / RFID">
              <input className={inputClass} value={form.nfcTag} onChange={(e) => setForm({ ...form, nfcTag: e.target.value })} placeholder="UUID" />
            </Field>
            <Field label="Assigned Robot">
              <select className={inputClass} value={form.assignedRobotId || ""} onChange={(e) => setForm({ ...form, assignedRobotId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">None</option>
                {robots.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </Field>
            
            <div className="col-span-2 mt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Patient"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="divide-y divide-teal-900/5">
        {patients.length === 0 && (
          <p className="p-6 text-sm text-slate-650">{loading ? "Loading patients..." : "No patients found."}</p>
        )}
        {patients.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-6 py-4 transition hover:bg-mist">
            <div>
              <p className="font-medium text-ink">{p.firstName} {p.lastName}</p>
              <p className="text-xs text-slate-650">
                Condition: {p.condition || "N/A"} · Tag: <span className="font-mono text-teal-600">{p.nfcTag || "None"}</span>
              </p>
            </div>
            <div className="text-right flex items-center gap-6">
              <div className="text-right">
                {p.roomNumber ? (
                  <p className="text-sm font-medium text-teal-600">Room {p.roomNumber}</p>
                ) : (
                  <p className="text-sm text-coral-500">No room assigned</p>
                )}
                <p className="text-xs text-slate-650/70">{p.ward?.name ?? "No Ward"}</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => deletePatient(p.id)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense>
      <PatientsPageInner />
    </Suspense>
  );
}
