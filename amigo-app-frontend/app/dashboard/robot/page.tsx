"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatTimestamp, batteryColor } from "@/lib/utils";
import {
  Bot,
  Wifi,
  WifiOff,
  Zap,
  Play,
  Pause,
  Square,
  Home,
  Cpu,
  Clock,
  Route,
  AlertTriangle,
} from "lucide-react";

interface ApiRobot {
  id: number;
  name: string;
  wardId: number | null;
  currentLocation: string | null;
  status: string;
  batteryLevel: number;
  firmwareVersion: string | null;
  nfcModuleStatus: string | null;
  lineFollowerSensitivity: number | null;
  nfcReadRange: number | null;
  maxSpeed: number | null;
  createdAt: string;
  ward: { id: number; name: string } | null;
}

export default function RobotPage() {
  const [robots, setRobots] = useState<ApiRobot[]>([]);
  const [selected, setSelected] = useState<ApiRobot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRobots();
  }, []);

  async function loadRobots() {
    try {
      const data = await api.getRobots();
      setRobots(data);
      if (data.length > 0 && !selected) setSelected(data[0]);
    } catch (e) {
      console.error("Failed to load robots:", e);
    } finally {
      setLoading(false);
    }
  }

  async function sendCommand(command: "pause" | "resume" | "stop" | "return-to-base") {
    if (!selected) return;
    const statusMap: Record<string, string> = {
      pause: "Maintenance",
      resume: "Active",
      stop: "Maintenance",
      "return-to-base": "Charging",
    };
    try {
      const updated = await api.updateRobot(selected.id, {
        ...selected,
        status: statusMap[command],
      });
      setSelected(updated);
      loadRobots();
    } catch (e) {
      console.error("Failed to send command:", e);
    }
  }

  async function pushConfig(sensitivity: number, maxSpeed: number) {
    if (!selected) return;
    try {
      const updated = await api.updateRobot(selected.id, {
        ...selected,
        lineFollowerSensitivity: sensitivity,
        maxSpeed: maxSpeed,
      });
      setSelected(updated);
      loadRobots();
    } catch (e) {
      console.error("Failed to push config:", e);
    }
  }

  function selectRobot(r: ApiRobot) {
    setSelected(robots.find((x) => x.id === r.id) ?? r);
  }

  if (loading) return <div className="p-6 text-slate-400">Loading robots from database...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Bot className="w-6 h-6" style={{ color: "#06b6d4" }} />
        <h1 className="text-2xl font-bold text-white">Robot Monitor & Control</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Robot list */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#475569" }}>Fleet</p>
          {robots.map((r) => (
            <button
              key={r.id}
              id={`robot-card-${r.id}`}
              onClick={() => selectRobot(r)}
              className="w-full glass-card p-4 text-left transition-all hover:scale-[1.01]"
              style={selected?.id === r.id ? { border: "1px solid rgba(6,182,212,0.4)" } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: r.status === "Active" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
                    <Bot className="w-5 h-5" style={{ color: r.status === "Active" ? "#10b981" : "#ef4444" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.ward?.name || "Unassigned"}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full`}
                  style={{ background: r.status === "Active" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: r.status === "Active" ? "#10b981" : "#ef4444" }}>
                  {r.status}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: batteryColor(r.batteryLevel) }}>
                <Zap className="w-3 h-3" />
                {r.batteryLevel}% battery
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white text-lg">{selected.name}</h2>
                <div className="flex items-center gap-2">
                  {selected.status === "Active" ? (
                    <Wifi className="w-4 h-4" style={{ color: "#10b981" }} />
                  ) : (
                    <WifiOff className="w-4 h-4" style={{ color: "#ef4444" }} />
                  )}
                  <span className="text-sm font-medium px-3 py-1 rounded-full"
                    style={{ background: selected.status === "Active" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: selected.status === "Active" ? "#10b981" : "#ef4444" }}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Battery", value: `${selected.batteryLevel}%`, icon: Zap, color: batteryColor(selected.batteryLevel) },
                  { label: "Location", value: selected.currentLocation || "—", icon: Route, color: "#3b82f6" },
                  { label: "Firmware", value: selected.firmwareVersion || "—", icon: Cpu, color: "#06b6d4" },
                  { label: "NFC Status", value: selected.nfcModuleStatus || "—", icon: Clock, color: "#94a3b8" },
                  { label: "Max Speed", value: selected.maxSpeed ? `${selected.maxSpeed} m/s` : "—", icon: Route, color: "#f59e0b" },
                  { label: "Ward", value: selected.ward?.name || "—", icon: AlertTriangle, color: "#94a3b8" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                      <p className="text-xs" style={{ color: "#475569" }}>{s.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4" style={{ color: "#3b82f6" }} />
                <h3 className="font-medium text-white">Manual Override Controls</h3>
                <span className="text-xs ml-auto px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  Admin Only
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { cmd: "resume" as const, label: "Resume", icon: Play, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
                  { cmd: "pause" as const, label: "Pause", icon: Pause, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
                  { cmd: "stop" as const, label: "Stop", icon: Square, color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
                  { cmd: "return-to-base" as const, label: "Return to Base", icon: Home, color: "#06b6d4", bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.3)" },
                ].map(({ cmd, label, icon: Icon, color, bg, border }) => (
                  <button key={cmd} id={`robot-cmd-${cmd}`} onClick={() => sendCommand(cmd)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: bg, color, border: `1px solid ${border}` }}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: "#475569" }}>
                Commands are persisted to the Supabase database in real-time.
              </p>
            </div>

            {/* Config */}
            <RobotConfigEditor robot={selected} onSave={pushConfig} />
          </div>
        )}
      </div>
    </div>
  );
}

function RobotConfigEditor({ robot, onSave }: { robot: ApiRobot; onSave: (sensitivity: number, maxSpeed: number) => void }) {
  const [sensitivity, setSensitivity] = useState(robot.lineFollowerSensitivity || 70);
  const [maxSpeed, setMaxSpeed] = useState(robot.maxSpeed || 0.6);
  const [saved, setSaved] = useState(false);

  function save() {
    onSave(sensitivity, maxSpeed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="glass-card p-5">
      <h3 className="font-medium text-white mb-4">Line-Following Configuration</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>
            Sensor Sensitivity: <span style={{ color: "#3b82f6" }}>{sensitivity}</span>
          </label>
          <input type="range" min={10} max={100} value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>
            Max Speed (m/s): <span style={{ color: "#3b82f6" }}>{maxSpeed}</span>
          </label>
          <input type="range" min={0.1} max={2} step={0.1} value={maxSpeed} onChange={(e) => setMaxSpeed(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
      </div>
      <button id="save-robot-config" onClick={save}
        className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
        style={{ background: saved ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>
        {saved ? "✓ Config Applied to DB" : "Push Config to Robot"}
      </button>
    </div>
  );
}
