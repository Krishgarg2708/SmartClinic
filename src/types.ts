/**
 * SmartClinic - Enterprise Global TypeScript Definitions
 */

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  CLINIC_ADMIN = "CLINIC_ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  NURSE = "NURSE",
  PHARMACIST = "PHARMACIST",
  LAB_TECHNICIAN = "LAB_TECHNICIAN",
  ACCOUNTANT = "ACCOUNTANT",
  PATIENT = "PATIENT"
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  clinicId?: string; // Multi-tenant isolation key
  createdAt: string;
}

export interface Clinic {
  id: string;
  name: string;
  tagline?: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  gstNumber?: string;
  subscriptionPlan: "Free" | "Starter" | "Professional" | "Enterprise";
  subscriptionStatus: "Active" | "Suspended" | "Trial";
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface Patient {
  id: string;
  clinicId: string;
  patientId: string; // Printable clean text ID like SC-2026-0001
  qrCodeUrl?: string;
  photo?: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  dob: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  weight: number; // in kg
  height: number; // in cm
  bmi: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  allergies?: string[];
  medicalHistory?: string[];
  chronicDiseases?: string[];
  insuranceProvider?: string;
  insurancePolicyNum?: string;
  abhaNumber?: string; // India digital health record ABHA ID
  aadhaarNumber?: string;
  occupation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  clinicId: string;
  qualification: string;
  experience: number; // years
  registrationNumber: string;
  specialization: string;
  consultationFee: number;
  availability: {
    workingDays: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
    startTime: string; // e.g. "09:00"
    endTime: string; // e.g. "17:00"
    breakStartTime: string; // e.g. "13:00"
    breakEndTime: string; // e.g. "14:00"
  };
  languages: string[];
  rating: number;
  image?: string;
}

export enum AppointmentStatus {
  WAITING = "WAITING",
  CONSULTING = "CONSULTING",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
  CANCELLED = "CANCELLED"
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  tokenNumber: number;
  status: AppointmentStatus;
  type: "OPD" | "Telemedicine" | "Walk-In" | "Emergency";
  chiefComplaint: string;
  createdAt: string;
}

export interface Vitals {
  temperature?: number; // F
  pulse?: number; // bpm
  bloodPressureSys?: number; 
  bloodPressureDia?: number;
  sugarLevel?: number; // mg/dL
  sugarType?: "Fasting" | "PostPrandial" | "Random";
  oxygenSaturation?: number; // SpO2%
}

export interface EMR {
  id: string;
  clinicId: string;
  patientId: string;
  appointmentId?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  chiefComplaints: string;
  symptoms: string[];
  historyNotes?: string;
  vitals: Vitals;
  diagnosis: string;
  treatmentPlan: string;
  advice?: string;
  followUpDate?: string;
  digitalSignature?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: string;
}

export interface MedRoute {
  name: string;
  genericName?: string;
  dosage: string; // e.g., "500 mg"
  frequency: string; // e.g., "1-0-1", "Morning-Night"
  duration: string; // e.g., "5 days"
  instruction?: string; // e.g., "Take after meals"
}

export interface Prescription {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpec: string;
  doctorRegNum: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  medicines: MedRoute[];
  testsSuggested?: string[];
  advice?: string;
  followUpDate?: string;
  qrVerifyUrl?: string;
  createdAt: string;
}

export interface Medicine {
  id: string;
  clinicId: string;
  name: string;
  genericName: string;
  brand: string;
  manufacturer: string;
  category: "Tablet" | "Capsule" | "Syrup" | "Injection" | "Ointment" | "Drops" | "Other";
  dosageForm: string;
  strength: string; // e.g., "500mg"
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  batchNumber: string;
  expiryDate: string;
  rackNumber?: string;
  supplierId?: string;
  minimumStock: number;
  currentStock: number;
  maximumStock: number;
  notes?: string;
}

export interface Supplier {
  id: string;
  clinicId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber?: string;
  address: string;
  outstandingAmount: number;
}

export interface BillItem {
  id: string;
  name: string;
  type: "Consultation" | "Procedure" | "Medicine" | "LabTest" | "Radiology" | "Other";
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceId: string; // SC-INV-10024
  clinicId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  items: BillItem[];
  subTotal: number;
  discount: number;
  gst: number;
  roundOff: number;
  total: number;
  paidAmount: number;
  status: "Paid" | "Pending" | "Partial" | "Refunded" | "Cancelled";
  paymentMode: "Cash" | "UPI" | "Card" | "Net Banking" | "Cheque";
  createdAt: string;
}

export interface LabTest {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  testName: string;
  testCategory: "CBC" | "Sugar" | "Lipid Profile" | "LFT" | "KFT" | "Thyroid" | "Other";
  technicianId?: string;
  technicianName?: string;
  sampleCollectedDate?: string;
  results?: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    isAbnormal: boolean;
  }[];
  notes?: string;
  status: "Pending" | "Collected" | "Processing" | "Completed" | "Delivered";
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RadiologyRecord {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  type: "X-Ray" | "CT Scan" | "MRI" | "Ultrasound" | "ECG" | "ECHO";
  technicianNotes?: string;
  radiologistNotes?: string;
  imageUrl?: string;
  status: "Pending" | "Completed";
  date: string;
}

export interface Expense {
  id: string;
  clinicId: string;
  category: "Rent" | "Electricity" | "Internet" | "Salary" | "Equipment" | "Maintenance" | "Marketing" | "Miscellaneous";
  amount: number;
  date: string;
  description: string;
  billPdfUrl?: string;
}

export interface Staff {
  id: string;
  clinicId: string;
  name: string;
  role: UserRole;
  phone: string;
  email: string;
  joinDate: string;
  status: "Active" | "Inactive";
  salary: number;
  shiftHours?: string;
}

export interface Attendance {
  id: string;
  clinicId: string;
  staffId: string;
  staffName: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: "Present" | "Absent" | "Late" | "On Leave";
  notes?: string;
}

export interface AuditLog {
  id: string;
  clinicId: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}
