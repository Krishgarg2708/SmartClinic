import React, { useState } from "react";
import { 
  Settings, Users, ShieldAlert, Award, FileText, CheckCircle, 
  Trash2, RefreshCw, Layers, ShieldCheck, Briefcase, Plus, TrendingUp, AlertTriangle
} from "lucide-react";
import { Staff, Clinic, Expense, AuditLog, UserRole } from "../types";

interface ManagementPanelProps {
  staffList: Staff[];
  expenses: Expense[];
  onAddExpense: (exp: Expense) => void;
  onAddStaff: (st: Staff) => void;
}

export default function ManagementPanel({ staffList, expenses, onAddExpense, onAddStaff }: ManagementPanelProps) {
  const [activeTab, setActiveTab] = useState<"staff" | "finance" | "saas" | "audit">("staff");

  // Expense form states
  const [expCategory, setExpCategory] = useState<Expense["category"]>("Equipment");
  const [expAmount, setExpAmount] = useState(1200);
  const [expDesc, setExpDesc] = useState("Utility disposables and needles delivery");

  // New staff states
  const [stName, setStName] = useState("");
  const [stRole, setStRole] = useState<UserRole>(UserRole.NURSE);
  const [stPhone, setStPhone] = useState("");
  const [stEmail, setStEmail] = useState("");
  const [stSalary, setStSalary] = useState(25000);

  // SaaS Mock global clinics
  const [saasClinics, setSaasClinics] = useState<Clinic[]>([
    {
      id: "clinic-1",
      name: "Apex Healthcare & Diagnostic Center",
      address: "Metro Tower Sect 5",
      phone: "+91 98765 43210",
      email: "contact@apex.com",
      subscriptionPlan: "Professional",
      subscriptionStatus: "Active",
      status: "Active",
      createdAt: "2026-01-10T08:00:00.000Z"
    },
    {
      id: "clinic-2",
      name: "St. Marys Pediatric Clinic",
      address: "Sector 12, Heights Road",
      phone: "+91 98112 00223",
      email: "contact@stmarys.com",
      subscriptionPlan: "Enterprise",
      subscriptionStatus: "Active",
      status: "Active",
      createdAt: "2026-03-12T09:12:00.000Z"
    },
    {
      id: "clinic-3",
      name: "Shanti Dental Wellness",
      address: "Main Market, Plaza Road",
      phone: "+91 93450 11993",
      email: "shantidental@gmail.com",
      subscriptionPlan: "Free",
      subscriptionStatus: "Trial",
      status: "Active",
      createdAt: "2026-05-18T11:00:00.000Z"
    }
  ]);

  // Audit Logs database tracker mock
  const [auditLogs] = useState<AuditLog[]>([
    { id: "log-1", clinicId: "clinic-1", userId: "doc-1", userName: "Dr. Vikram Aditya", role: "DOCTOR", action: "EMR_WRITE", details: "Logged Hypertension assessment file for patient Rajesh Kumar", timestamp: "2026-06-19 14:30:20", ipAddress: "192.168.1.102" },
    { id: "log-2", clinicId: "clinic-1", userId: "staff-1", userName: "Suresh Gupta", role: "RECEPTIONIST", action: "WALKIN_APPOINTMENT_CREATE", details: "Allocated Walkin Token #101 for Sunita Devi", timestamp: "2026-06-19 15:12:10", ipAddress: "192.168.1.55" },
    { id: "log-3", clinicId: "clinic-1", userId: "doc-2", userName: "Dr. Anjali Sharma", role: "DOCTOR", action: "PRESCRIPTION_PRINT", details: "Generated printable medication slip for patient Sunita Devi", timestamp: "2026-06-19 16:04:45", ipAddress: "192.168.1.189" }
  ]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || !expDesc) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      clinicId: "clinic-1",
      category: expCategory,
      amount: Number(expAmount),
      date: new Date().toISOString().split("T")[0],
      description: expDesc
    };

    onAddExpense(newExp);
    setExpDesc("");
    alert("New clinic expenditure item reported and compiled inside monthly balance ledger.");
  };

  const handleRegisterStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stName || !stPhone) return;

    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      clinicId: "clinic-1",
      name: stName,
      role: stRole,
      phone: stPhone,
      email: stEmail || `${stName.toLowerCase().replace(/\s+/g, "")}@apex.com`,
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active",
      salary: Number(stSalary),
      shiftHours: "09:00 - 18:00"
    };

    onAddStaff(newStaff);
    setStName("");
    setStPhone("");
    setStEmail("");
    alert("Personnel staff catalog created and shifts assigned successfully!");
  };

  const handleUpgradePlan = (id: string, plan: Clinic["subscriptionPlan"]) => {
    setSaasClinics(saasClinics.map(c => 
      c.id === id ? { ...c, subscriptionPlan: plan } : c
    ));
    alert(`SaaS Subscription Plan upgraded successfully to ${plan}!`);
  };

  // derived metrics
  const totalExpensesSum = expenses.reduce((acc, current) => acc + current.amount, 0);

  return (
    <div className="flex-1 flex flex-col gap-6 h-full min-h-0 text-xs" id="management-panel-root">
      
      {/* Selector layout sub headers */}
      <div className="flex border-b border-slate-200 shrink-0 text-xs bg-slate-50">
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition-all ${
            activeTab === "staff" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Staff & Shift Logs
        </button>
        <button
          onClick={() => setActiveTab("finance")}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition-all ${
            activeTab === "finance" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Clinic Balance P&L
        </button>
        <button
          onClick={() => setActiveTab("saas")}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition-all ${
            activeTab === "saas" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Super Admin Panel
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition-all ${
            activeTab === "audit" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Secure Audit Logs
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            
            {/* New staff registration */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm">Create New Staff Profile</h3>
              
              <form onSubmit={handleRegisterStaff} className="space-y-3">
                <div className="space-y-1">
                  <span>Name *</span>
                  <input
                    type="text" required value={stName} onChange={e => setStName(e.target.value)}
                    placeholder="e.g. Meera Nair"
                    className="w-full p-2 border border-slate-200 rounded outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span>Assigned Role</span>
                    <select
                      value={stRole} onChange={e => setStRole(e.target.value as any)}
                      className="w-full p-2 border border-slate-200 rounded bg-white outline-none font-bold"
                    >
                      <option value="NURSE">Resident Nurse</option>
                      <option value="RECEPTIONIST">Front desk receptionist</option>
                      <option value="LAB_TECHNICIAN">Lab Biochemist Pathologist</option>
                      <option value="PHARMACIST">Pharmacist Apothecary</option>
                      <option value="ACCOUNTANT">Billing Accountant</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span>Monthly Emolument (₹)</span>
                    <input
                      type="number" value={stSalary} onChange={e => setStSalary(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text" required value={stPhone} onChange={e => setStPhone(e.target.value)}
                    placeholder="Mobile Phone"
                    className="p-2 border border-slate-200 rounded outline-none"
                  />
                  <input
                    type="email" value={stEmail} onChange={e => setStEmail(e.target.value)}
                    placeholder="Corporate email"
                    className="p-2 border border-slate-200 rounded outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2 rounded shadow-xs"
                >
                  ✓ Onboard Member & Assign Shift Hours
                </button>
              </form>
            </div>

            {/* Shift Duty Roster */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 max-h-full overflow-y-auto">
              <h3 className="font-extrabold text-slate-800 text-sm">Personnel Shift Directory</h3>
              
              <div className="divide-y divide-slate-100 border border-slate-150 border-slate-100 rounded-xl overflow-hidden">
                {staffList.map((st) => (
                  <div key={st.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">{st.name}</div>
                      <div className="flex gap-2 text-[10px]">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">{st.role}</span>
                        <span className="text-slate-400 font-mono">Duty Time: {st.shiftHours}</span>
                      </div>
                      <p className="text-[10px] text-slate-505 text-slate-500">Corporate: {st.email} • Join Date: {st.joinDate}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-800 font-mono block">₹{st.salary} / Month</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded uppercase block mt-1 w-max ml-auto">
                        {st.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            {/* Record expenditure */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-850 text-sm">Log Monthly Expenditure</h3>
              <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <span>Expense Classification</span>
                  <select
                    value={expCategory} onChange={e => setExpCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded bg-white outline-none"
                  >
                    <option value="Rent">Landlord premise Lease</option>
                    <option value="Electricity">Electricity power bill</option>
                    <option value="Salary">Staff Emoluments and Salaries</option>
                    <option value="Equipment">Medical Diagnostic Hardware/scanners</option>
                    <option value="Maintenance">Infrastructure maintenance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span>Amount (₹) *</span>
                  <input
                    type="number" required value={expAmount} onChange={e => setExpAmount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded outline-none font-bold text-slate-800 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <span>Description *</span>
                  <textarea
                    required value={expDesc} onChange={e => setExpDesc(e.target.value)}
                    placeholder="Invoiced description guidelines..."
                    className="w-full p-2 border border-slate-200 rounded outline-none h-16"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 border text-white font-extrabold py-2 rounded shadow-xs"
                >
                  ✓ Settle and File Expenditures
                </button>
              </form>
            </div>

            {/* Expenses lists */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 max-h-full overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-850 text-sm">Settled Outflows Log</h3>
                <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold font-mono">
                  Cumulative: - ₹{totalExpensesSum}
                </span>
              </div>

              <div className="space-y-3">
                {expenses.map(exp => (
                  <div key={exp.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-850 text-xs">{exp.description}</div>
                      <div className="flex gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>Class: {exp.category}</span>
                        <span>Date Filed: {exp.date}</span>
                      </div>
                    </div>
                    <strong className="text-red-650 text-red-600 font-black font-mono text-xs">- ₹{exp.amount}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {saasClinics && activeTab === "saas" && (
          <div className="space-y-6">
            <div className="p-4 bg-indigo-900 text-white rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1">
                  <Layers className="w-5 h-5 text-indigo-400" /> Multi-Tenant Active SaaS Subscriptions
                </h3>
                <p className="text-[10px] text-indigo-200 leading-relaxed max-w-xl">
                  As SaaS Global Registrar, configure license validity, toggle enterprise features, and monitor absolute Monthly Recurring revenue metrics instantly.
                </p>
              </div>

              <div className="bg-white/10 px-4 py-2 border border-white/20 rounded text-right shrink-0">
                <span className="text-[9px] uppercase font-bold text-indigo-300 block">Total SaaS MRR</span>
                <span className="text-lg font-black font-mono">₹1,48,500</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {saasClinics.map(clin => (
                <div key={clin.id} className="bg-white border border-slate-220 border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-850 text-xs">{clin.name}</h4>
                      <p className="text-[9px] text-slate-400 font-mono truncate max-w-[180px]">{clin.address}</p>
                    </div>

                    <span className="text-[9px] font-mono font-black border bg-slate-55 bg-indigo-50 border-indigo-200 text-indigo-750 px-2 py-0.5 rounded-full uppercase">
                      {clin.subscriptionPlan}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 my-1"></div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <strong className="text-emerald-600">● {clin.status}</strong>
                  </div>

                  {/* Pricing upgrader toggle */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Configure SaaS level</span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => handleUpgradePlan(clin.id, "Starter")}
                        className={`py-1 text-[9px] font-bold border rounded ${clin.subscriptionPlan === 'Starter' ? 'bg-indigo-600 text-white' : 'border-slate-200 hover:bg-slate-100'}`}
                      >
                        Starter
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpgradePlan(clin.id, "Professional")}
                        className={`py-1 text-[9px] font-bold border rounded ${clin.subscriptionPlan === 'Professional' ? 'bg-indigo-600 text-white' : 'border-slate-200 hover:bg-slate-100'}`}
                      >
                        Pro
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpgradePlan(clin.id, "Enterprise")}
                        className={`py-1 text-[9px] font-bold border rounded ${clin.subscriptionPlan === 'Enterprise' ? 'bg-indigo-600 text-white' : 'border-slate-200 hover:bg-slate-100'}`}
                      >
                        Enterprise
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {auditLogs && activeTab === "audit" && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-850 text-sm flex items-center gap-1">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Tamper-Proof Clinical Logs
                </h3>
                <p className="text-[10px] text-slate-450 text-slate-400">HIPAA compliant security audit tracking parameters</p>
              </div>

              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 py-1 px-2.5 rounded-full animate-pulse">
                ● Live Security Tracking Encrypted
              </span>
            </div>

            <div className="border border-slate-150 border-slate-100 divide-y divide-slate-120 divide-slate-100 overflow-hidden rounded-xl font-mono text-[10px]">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 flex flex-col md:flex-row justify-between text-left gap-2 hover:bg-slate-50 transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="font-sans font-extrabold text-[11px] text-slate-800">{log.details}</div>
                    <p className="text-slate-450 font-normal">
                      Operator: <span className="text-indigo-600 font-bold">{log.userName} ({log.role})</span> • Event Code: <span className="font-bold text-slate-700 bg-slate-100 px-1 rounded">{log.action}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-slate-500 font-sans block">{log.timestamp}</span>
                    <span className="text-slate-450 block font-normal text-slate-400 font-mono">IP Tunnel: {log.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
