"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Robot {
  id: number;
  name: string;
  status: string;
  batteryLevel: number;
  currentLocation: string;
  ward: { name: string } | null;
}

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  roomNumber: string | null;
  condition: string;
  ward: { name: string } | null;
  assignedRobot: { name: string } | null;
}

interface Delivery {
  id: number;
  scheduledTime: string;
  status: string;
  patient: { firstName: string; lastName: string; roomNumber: string } | null;
  medicine: { name: string } | null;
}

interface Alert {
  id: number;
  type: string;
  message: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  const [robots, setRobots] = useState<Robot[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setFetchError(null);
        const [robotsRes, patientsRes, deliveriesRes, alertsRes] = await Promise.all([
          api.getRobots(),
          api.getPatients(),
          api.getDeliveries(),
          api.getActiveAlerts()
        ]);

        setRobots(robotsRes);
        setPatients(patientsRes);
        setDeliveries(deliveriesRes);
        setAlerts(alertsRes);
      } catch (error: any) {
        console.error("API Fetch Error:", error);
        setFetchError("Unable to connect to the backend API.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeRobotsCount = robots.filter(r => r.status === 'Active' || r.status === 'En route').length;
  const completedDeliveries = deliveries.filter(d => d.status === 'Completed').length;
  const pendingDeliveries = deliveries.filter(d => d.status !== 'Completed').length;

  // Dynamically group rooms by ward based on patients data
  const wardMap = patients.reduce((acc, p) => {
    const wName = p.ward?.name || "Unassigned Ward";
    if (!acc[wName]) acc[wName] = [];
    if (p.roomNumber && !acc[wName].includes(p.roomNumber)) {
      acc[wName].push(p.roomNumber);
    }
    return acc;
  }, {} as Record<string, string[]>);

  const availableWards = Object.keys(wardMap).sort();
  const [selectedWard, setSelectedWard] = useState<string>("");

  useEffect(() => {
    if (availableWards.length > 0 && !selectedWard) {
      setSelectedWard(availableWards[0]);
    }
  }, [availableWards, selectedWard]);

  // Rooms from DB for selected ward — marked as real or empty
  const dbRooms: string[] = selectedWard && wardMap[selectedWard] ? [...wardMap[selectedWard]].sort() : [];
  // Pad with null sentinels to always show 6 slots minimum
  const MIN_SLOTS = 6;
  const padded: (string | null)[] = [...dbRooms];
  while (padded.length < MIN_SLOTS) padded.push(null);

  const midPoint = Math.ceil(padded.length / 2);
  const wardRoomsRow1 = padded.slice(0, midPoint);
  const wardRoomsRow2 = padded.slice(midPoint);

  const checkRobotInRoom = (roomNum: string | null) => {
    if (!roomNum) return null;
    return robots.find(r => r.currentLocation?.includes(roomNum) && r.status !== 'Maintenance') || null;
  };

  function batteryColor(level: number) {
    if (level > 50) return '#10b981';
    if (level > 20) return '#f59e0b';
    return '#ef4444';
  }

  function statusStyle(status: string): React.CSSProperties {
    if (status === 'Active') return { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' };
    if (status === 'En route') return { background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' };
    if (status === 'Charging') return { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' };
    return { background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' };
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Live status across every ward, robot and patient.</p>
          {fetchError && <p style={{ color: "red", marginTop: "4px" }}>{fetchError} (Check terminal/Next.config CSP)</p>}
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-top"><span className="label">Amigo Robots Online</span>
            <div className="stat-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="8" width="16" height="12" rx="3"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></svg></div>
          </div>
          <div className="stat-value">{loading ? "..." : `${activeRobotsCount}/${robots.length}`}</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span className="label">Patients Monitored</span>
            <div className="stat-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 19c1-3.4 3.4-5 6-5s5 1.6 6 5"/></svg></div>
          </div>
          <div className="stat-value">{loading ? "..." : patients.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span className="label">Pending Dispenses</span>
            <div className="stat-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="10" width="16" height="7" rx="3.5" transform="rotate(-45 12 13.5)"/></svg></div>
          </div>
          <div className="stat-value">{loading ? "..." : pendingDeliveries}</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span className="label">Completed Deliveries</span>
            <div className="stat-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg></div>
          </div>
          <div className="stat-value">{loading ? "..." : completedDeliveries}</div>
        </div>
        <div className={`stat-card ${alerts.length > 0 ? 'alert' : ''}`}>
          <div className="stat-top"><span className="label">Active Alerts</span>
            <div className="stat-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/></svg></div>
          </div>
          <div className="stat-value" style={{ color: alerts.length > 0 ? '#f87171' : 'var(--ink)' }}>
            {loading ? "..." : `${alerts.length} ${alerts.length === 1 ? 'Alert' : 'Alerts'}`}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Facility Map &amp; Robot Status</h3>
            <select 
              className="select-mini" 
              value={selectedWard} 
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              {availableWards.length === 0 ? <option>Loading wards...</option> : availableWards.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div className="card-body">
            <div className="ward-label">{selectedWard || 'Ward'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[wardRoomsRow1, wardRoomsRow2].map((row, rowIdx) => (
                <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: `repeat(${row.length}, 1fr)`, gap: '10px' }}>
                  {row.map((roomNum, i) => {
                    const r = checkRobotInRoom(roomNum);
                    const isEmpty = roomNum === null;
                    return (
                      <div
                        key={roomNum ?? `empty-${rowIdx}-${i}`}
                        className={`room ${r ? 'robot-here' : ''}`}
                        style={isEmpty ? { opacity: 0.25, cursor: 'default', pointerEvents: 'none' } : { position: 'relative' }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{isEmpty ? '' : roomNum}</span>
                        {/* Robot tooltip — only visible on hover via CSS :hover on parent */}
                        {r && !isEmpty && (
                          <div className="robot-pop" style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 20,
                            pointerEvents: 'none',
                            opacity: 0,
                            transition: 'opacity 0.15s',
                          }} data-tooltip>
                            <div className="rline1">
                              <span className="rdot"></span>
                              {r.name}
                              <span style={{ ...statusStyle(r.status), padding: '1px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, marginLeft: 'auto' }}>{r.status}</span>
                            </div>
                            <div className="rline2">{r.currentLocation}</div>
                            <div className="batt">
                              <div className="batt-bar"><i style={{ width: `${r.batteryLevel}%`, background: batteryColor(r.batteryLevel) }}></i></div>
                              <span style={{ color: batteryColor(r.batteryLevel) }}>Battery {r.batteryLevel}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Live Robot Fleet (From DB)</h3></div>
          <table>
            <thead><tr><th>Robot Name</th><th>Location</th><th>Battery</th><th>Status</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}>Loading from Postgres...</td></tr>
              ) : robots.length === 0 ? (
                <tr><td colSpan={4} style={{ color: 'var(--ink-soft)', textAlign: 'center', padding: '20px' }}>No robots registered.</td></tr>
              ) : robots.map(robot => (
                <tr key={robot.id}>
                  <td><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{robot.name}</span></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{robot.currentLocation || '—'}</div>
                    <span className="cell-sub">{robot.ward?.name}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="batt-bar" style={{ width: '48px' }}>
                        <i style={{ width: `${robot.batteryLevel}%`, background: batteryColor(robot.batteryLevel) }}></i>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: batteryColor(robot.batteryLevel) }}>{robot.batteryLevel}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ ...statusStyle(robot.status), padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                      {robot.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2b">
        <div className="card">
          <div className="card-head"><h3>Upcoming Schedule (From DB)</h3><a className="view-all" onClick={() => router.push('/dashboard/deliveries')}>View all</a></div>
          <table>
            <thead><tr><th>Patient</th><th>Room</th><th>Medication</th><th>Time</th><th>Status</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}>Loading from Postgres...</td></tr>
              ) : deliveries.map(delivery => {
                const date = new Date(delivery.scheduledTime);
                return (
                  <tr key={delivery.id}>
                    <td>{delivery.patient?.firstName} {delivery.patient?.lastName}</td>
                    <td>{delivery.patient?.roomNumber}</td>
                    <td>{delivery.medicine?.name}</td>
                    <td>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><span className="cell-sub">{delivery.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-head"><h3>Active Patients (From DB)</h3><a className="view-all" onClick={() => router.push('/dashboard/patients')}>View all</a></div>
          <table>
            <thead><tr><th>Patient Name</th><th>Ward</th><th>Condition</th><th>Assigned Amigo</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}>Loading from Postgres...</td></tr>
              ) : patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.firstName} {patient.lastName}</td>
                  <td>{patient.ward?.name}</td>
                  <td>{patient.condition}</td>
                  <td>{patient.assignedRobot?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
