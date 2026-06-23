import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { 
  Activity, Users, CalendarDays, HeartPulse, IndianRupee, Pill, FlaskConical, Settings, 
  Sparkles, Menu, X, Clock, Play, Bell, ShieldCheck, Heart, User, Search
} from "lucide-react";

// Import custom components
import PatientsPanel from "./components/PatientsPanel";
import QueueCalendar from "./components/QueueCalendar";
import EMRAndPrescription from "./components/EMRAndPrescription";
import OPDCashier from "./components/OPDCashier";
import LogisticsInventory from "./components/LogisticsInventory";
import DiagnosticsIPD from "./components/DiagnosticsIPD";
import ManagementPanel from "./components/ManagementPanel";
import AIAssistant from "./components/AIAssistant";

// Import Seeding data
import { 
  SEED_CLINICS, SEED_DOCTORS, SEED_PATIENTS, SEED_APPOINTMENTS, 
  SEED_EMR, SEED_MEDICINES, SEED_SUPPLIERS, SEED_INVOICES, 
  SEED_LAB_TESTS, SEED_EXPENSES, SEED_STAFF 
} from "./constants/seedData";
import { 
  Patient, Doctor, Appointment, AppointmentStatus, Medicine, 
  Invoice, EMR, LabTest, Supplier, Expense, Staff 
} from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatIST = (date: Date) => {
    try {
      return date.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return date.toLocaleTimeString();
    }
  };

  // Core App states
  const [patients, setPatients] = useState<Patient[]>(SEED_PATIENTS);
  const [doctors] = useState<Doctor[]>(SEED_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(SEED_APPOINTMENTS);
  const [emrList, setEmrList] = useState<EMR[]>(SEED_EMR);
  const [medicines, setMedicines] = useState<Medicine[]>(SEED_MEDICINES);
  const [suppliers] = useState<Supplier[]>(SEED_SUPPLIERS);
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);
  const [labTests, setLabTests] = useState<LabTest[]>(SEED_LAB_TESTS);
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES);
  const [staff, setStaff] = useState<Staff[]>(SEED_STAFF);

  // Shared patient add callback
  const handleAddPatient = (newPat: Patient) => {
    setPatients([newPat, ...patients]);
  };

  const handleUpdatePatient = (id: string, updatedFields: Partial<Patient>) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...updatedFields } as Patient : p));
  };

  // Shared appointment add call
  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments([newApp, ...appointments]);
  };

  const handleUpdateAppStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
  };

  // Shared EMR compiles
  const handleAddEMR = (newEMR: EMR) => {
    setEmrList([newEMR, ...emrList]);
  };

  const handleAddPrescription = (newPresc: any) => {
    // Prescriptions are visual outputs processed inside EMR list logs
  };

  // Shared invoice receipts
  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices([newInv, ...invoices]);
  };

  const handleUpdateInvoiceStatus = (id: string, status: Invoice["status"]) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i));
  };

  // Shared stock adjustment
  const handleUpdateMedicineStock = (id: string, newStock: number) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, currentStock: newStock } : m));
  };

  const handleAddMedicineStock = (id: string, amount: number) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, currentStock: m.currentStock + amount } : m));
  };

  const handleAddMedicine = (newMed: Medicine) => {
    setMedicines([newMed, ...medicines]);
  };

  // Lab specimen actions
  const handleUpdateLabResults = (id: string, results: any[], notes: string) => {
    setLabTests(labTests.map(t => t.id === id ? { ...t, results, notes, status: "Completed" } : t));
  };

  const handleAddLabTest = (newLab: LabTest) => {
    setLabTests([newLab, ...labTests]);
  };

  // Admin Expense and Staff handlers
  const handleAddExpense = (newExp: Expense) => {
    setExpenses([newExp, ...expenses]);
  };

  const handleAddStaff = (newSt: Staff) => {
    setStaff([newSt, ...staff]);
  };

  // Derived dashboard analytics
  const paidInvoices = invoices.filter(i => i.status === "Paid");
  const grossCollectedRevenue = paidInvoices.reduce((acc, cur) => acc + cur.total, 0);
  const totalExpenditure = expenses.reduce((acc, cur) => acc + cur.amount, 0);
  const netEarnings = grossCollectedRevenue - totalExpenditure;

  const totalPatientsCount = patients.length;
  const activeWaitingList = appointments.filter(a => a.status === AppointmentStatus.WAITING).length;

  // Charting Data Mocks
  const revenueChartData = [
    { name: "June 14", revenue: 42000, expenses: 12000 },
    { name: "June 15", revenue: 51200, expenses: 15400 },
    { name: "June 16", revenue: 48900, expenses: 9800 },
    { name: "June 17", revenue: 62000, expenses: 22000 },
    { name: "June 18", revenue: 58000, expenses: 14000 },
    { name: "June 19", revenue: 71000, expenses: 16500 },
    { name: "June 20", revenue: grossCollectedRevenue, expenses: totalExpenditure }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" id="smartclinic-dashboard-master">
      
      {/* GLOBAL HIGH DENSITY HEADER SECTION */}
      <header className="bg-slate-950 border-b border-indigo-950/65 px-4 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-50 shrink-0">
        
        {/* Brand identity */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm tracking-wide shadow-indigo-600/20 shadow-md">
            SC
          </div>
          <div>
            <h1 className="font-extrabold text-[12px] sm:text-xs tracking-tight text-white uppercase uppercase">SmartClinic</h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">Apex Health Multi-speciality</p>
          </div>
        </div>

        {/* Global metrics header ticker */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-semibold border-l border-indigo-955 border-slate-800 pl-8">
          
          <div className="space-y-0.5">
            <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">Operational Balance sheet</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-205 text-slate-100 font-bold font-mono">₹{grossCollectedRevenue} Receipts</span>
              <span className="text-[9px] text-emerald-400">P&L Status Green</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">Clinical Queue Duty</span>
            <span className="text-slate-205 text-slate-100 font-mono">Dr. Vikram Aditya <span className="text-[9px] text-indigo-400 font-bold bg-indigo-950 px-1 rounded">Cardio</span></span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">SaaS Tier License</span>
            <span className="text-slate-100 font-bold block">Enterprise Unlimited Multi-Doctor</span>
          </div>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-2.5">
          
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-900 border border-slate-800 p-1 rounded-md px-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>IST {formatIST(currentTime)} (GMT+5:30)</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("ai-consultant")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] sm:text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-indigo-600/30' shadow shadow-indigo-650"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">SmartCopilot Core</span>
          </button>
        </div>
      </header>

      {/* CORE RUNTIME WORKSPACE GRID LAYOUT */}
      <div className="flex-grow flex min-h-0 relative">
        
        {/* SIDE BAR NAVIGATION TRAY */}
        <aside className={`w-[220px] bg-slate-950 border-r border-indigo-950/65 flex flex-col justify-between shrink-0 absolute md:relative inset-y-0 left-0 transform md:transform-none transition-transform duration-200 z-40 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
          
          {/* Nav List links */}
          <div className="p-3.5 space-y-5">
            
            <div className="space-y-1">
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest px-2.5">CLINIC CONSOLE</span>
              
              <nav className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg transition-all ${
                    activeTab === "dashboard" ? "bg-indigo-600 text-white font-bold" : "text-slate-350 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Activity className="w-4 h-4 shrink-0" /> Focus Dashboard
                </button>

                <button
                  onClick={() => { setActiveTab("patients"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg transition-all ${
                    activeTab === "patients" ? "bg-indigo-600 text-white font-bold" : "text-slate-350 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" /> Patients Directory
                </button>

                <button
                  onClick={() => { setActiveTab("appointments"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg transition-all ${
                    activeTab === "appointments" ? "bg-indigo-600 text-white font-bold" : "text-slate-350 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <CalendarDays className="w-4 h-4 shrink-0" /> Physicians Queue
                </button>

                <button
                  onClick={() => { setActiveTab("emr"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg transition-all ${
                    activeTab === "emr" ? "bg-indigo-600 text-white font-bold" : "text-slate-350 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <HeartPulse className="w-4 h-4 shrink-0" /> EMR & Prescription
                </button>
              </nav>
            </div>

            <div className="space-y-1">
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest px-2.5">OPERATIONAL DESK</span>
              
              <nav className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => { setActiveTab("billing"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg transition-all ${
                    activeTab === "billing" ? "bg-indigo-600 text-white font-bold" : "text-slate-350 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <IndianRupee className="w-4 h-4 shrink-0" /> Billing Cashier
                </button>

                <button
                  onClick={() => { setActiveTab("pharmacy"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg transition-all ${
                    activeTab === "pharmacy" ? "bg-indigo-600 text-white font-bold" : "text-slate-350 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Pill className="w-4 h-4 shrink-0" /> Stock & Pharmacy
                </button>

                <button
                  onClick={() => { setActiveTab("diagnostics"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg transition-all ${
                    activeTab === "diagnostics" ? "bg-indigo-600 text-white font-bold" : "text-slate-350 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <FlaskConical className="w-4 h-4 shrink-0" /> Lab & IPD Wards
                </button>
              </nav>
            </div>

            <div className="space-y-1">
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest px-2.5">ADMIN SETUP</span>
              
              <nav className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg transition-all ${
                    activeTab === "admin" ? "bg-indigo-600 text-white font-bold" : "text-slate-350 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" /> Shift & SaaS Management
                </button>
              </nav>
            </div>
          </div>

          {/* Quick Doctor on Call status card */}
          <div className="p-3.5 m-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <strong className="text-white">COSMIC ENCRYPTION</strong>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-slate-500 leading-relaxed font-medium">
              HIPAA Cryptographic keys verified. Access logs synced to Super Admin terminal securely.
            </p>
          </div>
        </aside>

        {/* CONTAINER WORKSPACE PANE */}
        <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-950 p-6 flex flex-col min-h-0">
          
          {activeTab === "dashboard" && (
            <div className="space-y-6 flex-grow flex flex-col" id="dashboard-tab-view">
              
              {/* Stat card row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">EHR Patient Files</span>
                    <strong className="text-xl font-black text-slate-850 block">{totalPatientsCount} Profiles</strong>
                    <span className="text-[9px] text-emerald-600 font-bold">↑ 100% cloud synced</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Waiting Triage Queue</span>
                    <strong className="text-xl font-black text-slate-850 block">{activeWaitingList} Patients</strong>
                    <span className="text-[9px] text-indigo-600 font-bold">Est Wait: 15 mins</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-650 text-emerald-600 shrink-0">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-505 text-slate-550 text-slate-500 font-bold block uppercase tracking-wider">Operational Invoiced Receipts</span>
                    <strong className="text-xl font-black text-slate-850 block">₹{grossCollectedRevenue}</strong>
                    <span className="text-[9px] text-emerald-600 font-bold">All modes integrated</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-650 text-rose-600 shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Pending Diagnostics</span>
                    <strong className="text-xl font-black text-slate-850 block">{labTests.filter(l => t => t.status === "Processing").length + 1} test orders</strong>
                    <span className="text-[9px] text-rose-600 font-bold">1 abnormal thyroid flagged</span>
                  </div>
                </div>
              </div>

              {/* Charting & Clinic Feed Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Ledger dynamic charts */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <h3 className="font-extrabold text-slate-850 text-xs mb-4 uppercase tracking-wider text-slate-400">Clinic receipts & Cash outlay trajectory</h3>
                  <div className="h-64 h-64 text-xs font-mono font-bold">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Receipts (₹)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Patient alerts / active bulletins */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider text-slate-400">Security Broadcast Bulletin</h3>
                  
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                      <div>
                        <strong>Govt ABHA Sandbox Sync live</strong>
                        <p className="text-[10px] text-slate-500 mt-0.5">EHR registry supports automatic insurance claim verifications via dynamic KYC.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                      <div>
                        <strong>Low Stock: Pan-D inventory Alert</strong>
                        <p className="text-[10px] text-slate-505 text-slate-500 mt-0.5">Capsule batch in pharmacy box is below safety limits. Vendor ordered initiated.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-150 border-slate-100 rounded-lg flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-600 mt-1.5 shrink-0"></span>
                      <div>
                        <strong>Weekly Shift compliance check complete</strong>
                        <p className="text-[10px] text-slate-505 text-slate-500 mt-0.5">Duty schedules match physician availability parameters perfettamente.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <PatientsPanel 
              patients={patients} 
              onAddPatient={handleAddPatient} 
              onDeletePatient={(id) => setPatients(patients.filter(p => p.id !== id))}
            />
          )}

          {activeTab === "appointments" && (
            <QueueCalendar 
              appointments={appointments} 
              patients={patients} 
              doctors={doctors}
              onAddAppointment={handleAddAppointment}
              onUpdateAppStatus={handleUpdateAppStatus}
            />
          )}

          {activeTab === "emr" && (
            <EMRAndPrescription 
              patients={patients}
              doctors={doctors}
              medicines={medicines}
              emrList={emrList}
              prescriptions={[]} // Prescriptions generated locally and printed inside EMR workspace
              onAddEMR={handleAddEMR}
              onAddPrescription={handleAddPrescription}
            />
          )}

          {activeTab === "billing" && (
            <OPDCashier 
              invoices={invoices}
              patients={patients}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            />
          )}

          {activeTab === "pharmacy" && (
            <LogisticsInventory 
              medicines={medicines}
              suppliers={suppliers}
              onUpdateMedicineStock={handleUpdateMedicineStock}
              onAddMedicineStock={handleAddMedicineStock}
              onAddMedicine={handleAddMedicine}
            />
          )}

          {activeTab === "diagnostics" && (
            <DiagnosticsIPD 
              patients={patients}
              labTests={labTests}
              onUpdateLabResults={handleUpdateLabResults}
              onAddLabTest={handleAddLabTest}
            />
          )}

          {activeTab === "admin" && (
            <ManagementPanel 
              staffList={staff}
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onAddStaff={handleAddStaff}
            />
          )}

          {activeTab === "ai-consultant" && (
            <AIAssistant 
              currentClinicId="clinic-1"
              patients={patients}
              appointments={appointments}
              medicines={medicines}
            />
          )}

        </main>
      </div>
    </div>
  );
}
