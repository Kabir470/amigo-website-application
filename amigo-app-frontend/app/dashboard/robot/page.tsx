"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button, Card, StatusPill } from "@/components/ui";
import { IconRobot } from "@/components/icons";
import {
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
import { batteryColor } from "@/lib/utils";

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
    <div>
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <IconRobot className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Robot Monitor & Control</h1>
          <p className="text-sm text-slate-650">Live diagnostics, configuration, and manual overrides for the fleet.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Robot list */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-slate-650">Fleet</p>
          {robots.map((r) => (
            <button
              key={r.id}
              onClick={() => selectRobot(r)}
              className="w-full text-left transition-all hover:scale-[1.01]"
            >
              <Card className="p-4" style={selected?.id === r.id ? { border: "2px solid var(--teal-500)" } : {}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50">
                      <IconRobot className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{r.name}</p>
                      <p className="text-xs text-slate-650/70">{r.ward?.name || "Unassigned"}</p>
                    </div>
                  </div>
                  <StatusPill status={r.status} />
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: batteryColor(r.batteryLevel) }}>
                  <Zap className="w-3 h-3" />
                  {r.batteryLevel}% battery
                </div>
              </Card>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-ink text-lg">{selected.name}</h2>
                <div className="flex items-center gap-2">
                  {selected.status === "Active" ? (
                    <Wifi className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-coral-500" />
                  )}
                  <StatusPill status={selected.status} />
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
                  <div key={s.label} className="rounded-xl p-3 bg-mist border border-teal-900/5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                      <p className="text-xs text-slate-650">{s.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink">{s.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Controls */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-teal-600" />
                <h3 className="font-medium text-ink">Manual Override Controls</h3>
                <span className="text-xs ml-auto px-2 py-0.5 rounded-full bg-coral-500/10 text-coral-600 border border-coral-500/20">
                  Admin Only
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { cmd: "resume" as const, label: "Resume", icon: Play, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
                  { cmd: "pause" as const, label: "Pause", icon: Pause, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
                  { cmd: "stop" as const, label: "Stop", icon: Square, color: "text-coral-600", bg: "bg-coral-50", border: "border-coral-200" },
                  { cmd: "return-to-base" as const, label: "Return to Base", icon: Home, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
                ].map(({ cmd, label, icon: Icon, color, bg, border }) => (
                  <button key={cmd} onClick={() => sendCommand(cmd)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${bg} ${color} border ${border} hover:scale-[1.02]`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-3 text-slate-650/70">
                Commands are persisted to the database in real-time. Use this if a delivery gets stuck.
              </p>
            </Card>

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
    <Card className="p-5">
      <h3 className="font-medium text-ink mb-4">Firmware & Line-Following Configuration</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-slate-650">
            Sensor Sensitivity: <span className="text-teal-600 font-bold">{sensitivity}</span>
          </label>
          <input type="range" min={10} max={100} value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className="w-full accent-teal-600" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-slate-650">
            Max Speed (m/s): <span className="text-teal-600 font-bold">{maxSpeed}</span>
          </label>
          <input type="range" min={0.1} max={2} step={0.1} value={maxSpeed} onChange={(e) => setMaxSpeed(Number(e.target.value))} className="w-full accent-teal-600" />
        </div>
      </div>
      <Button onClick={save}>
        {saved ? "✓ Config Applied to DB" : "Push Config to Robot"}
      </Button>
      <p className="mt-3 text-xs text-slate-650/70">
        Motor speed, PID line-following gains, and corridor map editing will live here once the
        hardware team wires up the config endpoint on the robot's onboard controller.
      </p>
    </Card>
  );
}
