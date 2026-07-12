import { supabase } from "@/lib/supabase";

const API_BASE = "/api/proxy";

// This function is the SINGLE gateway for ALL API calls.
// Before every request, it grabs the user's JWT from Supabase
// and attaches it as an "Authorization: Bearer <token>" header.
// The .NET backend reads this header and verifies the token.
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Get the current session from Supabase (stored in localStorage)
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // If we have a token, attach it. If not, the backend will return 401.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  // Handle 204 No Content (for DELETE responses)
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Robots
  getRobots: () => apiFetch<any[]>("/robots"),
  getRobot: (id: number) => apiFetch<any>(`/robots/${id}`),
  createRobot: (data: any) => apiFetch<any>("/robots", { method: "POST", body: JSON.stringify(data) }),
  updateRobot: (id: number, data: any) => apiFetch<any>(`/robots/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteRobot: (id: number) => apiFetch<void>(`/robots/${id}`, { method: "DELETE" }),

  // Patients
  getPatients: () => apiFetch<any[]>("/patients"),
  createPatient: (data: any) => apiFetch<any>("/patients", { method: "POST", body: JSON.stringify(data) }),
  updatePatient: (id: number, data: any) => apiFetch<any>(`/patients/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePatient: (id: number) => apiFetch<void>(`/patients/${id}`, { method: "DELETE" }),

  // Deliveries
  getDeliveries: () => apiFetch<any[]>("/deliveries"),
  createDelivery: (data: any) => apiFetch<any>("/deliveries", { method: "POST", body: JSON.stringify(data) }),
  updateDeliveryStatus: (id: number, status: string) => apiFetch<any>(`/deliveries/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Alerts
  getAlerts: () => apiFetch<any[]>("/alerts"),
  getActiveAlerts: () => apiFetch<any[]>("/alerts?active=true"),
  resolveAlert: (id: number) => apiFetch<any>(`/alerts/${id}/resolve`, { method: "PATCH" }),

  // Users
  getUsers: () => apiFetch<any[]>("/users"),
  createUser: (data: any) => apiFetch<any>("/users", { method: "POST", body: JSON.stringify(data) }),
  deleteUser: (id: number) => apiFetch<void>(`/users/${id}`, { method: "DELETE" }),

  // Wards
  getWards: () => apiFetch<any[]>("/wards"),

  // Audit logs (read-only, assembled from data)
  getAuditLogs: () => apiFetch<any[]>("/audit"),
};
