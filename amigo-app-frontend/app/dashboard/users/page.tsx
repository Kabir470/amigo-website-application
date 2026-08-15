"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { IconUsers } from "@/components/icons";
import { Shield, Trash2, X } from "lucide-react";

interface ApiUser {
  id: number;
  displayName: string;
  email: string;
  role: string;
  department: string | null;
  employeeId: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    try { setUsers(await api.getUsers()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function deleteUser(id: number) {
    if (!confirm("Delete this user?")) return;
    try { await api.deleteUser(id); setUsers(prev => prev.filter(u => u.id !== id)); } catch (e) { console.error(e); }
  }

  async function addUser(form: { displayName: string; email: string; role: string }) {
    try { await api.createUser(form); setShowModal(false); loadUsers(); } catch (e) { console.error(e); }
  }

  if (loading) return <div className="p-6 text-slate-400">Loading users...</div>;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <IconUsers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Manage Users</h1>
            <p className="text-sm text-slate-650">Hospital staff with access to this dashboard.</p>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)}>Add User</Button>
      </div>

      <Card className="divide-y divide-teal-900/5">
        {users.length === 0 && <p className="p-6 text-sm text-slate-650">No users found.</p>}
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between px-6 py-4 hover:bg-mist transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-teal-100 text-teal-700">
                {u.displayName?.charAt(0) ?? "?"}
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{u.displayName}</p>
                <p className="text-xs text-slate-650">{u.email} · Added {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                u.role === "admin" ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-mist text-slate-650 border border-slate-200"
              }`}>
                <Shield className="w-3.5 h-3.5" />
                {u.role}
              </span>
              <button onClick={() => deleteUser(u.id)} className="p-2 rounded-lg text-slate-400 hover:text-coral-500 hover:bg-coral-50 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>

      {showModal && <CreateUserModal onClose={() => setShowModal(false)} onSave={addUser} />}
    </div>
  );
}

function CreateUserModal({ onClose, onSave }: { onClose: () => void; onSave: (f: any) => void }) {
  const [form, setForm] = useState({ displayName: "", email: "", role: "nurse" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 relative">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-ink">Create Staff Account</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-650" /></button>
        </div>
        <div className="space-y-4">
          <Field label="Full Name">
            <input value={form.displayName} onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))} placeholder="Dr. Jane Smith"
              className={inputClass} />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@hospital.com"
              className={inputClass} />
          </Field>
          <Field label="Role">
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className={inputClass}>
              <option value="nurse">Nurse</option><option value="admin">Admin</option>
            </select>
          </Field>
          <div className="mt-6">
            <Button onClick={() => onSave(form)} className="w-full">Create User</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
