// Static mock data for demo mode (no Firebase required)
import { Patient, Bed, Robot, Delivery, Alert, AuditLog, AppUser, MedicineSchedule, ScanEvent } from "@/types";

const past = (minAgo: number) => ({ toDate: () => new Date(Date.now() - minAgo * 60000) });

export const mockUsers: AppUser[] = [
  { uid: "admin-001", name: "Dr. Sarah Chen", email: "sarah.chen@hospital.com", role: "admin", createdAt: past(10000) },
  { uid: "nurse-001", name: "Nurse James Wong", email: "james.wong@hospital.com", role: "nurse", createdAt: past(5000) },
  { uid: "nurse-002", name: "Nurse Priya Patel", email: "priya.patel@hospital.com", role: "nurse", createdAt: past(3000) },
  { uid: "admin-002", name: "Dr. Michael Torres", email: "m.torres@hospital.com", role: "admin", createdAt: past(8000) },
];

export const currentUser: AppUser = mockUsers[0];

export const mockBeds: Bed[] = [
  { id: "bed-001", bedNumber: "A-101", ward: "Ward 3A", rfidReaderId: "READER-001", currentPatientId: "pat-001" },
  { id: "bed-002", bedNumber: "A-102", ward: "Ward 3A", rfidReaderId: "READER-002", currentPatientId: "pat-002" },
  { id: "bed-003", bedNumber: "A-103", ward: "Ward 3A", rfidReaderId: "READER-003", currentPatientId: "pat-003" },
  { id: "bed-004", bedNumber: "B-201", ward: "Ward 3B", rfidReaderId: "READER-004", currentPatientId: "pat-004" },
  { id: "bed-005", bedNumber: "B-202", ward: "Ward 3B", rfidReaderId: "READER-005", currentPatientId: "" },
  { id: "bed-006", bedNumber: "B-203", ward: "Ward 3B", rfidReaderId: "READER-006", currentPatientId: "pat-005" },
];

export const mockPatients: Patient[] = [
  { id: "pat-001", name: "John Hartwell", bedId: "bed-001", rfidTagId: "TAG-A101", allergies: "Penicillin", notes: "Diabetic — check blood sugar before meals", createdAt: past(2000) },
  { id: "pat-002", name: "Maria Gonzalez", bedId: "bed-002", rfidTagId: "TAG-A102", allergies: "Aspirin, Sulfa drugs", notes: "Post-surgery recovery", createdAt: past(1500) },
  { id: "pat-003", name: "Robert Kim", bedId: "bed-003", rfidTagId: "TAG-A103", allergies: "None known", notes: "Hypertension management", createdAt: past(1200) },
  { id: "pat-004", name: "Amara Osei", bedId: "bed-004", rfidTagId: "TAG-B201", allergies: "Latex, Ibuprofen", notes: "Requires wheelchair assistance", createdAt: past(900) },
  { id: "pat-005", name: "Linda Park", bedId: "bed-006", rfidTagId: "TAG-B203", allergies: "None", notes: "Scheduled for discharge tomorrow", createdAt: past(600) },
];

export const mockRobots: Robot[] = [
  { id: "robot-001", name: "AMIGO-01", ward: "Ward 3A", status: "online", batteryLevel: 78, lastHeartbeat: past(2), currentRoute: "Route-A", configVersion: "2.1.4", speed: 22, sensorThreshold: 480 },
  { id: "robot-002", name: "AMIGO-02", ward: "Ward 3B", status: "paused", batteryLevel: 34, lastHeartbeat: past(8), currentRoute: "Route-B", configVersion: "2.1.3", speed: 18, sensorThreshold: 500 },
];

export const mockDeliveries: Delivery[] = [
  { id: "del-001", patientId: "pat-001", patientName: "John Hartwell", bedId: "bed-001", robotId: "robot-001", scheduleId: "sch-001", status: "completed", scannedAt: past(45), completedAt: past(43), notes: "" },
  { id: "del-002", patientId: "pat-002", patientName: "Maria Gonzalez", bedId: "bed-002", robotId: "robot-001", scheduleId: "sch-002", status: "completed", scannedAt: past(38), completedAt: past(36), notes: "" },
  { id: "del-003", patientId: "pat-003", patientName: "Robert Kim", bedId: "bed-003", robotId: "robot-001", scheduleId: "sch-003", status: "in-progress", scannedAt: past(5), completedAt: null, notes: "" },
  { id: "del-004", patientId: "pat-004", patientName: "Amara Osei", bedId: "bed-004", robotId: "robot-002", scheduleId: "sch-004", status: "pending", scannedAt: null, completedAt: null, notes: "" },
  { id: "del-005", patientId: "pat-005", patientName: "Linda Park", bedId: "bed-006", robotId: "robot-002", scheduleId: "sch-005", status: "pending", scannedAt: null, completedAt: null, notes: "" },
  { id: "del-006", patientId: "pat-001", patientName: "John Hartwell", bedId: "bed-001", robotId: "robot-001", scheduleId: "sch-001", status: "missed", scannedAt: past(120), completedAt: null, notes: "Robot returned to base before scan" },
  { id: "del-007", patientId: "pat-002", patientName: "Maria Gonzalez", bedId: "bed-002", robotId: "robot-001", scheduleId: "sch-002", status: "failed", scannedAt: past(90), completedAt: null, notes: "Compartment sensor error" },
];

export const mockAlerts: Alert[] = [
  { id: "alert-001", type: "rfid_mismatch", robotId: "robot-001", bedId: "bed-003", patientId: "pat-002", message: "Tag mismatch: Maria Gonzalez scanned at bed A-103 — expected A-102", resolved: false, createdAt: past(12) },
  { id: "alert-002", type: "low_battery", robotId: "robot-002", message: "AMIGO-02 battery critical: 34% — schedule recharge soon", resolved: false, createdAt: past(20) },
  { id: "alert-003", type: "missed_delivery", bedId: "bed-001", patientId: "pat-001", message: "Missed 08:00 dose for John Hartwell (Bed A-101)", resolved: false, createdAt: past(60) },
  { id: "alert-004", type: "robot_offline", robotId: "robot-002", message: "AMIGO-02 has been unreachable for 8 minutes", resolved: true, createdAt: past(90) },
  { id: "alert-005", type: "rfid_unknown", robotId: "robot-001", bedId: "bed-005", message: "Unknown RFID tag scanned: TAG-UNKNOWN at bed B-202 (no patient registered)", resolved: true, createdAt: past(180) },
];

export const mockAuditLogs: AuditLog[] = [
  { id: "log-001", userId: "admin-001", userName: "Dr. Sarah Chen", action: "robot_command:pause", targetId: "robot-002", details: "Manual command: pause sent to AMIGO-02", timestamp: past(25) },
  { id: "log-002", userId: "admin-001", userName: "Dr. Sarah Chen", action: "robot_config_update", targetId: "robot-001", details: "Speed: 22, Sensor threshold: 480", timestamp: past(60) },
  { id: "log-003", userId: "admin-001", userName: "Dr. Sarah Chen", action: "user_created", targetId: "nurse-002", details: "Created nurse account for Priya Patel (priya.patel@hospital.com)", timestamp: past(120) },
  { id: "log-004", userId: "admin-002", userName: "Dr. Michael Torres", action: "delivery_status:completed", targetId: "del-006", details: "Manually marked delivery as completed. Notes: Nurse administered manually", timestamp: past(150) },
  { id: "log-005", userId: "admin-001", userName: "Dr. Sarah Chen", action: "robot_command:resume", targetId: "robot-001", details: "Manual command: resume sent to AMIGO-01", timestamp: past(200) },
  { id: "log-006", userId: "admin-002", userName: "Dr. Michael Torres", action: "user_deleted", targetId: "nurse-old-001", details: "Deleted user nurse-old-001", timestamp: past(400) },
  { id: "log-007", userId: "admin-001", userName: "Dr. Sarah Chen", action: "patient_created", targetId: "pat-005", details: "Added patient: Linda Park, Bed B-203, Tag TAG-B203", timestamp: past(600) },
];

export const mockSchedules: MedicineSchedule[] = [
  { id: "sch-001", patientId: "pat-001", medicineName: "Metformin 500mg", dosage: "1 tablet", timeSlots: ["08:00", "14:00", "20:00"], active: true },
  { id: "sch-002", patientId: "pat-002", medicineName: "Amoxicillin 250mg", dosage: "1 capsule", timeSlots: ["09:00", "21:00"], active: true },
  { id: "sch-003", patientId: "pat-003", medicineName: "Amlodipine 5mg", dosage: "1 tablet", timeSlots: ["08:00"], active: true },
  { id: "sch-004", patientId: "pat-004", medicineName: "Ibuprofen 400mg", dosage: "1 tablet", timeSlots: ["08:00", "16:00"], active: true },
  { id: "sch-005", patientId: "pat-005", medicineName: "Atorvastatin 20mg", dosage: "1 tablet", timeSlots: ["22:00"], active: true },
];

export const mockScanEvents: ScanEvent[] = [
  { id: "scan-001", robotId: "robot-001", bedId: "bed-001", rfidTagId: "TAG-A101", matchedPatientId: "pat-001", result: "matched", timestamp: past(45) },
  { id: "scan-002", robotId: "robot-001", bedId: "bed-002", rfidTagId: "TAG-A102", matchedPatientId: "pat-002", result: "matched", timestamp: past(38) },
  { id: "scan-003", robotId: "robot-001", bedId: "bed-003", rfidTagId: "TAG-A102", matchedPatientId: "pat-002", result: "unmatched", timestamp: past(12) },
  { id: "scan-004", robotId: "robot-001", bedId: "bed-005", rfidTagId: "TAG-UNKNOWN", matchedPatientId: "", result: "unknown", timestamp: past(180) },
];
