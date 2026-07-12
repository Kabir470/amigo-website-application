export type UserRole = "admin" | "nurse";

// Lightweight timestamp compatible with both Firebase Timestamps and plain objects
export interface TimestampLike {
  toDate: () => Date;
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: TimestampLike;
}

export interface Patient {
  id: string;
  name: string;
  bedId: string;
  rfidTagId: string;
  allergies: string;
  notes: string;
  createdAt: TimestampLike;
}

export interface Bed {
  id: string;
  bedNumber: string;
  ward: string;
  rfidReaderId: string;
  currentPatientId: string;
}

export type RobotStatus = "online" | "offline" | "paused" | "returning";

export interface Robot {
  id: string;
  name: string;
  ward: string;
  status: RobotStatus;
  batteryLevel: number;
  lastHeartbeat: TimestampLike;
  currentRoute: string;
  configVersion: string;
  speed: number;
  sensorThreshold: number;
}

export interface MedicineSchedule {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  timeSlots: string[];
  active: boolean;
}

export type DeliveryStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "missed"
  | "failed";

export interface Delivery {
  id: string;
  patientId: string;
  patientName?: string;
  bedId: string;
  robotId: string;
  scheduleId: string;
  status: DeliveryStatus;
  scannedAt: TimestampLike | null;
  completedAt: TimestampLike | null;
  notes: string;
}

export type ScanResult = "matched" | "unmatched" | "unknown";

export interface ScanEvent {
  id: string;
  robotId: string;
  bedId: string;
  rfidTagId: string;
  matchedPatientId: string;
  result: ScanResult;
  timestamp: TimestampLike;
}

export type AlertType =
  | "missed_delivery"
  | "rfid_unknown"
  | "rfid_mismatch"
  | "robot_offline"
  | "low_battery"
  | "failed_login";

export interface Alert {
  id: string;
  type: AlertType;
  robotId?: string;
  bedId?: string;
  patientId?: string;
  message: string;
  resolved: boolean;
  createdAt: TimestampLike;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  targetId: string;
  details: string;
  timestamp: TimestampLike;
}
