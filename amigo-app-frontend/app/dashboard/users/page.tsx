"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Users, PlusCircle, Trash2, Shield, X } from "lucide-react";

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6" style={{ color: "#3b82f6" }} />
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", boxShadow: "0 0 15px rgba(59,130,246,0.3)" }}>
          <PlusCircle className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
              {["Name", "Email", "Role", "Created", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-white/[0.02]" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>{u.displayName?.charAt(0) ?? "?"}</div>
                    <span className="text-sm font-medium text-white">{u.displayName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{u.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" style={{ color: u.role === "admin" ? "#3b82f6" : "#94a3b8" }} />
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={u.role === "admin"
                        ? { background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }
                        : { background: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)" }}>
                      {u.role}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <CreateUserModal onClose={() => setShowModal(false)} onSave={addUser} />}
    </div>
  );
}

function CreateUserModal({ onClose, onSave }: { onClose: () => void; onSave: (f: any) => void }) {
  const [form, setForm] = useState({ displayName: "", email: "", role: "nurse" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Create Staff Account</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
        </div>
        <div className="space-y-4">
          {[{ l: "Full Name", k: "displayName", p: "Dr. Jane Smith" }, { l: "Email", k: "email", p: "jane@hospital.com" }].map(f => (
            <div key={f.k}><label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>{f.l}</label>
              <input value={(form as any)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.p}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.2)" }} /></div>
          ))}
          <div><label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <option value="nurse">Nurse</option><option value="admin">Admin</option>
            </select></div>
          <button onClick={() => onSave(form)} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>Create User</button>
        </div>
      </div>
    </div>
  );
}
