import React, { useState } from "react";
import { 
  Users, Search, Filter, Plus, FileText, ChevronRight, Activity, Download, Printer, ShieldCheck, 
  Trash2, PlusCircle, Check, HelpCircle, HardDriveDownload, UserPlus, Image, FileDigit, Heart, AlertCircle
} from "lucide-react";
import { Patient } from "../types";

interface PatientsPanelProps {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
}

export default function PatientsPanel({ patients, onAddPatient, onDeletePatient }: PatientsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [bloodFilter, setBloodFilter] = useState("All");
  const [chronicFilter, setChronicFilter] = useState("All");
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patients[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New patient form fields state
  const [pName, setPName] = useState("");
  const [pAge, setPAge] = useState(30);
  const [pGender, setPGender] = useState<"Male" | "Female" | "Other">("Male");
  const [pDob, setPDob] = useState("1996-01-01");
  const [pPhone, setPPhone] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pAddress, setPAddress] = useState("");
  const [pBlood, setPBlood] = useState<Patient["bloodGroup"]>("O+");
  const [pWeight, setPWeight] = useState(70);
  const [pHeight, setPHeight] = useState(170);
  const [pEmergencyName, setPEmergencyName] = useState("");
  const [pEmergencyPhone, setPEmergencyPhone] = useState("");
  const [pEmergencyRelation, setPEmergencyRelation] = useState("");
  const [pAllergies, setPAllergies] = useState("");
  const [pHistory, setPHistory] = useState("");
  const [pChronic, setPChronic] = useState("");
  const [pAbha, setPAbha] = useState("");
  const [pAadhaar, setPAadhaar] = useState("");
  const [pInsurance, setPInsurance] = useState("");
  const [pNotes, setPNotes] = useState("");

  // Search and filter matches
  const filteredPatients = patients.filter((p) => {
    const sTerm = searchTerm.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(sTerm) ||
      p.patientId.toLowerCase().includes(sTerm) ||
      p.phone.includes(sTerm) ||
      (p.abhaNumber && p.abhaNumber.includes(sTerm));

    const matchesGender = genderFilter === "All" || p.gender === genderFilter;
    const matchesBlood = bloodFilter === "All" || p.bloodGroup === bloodFilter;
    const matchesChronic = chronicFilter === "All" || 
      (p.chronicDiseases && p.chronicDiseases.some(d => d.toLowerCase().includes(chronicFilter.toLowerCase())));

    return matchesSearch && matchesGender && matchesBlood && matchesChronic;
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Auto BPM helper
  const calculateBMI = (wt: number, ht: number) => {
    if (!wt || !ht) return 0;
    const heightInMeters = ht / 100;
    return parseFloat((wt / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPhone) {
      alert("Name and Phone are mandatory!");
      return;
    }

    const calculatedBmi = calculateBMI(pWeight, pHeight);
    const complexId = `SC-${new Date().getFullYear()}-000${patients.length + 1}`;

    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      clinicId: "clinic-1",
      patientId: complexId,
      name: pName,
      age: Number(pAge),
      gender: pGender,
      dob: pDob,
      phone: pPhone,
      email: pEmail || `${pName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      address: pAddress || "Not Specified",
      bloodGroup: pBlood,
      weight: Number(pWeight),
      height: Number(pHeight),
      bmi: calculatedBmi,
      emergencyContact: {
        name: pEmergencyName || "Relative",
        phone: pEmergencyPhone || pPhone,
        relation: pEmergencyRelation || "Family"
      },
      allergies: pAllergies ? pAllergies.split(",").map(a => a.trim()) : [],
      medicalHistory: pHistory ? pHistory.split(",").map(h => h.trim()) : [],
      chronicDiseases: pChronic ? pChronic.split(",").map(c => c.trim()) : [],
      abhaNumber: pAbha || undefined,
      aadhaarNumber: pAadhaar || undefined,
      insuranceProvider: pInsurance || undefined,
      notes: pNotes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddPatient(newPat);
    setSelectedPatientId(newPat.id);
    setShowAddModal(false);

    // Reset fields
    setPName("");
    setPPhone("");
    setPEmail("");
    setPAddress("");
    setPAllergies("");
    setPHistory("");
    setPChronic("");
    setPAbha("");
    setPAadhaar("");
    setPInsurance("");
    setPNotes("");
  };

  const handleCSVExport = () => {
    const headers = ["Patient ID,Name,Age,Gender,Phone,Blood Group,BMI,ABHA\n"];
    const rows = patients.map(p => 
      `"${p.patientId}","${p.name}",${p.age},"${p.gender}","${p.phone}","${p.bloodGroup}",${p.bmi},"${p.abhaNumber || 'N/A'}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `SmartClinic_Patients_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 h-full min-h-0" id="patients-panel">
      {/* LEFT COLUMN: REGISTRY INDEX */}
      <div className="w-full md:w-5/12 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden max-h-full">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-slate-800">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm tracking-tight">Active Patients Directory</h3>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1 px-2.5 rounded-md flex items-center gap-1 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Patient
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, Name, Phone or ABHA ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 text-[10px]">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="flex-1 border border-slate-200 rounded p-1 bg-slate-50 text-slate-600 font-semibold"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="flex-1 border border-slate-200 rounded p-1 bg-slate-50 text-slate-600 font-semibold"
            >
              <option value="All">All Blood Types</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
            </select>
            <select
              value={chronicFilter}
              onChange={(e) => setChronicFilter(e.target.value)}
              className="flex-1 border border-slate-200 rounded p-1 bg-slate-50 text-slate-600 font-semibold"
            >
              <option value="All">All Chronic Status</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Asthma">Asthma</option>
            </select>
          </div>
        </div>

        {/* Patients List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching records found in this clinic tenant.
            </div>
          ) : (
            filteredPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`p-3 cursor-pointer transition-colors flex items-center justify-between text-xs ${
                  selectedPatientId === p.id ? "bg-emerald-50/55 border-r-4 border-emerald-600" : "hover:bg-slate-50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">{p.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-1 rounded">{p.patientId}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {p.age}Y • {p.gender} • {p.phone}
                  </div>
                  {p.abhaNumber && (
                    <div className="text-[9px] text-teal-600 font-mono">
                      ABHA: {p.abhaNumber}
                    </div>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedPatientId === p.id ? "text-emerald-600 translate-x-1" : "text-slate-300"}`} />
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">Total Registries: {patients.length}</span>
          <button
            onClick={handleCSVExport}
            className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 hover:underline"
          >
            <Download className="w-3 h-3" />
            Export Excel/CSV
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL OPERATIONS CARD */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-y-auto max-h-full p-6">
        {selectedPatient ? (
          <div className="space-y-6">
            {/* Main Header card */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xl uppercase shrink-0">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selectedPatient.name}</h2>
                  <p className="text-xs text-slate-500 font-mono">Patient System ID: {selectedPatient.patientId}</p>
                  <div className="flex flex-wrap gap-2 mt-1 px-0">
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">
                      DOB: {selectedPatient.dob} ({selectedPatient.age} years)
                    </span>
                    <span className="text-[10px] bg-slate-105 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      ABHA: {selectedPatient.abhaNumber || "Unlinked"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                  title="Print Patient Card"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePatient(selectedPatient.id)}
                  className="p-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-600"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</div>
                <div className="text-lg font-extrabold text-red-600">{selectedPatient.bloodGroup}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Height / Weight</div>
                <div className="text-sm font-bold text-slate-700">
                  {selectedPatient.height}cm / {selectedPatient.weight}kg
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Calculated BMI</div>
                <div className={`text-sm font-bold ${
                  selectedPatient.bmi > 25 ? "text-amber-600" : "text-emerald-600"
                }`}>
                  {selectedPatient.bmi} ({selectedPatient.bmi > 25 ? "Overweight" : "Normal"})
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Insurance Policy</div>
                <div className="text-xs font-bold text-slate-600 truncate">
                  {selectedPatient.insuranceProvider || "None Specified"}
                </div>
              </div>
            </div>

            {/* Demographics & Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Demographics & Contact</h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-105 pb-1">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-semibold text-slate-850">{selectedPatient.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-105 pb-1">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-semibold text-slate-850">{selectedPatient.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-105 pb-1">
                    <span className="text-slate-500">Home Address:</span>
                    <span className="font-semibold text-slate-850 text-right max-w-xs">{selectedPatient.address}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Aadhaar National ID:</span>
                    <span className="font-semibold font-mono text-slate-800">{selectedPatient.aadhaarNumber || "Unverified"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Emergency Contact</h4>
                <div className="p-3 bg-red-50/40 border border-red-100 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact Person:</span>
                    <span className="font-bold text-slate-800">{selectedPatient.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Relation:</span>
                    <span className="font-semibold text-slate-700">{selectedPatient.emergencyContact.relation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Emergency Phone:</span>
                    <span className="font-bold text-red-600 font-mono">{selectedPatient.emergencyContact.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergies & Medical History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  Drug Allergies
                </h4>
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.allergies.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">No reported drug or food allergies.</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                  Chronic Diseases & Comorbidity
                </h4>
                {selectedPatient.chronicDiseases && selectedPatient.chronicDiseases.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.chronicDiseases.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-800 text-[10px] font-bold rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-600 font-semibold italic">● Clinically cleared of chronic diseases.</p>
                )}
              </div>
            </div>

            {/* Simulated Printed medical Card preview */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 print:border-none print:bg-white pt-4">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Printable SmartClinic Verification Card</div>
              <div className="border border-slate-200 bg-white shadow-sm rounded-lg p-4 max-w-sm flex gap-4 relative overflow-hidden">
                <div className="flex-1 space-y-2">
                  <div className="text-[9px] text-indigo-600 uppercase font-extrabold tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Clinic Member ID
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{selectedPatient.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: {selectedPatient.patientId}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500">
                    <div>Blood Group: <strong className="text-rose-600 text-[10px]">{selectedPatient.bloodGroup}</strong></div>
                    <div>DOB: <strong>{selectedPatient.dob}</strong></div>
                  </div>
                </div>

                {/* Inline SVG QR validation helper */}
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center p-1 font-mono hover:scale-105 transition-transform">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-70">
                    <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-slate-100"></div><div className="bg-slate-900"></div>
                    <div className="bg-slate-100"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-slate-100"></div>
                    <div className="bg-slate-900"></div><div className="bg-slate-100"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div>
                    <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-slate-100"></div><div className="bg-slate-900"></div>
                  </div>
                  <div className="text-[7px] text-slate-400 mt-1 uppercase font-bold tracking-widest text-center">SCAN CARD</div>
                </div>

                <div className="absolute right-0 bottom-0 w-8 h-8 bg-emerald-500/10 rounded-tl-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400">
            No patients loaded in the database. Add a new registration to begin.
          </div>
        )}
      </div>

      {/* POPUP MODAL: ADD PATIENT FORM */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-emerald-950 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-sm">New Digital Health Card Registration</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:text-slate-300 text-xs font-bold">✕ Close</button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section A: Personnel */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Full Patient Name *</label>
                  <input
                    type="text" required placeholder="e.g. Ramesh Chandra"
                    value={pName} onChange={e => setPName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Primary Mobile Phone *</label>
                  <input
                    type="text" required placeholder="e.g. 9812345678"
                    value={pPhone} onChange={e => setPPhone(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Age (Years)</label>
                  <input
                    type="number" value={pAge} onChange={e => setPAge(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Gender</label>
                  <select
                    value={pGender} onChange={e => setPGender(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Date of Birth</label>
                  <input
                    type="date" value={pDob} onChange={e => setPDob(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Blood Group</label>
                  <select
                    value={pBlood} onChange={e => setPBlood(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Height (cm) / Weight (kg)</label>
                  <div className="flex gap-2">
                    <input
                      type="number" placeholder="cm" value={pHeight} onChange={e => setPHeight(Number(e.target.value))}
                      className="w-1/2 p-2 border border-slate-200 rounded-md outline-none"
                    />
                    <input
                      type="number" placeholder="kg" value={pWeight} onChange={e => setPWeight(Number(e.target.value))}
                      className="w-1/2 p-2 border border-slate-200 rounded-md outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">ABHA National Digital ID</label>
                  <input
                    type="text" placeholder="e.g. 14 digit Number"
                    value={pAbha} onChange={e => setPAbha(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none"
                  />
                </div>
              </div>

              {/* Advanced Clinical Inputs */}
              <div className="h-px bg-slate-100 my-2"></div>
              
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700">Comorbidity & Clinical Notes</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">Drug Allergies (comma separated)</label>
                    <input
                      type="text" placeholder="Penicillin, Sulfa, Peanuts etc."
                      value={pAllergies} onChange={e => setPAllergies(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">Chronic Illnesses (comma separated)</label>
                    <input
                      type="text" placeholder="Hypertension, Asthma, Diabetes"
                      value={pChronic} onChange={e => setPChronic(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text" placeholder="Emergency Relative Name" value={pEmergencyName} onChange={e => setPEmergencyName(e.target.value)}
                    className="p-2 border border-slate-200 rounded-md outline-none"
                  />
                  <input
                    type="text" placeholder="Emergency Relation" value={pEmergencyRelation} onChange={e => setPEmergencyRelation(e.target.value)}
                    className="p-2 border border-slate-200 rounded-md outline-none"
                  />
                  <input
                    type="text" placeholder="Emergency Phone" value={pEmergencyPhone} onChange={e => setPEmergencyPhone(e.target.value)}
                    className="p-2 border border-slate-200 rounded-md outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text" placeholder="Insurance Partner Name" value={pInsurance} onChange={e => setPInsurance(e.target.value)}
                    className="p-2 border border-slate-200 rounded-md outline-none"
                  />
                  <input
                    type="text" placeholder="National Aadhaar ID Number" value={pAadhaar} onChange={e => setPAadhaar(e.target.value)}
                    className="p-2 border border-slate-200 rounded-md outline-none"
                  />
                </div>

                <div>
                  <textarea
                    placeholder="General Patient Notes & Demographics info..."
                    value={pNotes} onChange={e => setPNotes(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md h-16 outline-none"
                  />
                </div>
              </div>

              {/* Submission buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 font-semibold rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 font-bold text-white rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
