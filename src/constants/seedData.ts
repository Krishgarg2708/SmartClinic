import { Patient, Doctor, Appointment, AppointmentStatus, Medicine, Invoice, EMR, LabTest, Supplier, Expense, Staff, Attendance, Clinic, UserRole } from "../types";

export const SEED_CLINICS: Clinic[] = [
  {
    id: "clinic-1",
    name: "Apex Healthcare & Diagnostic Center",
    tagline: "Comprehensive Multi-Speciality Clinic & Laboratory",
    logo: "",
    address: "Metro Tower, Suite 402, Ring Road, Sector 5",
    phone: "+91 98765 43210",
    email: "contact@apexhealth.com",
    gstNumber: "07AAAAA1111A1Z1",
    subscriptionPlan: "Professional",
    subscriptionStatus: "Active",
    status: "Active",
    createdAt: "2026-01-10T08:00:00.000Z"
  }
];

export const SEED_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Vikram Aditya",
    clinicId: "clinic-1",
    qualification: "MBBS, MD (Medicine), DM (Cardiology)",
    experience: 16,
    registrationNumber: "MCI-48902",
    specialization: "Cardiology & General Medicine",
    consultationFee: 600,
    availability: {
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      startTime: "09:00",
      endTime: "17:00",
      breakStartTime: "13:00",
      breakEndTime: "14:00"
    },
    languages: ["English", "Hindi", "Punjabi"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "doc-2",
    name: "Dr. Anjali Sharma",
    clinicId: "clinic-1",
    qualification: "MBBS, DGO, MS (Gynecology)",
    experience: 12,
    registrationNumber: "MCI-52110",
    specialization: "Gynecology & Obstetrics",
    consultationFee: 500,
    availability: {
      workingDays: ["Mon", "Wed", "Fri"],
      startTime: "10:00",
      endTime: "16:00",
      breakStartTime: "13:00",
      breakEndTime: "13:30"
    },
    languages: ["English", "Hindi", "Bengali"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "doc-3",
    name: "Dr. Kabir Mehra",
    clinicId: "clinic-1",
    qualification: "MBBS, MD (Pediatrics), Fellow in Pediatric Nutrition",
    experience: 8,
    registrationNumber: "MCI-61044",
    specialization: "Pediatrics & Neonatal Care",
    consultationFee: 450,
    availability: {
      workingDays: ["Tue", "Thu", "Sat"],
      startTime: "09:00",
      endTime: "13:00",
      breakStartTime: "11:00",
      breakEndTime: "11:15"
    },
    languages: ["English", "Hindi"],
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"
  }
];

export const SEED_PATIENTS: Patient[] = [
  {
    id: "pat-1",
    clinicId: "clinic-1",
    patientId: "SC-2026-0001",
    name: "Rajesh Kumar",
    age: 48,
    gender: "Male",
    dob: "1978-04-12",
    phone: "9812345678",
    email: "rajesh.kumar@gmail.com",
    address: "H.No. 421, Phase 2, Green Park Colony, Delhi",
    bloodGroup: "O+",
    weight: 78,
    height: 172,
    bmi: 26.4,
    emergencyContact: {
      name: "Suman Kumar",
      phone: "9812345679",
      relation: "Spouse"
    },
    allergies: ["Penicillin", "Dust Mites"],
    medicalHistory: ["Hypertension diagnosed in 2021", "Appendectomy 2018"],
    chronicDiseases: ["Hypertension", "Type 2 Diabetes"],
    insuranceProvider: "Star Health Insurance",
    insurancePolicyNum: "SHI-88012023",
    abhaNumber: "12-4045-8812-3490",
    aadhaarNumber: "891234567890",
    occupation: "Business Owner",
    notes: "Patient prefers evening appointments. Monitor blood pressure closely during consultation.",
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-06-18T14:30:00.000Z"
  },
  {
    id: "pat-2",
    clinicId: "clinic-1",
    patientId: "SC-2026-0002",
    name: "Sunita Devi",
    age: 34,
    gender: "Female",
    dob: "1992-09-22",
    phone: "9345678901",
    email: "sunita.devi@outlook.com",
    address: "Apt B-302, Royal Residency, Sector 12",
    bloodGroup: "B+",
    weight: 62,
    height: 158,
    bmi: 24.8,
    emergencyContact: {
      name: "Ramesh Devi",
      phone: "9345678902",
      relation: "Husband"
    },
    allergies: ["Sulfa Drugs"],
    medicalHistory: ["G1P1, Caesarean section in 2022"],
    chronicDiseases: [],
    insuranceProvider: "HDFC Ergo",
    insurancePolicyNum: "HDFC-441209B",
    abhaNumber: "34-9981-2200-1123",
    aadhaarNumber: "776655443322",
    occupation: "Teacher",
    notes: "Complaining of consistent fatigue and mild thyroid symptoms. Thyroid test pending.",
    createdAt: "2026-03-01T11:15:00.000Z",
    updatedAt: "2026-06-10T10:00:00.000Z"
  },
  {
    id: "pat-3",
    clinicId: "clinic-1",
    patientId: "SC-2026-0003",
    name: "Aarav Sharma",
    age: 6,
    gender: "Male",
    dob: "2020-03-15",
    phone: "9123456789",
    email: "parent.sharma@yahoo.com",
    address: "Flat 10A, Heights Tower, Ring Road",
    bloodGroup: "AB+",
    weight: 20,
    height: 110,
    bmi: 16.5,
    emergencyContact: {
      name: "Sanjay Sharma",
      phone: "9123456780",
      relation: "Father"
    },
    allergies: ["Peanuts", "Shellfish"],
    medicalHistory: ["Frequent asthma flare-ups"],
    chronicDiseases: ["Pediatric Asthma"],
    createdAt: "2026-04-10T09:30:00.000Z",
    updatedAt: "2026-06-19T11:00:00.000Z"
  }
];

export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: "app-1",
    clinicId: "clinic-1",
    patientId: "pat-1",
    patientName: "Rajesh Kumar",
    patientPhone: "9812345678",
    doctorId: "doc-1",
    doctorName: "Dr. Vikram Aditya",
    date: "2026-06-20",
    timeSlot: "09:30 - 09:45",
    tokenNumber: 101,
    status: AppointmentStatus.WAITING,
    type: "Walk-In",
    chiefComplaint: "Routine hypertension evaluation and glucose checkup",
    createdAt: "2026-06-20T08:15:00.000Z"
  },
  {
    id: "app-2",
    clinicId: "clinic-1",
    patientId: "pat-2",
    patientName: "Sunita Devi",
    patientPhone: "9345678901",
    doctorId: "doc-2",
    doctorName: "Dr. Anjali Sharma",
    date: "2026-06-20",
    timeSlot: "10:15 - 10:30",
    tokenNumber: 102,
    status: AppointmentStatus.CONSULTING,
    type: "OPD",
    chiefComplaint: "Persistent lower abdominal pain, general lethargy",
    createdAt: "2026-06-20T08:30:00.000Z"
  },
  {
    id: "app-3",
    clinicId: "clinic-1",
    patientId: "pat-3",
    patientName: "Aarav Sharma",
    patientPhone: "9123456789",
    doctorId: "doc-3",
    doctorName: "Dr. Kabir Mehra",
    date: "2026-06-20",
    timeSlot: "11:00 - 11:15",
    tokenNumber: 103,
    status: AppointmentStatus.COMPLETED,
    type: "OPD",
    chiefComplaint: "Mild allergic cough and wheezing evaluation",
    createdAt: "2026-06-19T15:20:00.000Z"
  }
];

export const SEED_EMR: EMR[] = [
  {
    id: "emr-1",
    clinicId: "clinic-1",
    patientId: "pat-1",
    appointmentId: "app-3",
    doctorId: "doc-1",
    doctorName: "Dr. Vikram Aditya",
    date: "2026-05-18",
    chiefComplaints: "Headache, dizziness, palpitations for 3 days.",
    symptoms: ["Headache", "Bilateral Throb", "Mild Dizziness"],
    historyNotes: "Chronic hypertensioin patient, on Telmisartan 40mg. Medication compliance was irregular recently.",
    vitals: {
      temperature: 98.4,
      pulse: 88,
      bloodPressureSys: 155,
      bloodPressureDia: 98,
      sugarLevel: 145,
      sugarType: "Random"
    },
    diagnosis: "Uncontrolled Hypertension with Mild Hyperglycemia",
    treatmentPlan: "Telmisartan 40mg increased to double dose (Telmisartan 40 + Amlodipine 5mg). Retake BP log daily.",
    advice: "Avoid high sodium intake, walk 30 minutes daily and log morning vitals. Drink plenty of water.",
    followUpDate: "2026-06-20",
    digitalSignature: "Dr. Vikram Aditya, MD",
    createdAt: "2026-05-18T10:30:00.000Z"
  }
];

export const SEED_MEDICINES: Medicine[] = [
  {
    id: "med-1",
    clinicId: "clinic-1",
    name: "Telma-AM",
    genericName: "Telmisartan 40mg + Amlodipine 5mg",
    brand: "Glenmark Pharmaceuticals",
    manufacturer: "Glenmark",
    category: "Tablet",
    dosageForm: "Tablet",
    strength: "45mg",
    purchasePrice: 120,
    sellingPrice: 165,
    mrp: 180,
    batchNumber: "TA-99014",
    expiryDate: "2027-08-30",
    rackNumber: "A-12",
    minimumStock: 100,
    currentStock: 480,
    maximumStock: 1000,
    notes: "Store in a cool dry place. Keep away from light."
  },
  {
    id: "med-2",
    clinicId: "clinic-1",
    name: "Pan-D",
    genericName: "Pantoprazole 40mg + Domperidone 30mg SR",
    brand: "Alkem Laboratories",
    manufacturer: "Alkem",
    category: "Capsule",
    dosageForm: "Sustained Release Capsule",
    strength: "70mg",
    purchasePrice: 90,
    sellingPrice: 125,
    mrp: 140,
    batchNumber: "PD-4412",
    expiryDate: "2027-03-15",
    rackNumber: "B-03",
    minimumStock: 200,
    currentStock: 35, // Trigger low stock alert!
    maximumStock: 800,
    notes: "Antacid. Take on an empty stomach."
  },
  {
    id: "med-3",
    clinicId: "clinic-1",
    name: "Amoxyclav 625 Duo",
    genericName: "Amoxicillin 500mg + Clavulanic Acid 125mg",
    brand: "Abbott Healthcare",
    manufacturer: "Abbott",
    category: "Tablet",
    dosageForm: "Film-coated Tablet",
    strength: "625mg",
    purchasePrice: 150,
    sellingPrice: 210,
    mrp: 235,
    batchNumber: "AX-8840",
    expiryDate: "2026-11-20",
    rackNumber: "A-01",
    minimumStock: 150,
    currentStock: 450,
    maximumStock: 1000,
    notes: "Antibiotic. Take with food."
  },
  {
    id: "med-4",
    clinicId: "clinic-1",
    name: "Montair-LC",
    genericName: "Montelukast Sodium 10mg + Levocetirizine Dihydrochloride 5mg",
    brand: "Cipla Ltd",
    manufacturer: "Cipla",
    category: "Tablet",
    dosageForm: "Tablet",
    strength: "15mg",
    purchasePrice: 85,
    sellingPrice: 130,
    mrp: 150,
    batchNumber: "ML-321",
    expiryDate: "2026-07-28", // Close to expiry!
    rackNumber: "C-08",
    minimumStock: 120,
    currentStock: 240,
    maximumStock: 600,
    notes: "Anthihistaminic and bronchodilator combo."
  }
];

export const SEED_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    clinicId: "clinic-1",
    companyName: "Vardhman Surgical & Pharma Distributors",
    contactPerson: "Navdeep Jain",
    phone: "9834512345",
    email: "orders@vardhmanpharma.com",
    gstNumber: "07AAACV9912C2Z5",
    address: "Block G-3, Sector 8, Rohini, New Delhi",
    outstandingAmount: 18500
  },
  {
    id: "sup-2",
    clinicId: "clinic-1",
    companyName: "Rohan Medicals Logistics",
    contactPerson: "Rohan Verma",
    phone: "9456123450",
    email: "rohanmedicals@outlook.com",
    gstNumber: "07AAACR1212B2Z1",
    address: "Shop No. 12, Main Market Road, Delhi",
    outstandingAmount: 4300
  }
];

export const SEED_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceId: "SC-INV-10021",
    clinicId: "clinic-1",
    patientId: "pat-1",
    patientName: "Rajesh Kumar",
    patientPhone: "9812345678",
    date: "2026-06-18",
    items: [
      { id: "item-1", name: "Cardiology Specialist Consultation", type: "Consultation", quantity: 1, unitPrice: 600, totalPrice: 600 },
      { id: "item-2", name: "ECG Test Charge", type: "Procedure", quantity: 1, unitPrice: 350, totalPrice: 350 },
      { id: "item-3", name: "Telma-AM (Qty 30 tabs)", type: "Medicine", quantity: 3, unitPrice: 165, totalPrice: 495 }
    ],
    subTotal: 1445,
    discount: 100,
    gst: 72.25,
    roundOff: 2.75,
    total: 1420,
    paidAmount: 1420,
    status: "Paid",
    paymentMode: "UPI",
    createdAt: "2026-06-18T11:45:00.000Z"
  },
  {
    id: "inv-2",
    invoiceId: "SC-INV-10022",
    clinicId: "clinic-1",
    patientId: "pat-2",
    patientName: "Sunita Devi",
    patientPhone: "9345678901",
    date: "2026-06-19",
    items: [
      { id: "item-1", name: "Gynecology Consultation", type: "Consultation", quantity: 1, unitPrice: 500, totalPrice: 500 },
      { id: "item-2", name: "Comprehensive Thyroid Profile (T3, T4, TSH)", type: "LabTest", quantity: 1, unitPrice: 850, totalPrice: 850 }
    ],
    subTotal: 1350,
    discount: 0,
    gst: 0,
    roundOff: 0,
    total: 1350,
    paidAmount: 0,
    status: "Pending",
    paymentMode: "Cash",
    createdAt: "2026-06-19T13:10:00.000Z"
  }
];

export const SEED_LAB_TESTS: LabTest[] = [
  {
    id: "test-1",
    clinicId: "clinic-1",
    patientId: "pat-2",
    patientName: "Sunita Devi",
    testName: "Thyroid Profile (Total T3, Total T4, TSH Ultra)",
    testCategory: "Thyroid",
    technicianId: "staff-3",
    technicianName: "Deepak Rawat",
    sampleCollectedDate: "2026-06-19",
    results: [
      { parameter: "Total Triiodothyronine (T3)", value: "1.25", unit: "ng/mL", normalRange: "0.8 - 2.0 ng/mL", isAbnormal: false },
      { parameter: "Total Thyroxine (T4)", value: "7.8", unit: "ug/dL", normalRange: "5.1 - 14.1 ug/dL", isAbnormal: false },
      { parameter: "Thyroid Stimulating Hormone (TSH)", value: "5.82", unit: "uIU/mL", normalRange: "0.4 - 4.2 uIU/mL", isAbnormal: true } // Thyroid levels high (hypothyroidism indicator)
    ],
    notes: "TSH level indicates mild subclinical hypothyroidism. Advised validation with anti-TPO antibodies.",
    status: "Completed",
    createdAt: "2026-06-19T10:00:00.000Z",
    updatedAt: "2026-06-20T09:00:00.000Z"
  }
];

export const SEED_EXPENSES: Expense[] = [
  { id: "exp-1", clinicId: "clinic-1", category: "Rent", amount: 25000, date: "2026-06-05", description: "Monthly Clinic Premise Rent (Suite 402)" },
  { id: "exp-2", clinicId: "clinic-1", category: "Electricity", amount: 7850, date: "2026-06-08", description: "State power grid residential commercial utility bill" },
  { id: "exp-3", clinicId: "clinic-1", category: "Internet", amount: 1200, date: "2026-06-10", description: "Airtel Fiber Broadband 200Mbps business plan" }
];

export const SEED_STAFF: Staff[] = [
  { id: "staff-1", clinicId: "clinic-1", name: "Suresh Gupta", role: UserRole.RECEPTIONIST, phone: "9812233445", email: "suresh@apexhealth.com", joinDate: "2026-01-12", status: "Active", salary: 18000, shiftHours: "08:30 - 17:30" },
  { id: "staff-2", clinicId: "clinic-1", name: "Meera Nair", role: UserRole.NURSE, phone: "9561122334", email: "meera@apexhealth.com", joinDate: "2026-02-01", status: "Active", salary: 22000, shiftHours: "09:00 - 17:00" },
  { id: "staff-3", clinicId: "clinic-1", name: "Deepak Rawat", role: UserRole.LAB_TECHNICIAN, phone: "9900112233", email: "deepak@apexhealth.com", joinDate: "2026-02-15", status: "Active", salary: 25000, shiftHours: "09:00 - 18:00" }
];
