import React, { useState } from "react";
import { 
  FileText, Activity, Pill, User, Printer, Download, Sparkles, CheckSquare, 
  Trash2, Plus, ShieldCheck, HeartPulse, AlertCircle, FileSignature, Check
} from "lucide-react";
import { Patient, Doctor, Medicine, EMR, Prescription, MedRoute } from "../types";

interface EMRAndPrescriptionProps {
  patients: Patient[];
  doctors: Doctor[];
  medicines: Medicine[];
  emrList: EMR[];
  prescriptions: Prescription[];
  onAddEMR: (emr: EMR) => void;
  onAddPrescription: (presc: Prescription) => void;
}

export default function EMRAndPrescription({ 
  patients, doctors, medicines, emrList, prescriptions, onAddEMR, onAddPrescription 
}: EMRAndPrescriptionProps) {
  
  const [selectedPatId, setSelectedPatId] = useState<string>(patients[0]?.id || "");
  const [selectedDocId, setSelectedDocId] = useState<string>(doctors[0]?.id || "");

  // EMR Form fields
  const [chiefComplaints, setChiefComplaints] = useState("");
  const [symptomsInput, setSymptomsInput] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [advice, setAdvice] = useState("");
  const [followUpDays, setFollowUpDays] = useState(7);

  // Vitals State
  const [vTemp, setVTemp] = useState(98.6);
  const [vPulse, setVPulse] = useState(72);
  const [vBPSys, setVBPsys] = useState(120);
  const [vBPDia, setVBPdia] = useState(80);
  const [vSugar, setVSugar] = useState(100);
  const [vOxygen, setVOxygen] = useState(98);

  // Prescription custom medicines list draft
  const [prescribedMeds, setPrescribedMeds] = useState<MedRoute[]>([]);
  const [currentMedSelect, setCurrentMedSelect] = useState<string>(medicines[0]?.name || "");
  const [currentDosage, setCurrentDosage] = useState("1 tab");
  const [currentFreq, setCurrentFreq] = useState("1-0-1");
  const [currentDuration, setCurrentDuration] = useState("5 days");
  const [currentInstruction, setCurrentInstruction] = useState("Take after food");

  const [lastSavedPrescription, setLastSavedPrescription] = useState<Prescription | null>(prescriptions[0] || null);

  const selectedPatient = patients.find(p => p.id === selectedPatId);
  const selectedDoctor = doctors.find(d => d.id === selectedDocId);

  const handleAddMedToDraft = () => {
    if (!currentMedSelect) return;
    const medItem = medicines.find(m => m.name === currentMedSelect);
    const newMedRoute: MedRoute = {
      name: currentMedSelect,
      genericName: medItem?.genericName || "",
      dosage: currentDosage,
      frequency: currentFreq,
      duration: currentDuration,
      instruction: currentInstruction
    };
    setPrescribedMeds([...prescribedMeds, newMedRoute]);
  };

  const handleRemoveMedFromDraft = (index: number) => {
    setPrescribedMeds(prescribedMeds.filter((_, i) => i !== index));
  };

  const handleSaveEMRAndDraftRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !selectedDoctor) {
      alert("Please designate patient & clinician first!");
      return;
    }

    const followUpDateStr = new Date();
    followUpDateStr.setDate(followUpDateStr.getDate() + Number(followUpDays));
    const formattedFollowUp = followUpDateStr.toISOString().split("T")[0];

    // 1. Save EMR
    const newEMR: EMR = {
      id: `emr-${Date.now()}`,
      clinicId: "clinic-1",
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: new Date().toISOString().split("T")[0],
      chiefComplaints: chiefComplaints || "Routine medical evaluation",
      symptoms: symptomsInput ? symptomsInput.split(",").map(s => s.trim()) : ["General Checkup"],
      vitals: {
        temperature: Number(vTemp),
        pulse: Number(vPulse),
        bloodPressureSys: Number(vBPSys),
        bloodPressureDia: Number(vBPDia),
        sugarLevel: Number(vSugar),
        sugarType: "Random",
        oxygenSaturation: Number(vOxygen)
      },
      diagnosis: diagnosis || "Primary clinical overview",
      treatmentPlan: treatmentPlan || "Observational care. Vital monitoring.",
      advice: advice || "Drink plenty of water and avoid strenuous activity.",
      followUpDate: formattedFollowUp,
      digitalSignature: `${selectedDoctor.name}, ${selectedDoctor.qualification}`,
      createdAt: new Date().toISOString()
    };

    onAddEMR(newEMR);

    // 2. Clear out details and build real prescription
    const newPresc: Prescription = {
      id: `presc-${Date.now()}`,
      clinicId: "clinic-1",
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      patientPhone: selectedPatient.phone,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpec: selectedDoctor.specialization,
      doctorRegNum: selectedDoctor.registrationNumber,
      date: new Date().toISOString().split("T")[0],
      symptoms: chiefComplaints || "Primary systemic complaints",
      diagnosis: diagnosis || "Clinical evaluation review",
      medicines: prescribedMeds.length > 0 ? prescribedMeds : [
        { name: "Syp Complex Multivitamin", dosage: "5 ml", frequency: "0-0-1", duration: "10 days", instruction: "Take after dinner" }
      ],
      advice: advice || "Rest. Avoid cold beverages.",
      followUpDate: formattedFollowUp,
      qrVerifyUrl: `https://smartclinic.com/verify/${selectedPatient.patientId}`,
      createdAt: new Date().toISOString()
    };

    onAddPrescription(newPresc);
    setLastSavedPrescription(newPresc);

    // Reset Forms
    setChiefComplaints("");
    setSymptomsInput("");
    setDiagnosis("");
    setTreatmentPlan("");
    setAdvice("");
    setPrescribedMeds([]);
    alert("Enterprise EMR & Patient Prescription compiled and logged successfully!");
  };

  // AI assist autoconfigurator helper
  const handleAIFillForm = () => {
    setChiefComplaints("Persistent chest tightiness, shortness of breath, heavy walking dyspnea");
    setSymptomsInput("Chest congestion, palpitation, wheezing");
    setDiagnosis("Mild acute bronchial spasm secondary to childhood asthma");
    setTreatmentPlan("Immediate bronchodilator inhalation. Avoid allergen triggers.");
    setAdvice("Inhale saline nebulizer twice daily. Keep asthalin inhaler handy.");
    setVTemp(98.4);
    setVPulse(88);
    setVBPsys(135);
    setVBPdia(92);
    setVOxygen(95);

    // Auto load appropriate medicines if available
    const hasInhaler = medicines.some(m => m.name.toLowerCase().includes("montair") || m.name.toLowerCase().includes("telma"));
    if (hasInhaler) {
      const match = medicines.find(m => m.name.toLowerCase().includes("montair")) || medicines[0];
      setPrescribedMeds([
        {
          name: match.name,
          genericName: match.genericName,
          dosage: "1 tab",
          frequency: "0-0-1",
          duration: "10 days",
          instruction: "Take once daily strictly at bedtime"
        }
      ]);
    }
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 h-full min-h-0" id="emr-rx-root">
      
      {/* LEFT FORM WORKSPACE (7/12) */}
      <div className="w-full xl:w-7/12 bg-white rounded-xl border border-slate-200 overflow-y-auto max-h-full p-6 space-y-6">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-800">
            <HeartPulse className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">Active EMR & Diagnostics Sheet</h3>
              <p className="text-[10px] text-slate-500">Log patient vitals, diagnosis codes, and medicine prescription cards</p>
            </div>
          </div>

          <button
            onClick={handleAIFillForm}
            className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Form Assistant
          </button>
        </div>

        <form onSubmit={handleSaveEMRAndDraftRx} className="space-y-5 text-xs">
          
          {/* Diagnostic Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Select Patient File *</label>
              <select
                value={selectedPatId}
                onChange={(e) => setSelectedPatId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md outline-none bg-white font-medium"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600">Attending Specialist *</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md outline-none bg-white font-medium"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vitals Signs Card Grid */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              Patient Vital Signs screening logger
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-center space-y-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Temp (°F)</span>
                <input
                  type="number" step="0.1" value={vTemp} onChange={e => setVTemp(Number(e.target.value))}
                  className="w-full text-center font-bold text-slate-800 bg-transparent text-sm outline-none"
                />
              </div>
              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-center space-y-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">BP (Sys/Dia)</span>
                <div className="flex items-center justify-center gap-1 font-bold text-slate-800">
                  <input
                    type="number" value={vBPSys} onChange={e => setVBPsys(Number(e.target.value))}
                    className="w-8 text-center bg-transparent outline-none"
                  />
                  <span>/</span>
                  <input
                    type="number" value={vBPDia} onChange={e => setVBPdia(Number(e.target.value))}
                    className="w-8 text-center bg-transparent outline-none"
                  />
                </div>
              </div>
              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-center space-y-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Pulse (BPM)</span>
                <input
                  type="number" value={vPulse} onChange={e => setVPulse(Number(e.target.value))}
                  className="w-full text-center font-bold text-slate-800 bg-transparent text-sm outline-none"
                />
              </div>
              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-center space-y-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Sugar (mg/dl)</span>
                <input
                  type="number" value={vSugar} onChange={e => setVSugar(Number(e.target.value))}
                  className="w-full text-center font-bold text-slate-800 bg-transparent text-sm outline-none"
                />
              </div>
              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-center space-y-0.5 col-span-3 sm:col-span-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">SpO2 Oxygen (%)</span>
                <input
                  type="number" value={vOxygen} onChange={e => setVOxygen(Number(e.target.value))}
                  className="w-full text-center font-bold text-slate-800 bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sickness Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Chief Concerns & complaints</label>
                <textarea
                  required value={chiefComplaints} onChange={e => setChiefComplaints(e.target.value)}
                  placeholder="e.g. Dry cough, chest tightiness, breathlessness walking up stairs"
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 h-16 font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Associated Symptoms (comma separated)</label>
                <textarea
                  value={symptomsInput} onChange={e => setSymptomsInput(e.target.value)}
                  placeholder="e.g. Wheezing, chest congestion, fatigue, headache"
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 h-16 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Diagnosed Clinical Indication</label>
                  <input
                    type="text" required value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                    placeholder="e.g. Mild Subclincial Hypothyroidism / Acute Asthma Flareup"
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Treatment Care Plan summary</label>
                  <input
                    type="text" value={treatmentPlan} onChange={e => setTreatmentPlan(e.target.value)}
                    placeholder="e.g. Elevate dosage, daily BP logs, checkup next week."
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Medicine Prescriber Tray */}
          <div className="p-4 border border-slate-200 bg-slate-50/50 rounded-xl space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Pill className="w-3.5 h-3.5 text-indigo-500" />
              Prescription details Builder
            </div>

            {/* Selector bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
              <div className="space-y-1 co-span-1 col-span-2 sm:col-span-1">
                <span className="text-[9px] text-slate-500 block font-bold uppercase">Select Stock Item</span>
                <select
                  value={currentMedSelect}
                  onChange={(e) => setCurrentMedSelect(e.target.value)}
                  className="w-full p-1.5 border border-slate-200 rounded bg-white"
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.name}>{m.name} ({m.strength})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 block font-bold uppercase">Dose Dosage</span>
                <input
                  type="text" value={currentDosage} onChange={e => setCurrentDosage(e.target.value)}
                  placeholder="e.g. 1 tab / 5ml"
                  className="w-full p-1.5 border border-slate-200 rounded bg-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 block font-bold uppercase">Frequency</span>
                <select
                  value={currentFreq}
                  onChange={(e) => setCurrentFreq(e.target.value)}
                  className="w-full p-1.5 border border-slate-200 rounded bg-white font-mono"
                >
                  <option value="1-0-1">1-0-1 (Afternoon Empty)</option>
                  <option value="1-0-0">1-0-0 (Morning Only)</option>
                  <option value="0-0-1">0-0-1 (Bedtime Only)</option>
                  <option value="1-1-1">1-1-1 (Morning-Noon-Night)</option>
                  <option value="AS_REQUIRED">As Required (SOS)</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 block font-bold uppercase">Course Duration</span>
                <input
                  type="text" value={currentDuration} onChange={e => setCurrentDuration(e.target.value)}
                  placeholder="e.g. 5 days / 2 weeks"
                  className="w-full p-1.5 border border-slate-200 rounded bg-white font-semibold"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddMedToDraft}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 rounded transition-all text-[11px]"
                >
                  + Add Item
                </button>
              </div>
            </div>

            <div className="space-y-1 px-1">
              <span className="text-[9px] text-slate-500 block font-bold">Standard Intake Instruction / Special warnings</span>
              <input
                type="text"
                value={currentInstruction}
                onChange={(e) => setCurrentInstruction(e.target.value)}
                className="w-full p-1.5 border border-slate-200 rounded bg-white"
                placeholder="e.g. Take strictly 30 mins before breakfast on empty stomach with warm water"
              />
            </div>

            {/* Medicines Grid draft view */}
            {prescribedMeds.length > 0 && (
              <div className="border border-slate-200 bg-white rounded divide-y divide-slate-100 overflow-hidden">
                {prescribedMeds.map((med, index) => (
                  <div key={index} className="px-3 py-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-indigo-950">{med.name} <span className="text-[10px] text-slate-500 font-normal">({med.genericName})</span></div>
                      <div className="text-[10px] text-slate-600">
                        {med.dosage} • <strong>{med.frequency}</strong> • Course: {med.duration}
                      </div>
                      {med.instruction && <p className="text-[9px] text-emerald-700 font-semibold">↳ {med.instruction}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedFromDraft(index)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold p-1 bg-rose-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advice & Follow Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 block">General Patient Advice & Nutrition guidelines</label>
              <textarea
                value={advice} onChange={e => setAdvice(e.target.value)}
                placeholder="Avoid oily meals, walk 2.5km daily, report BP levels instantly if exceeding limits... "
                className="w-full p-2 border border-slate-200 rounded-lg outline-none h-16"
              />
            </div>
            <div className="space-y-2">
              <div>
                <label className="font-bold text-slate-600 block">Follow-up timeline</label>
                <select
                  value={followUpDays} onChange={e => setFollowUpDays(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-md outline-none bg-white font-semibold mt-1"
                >
                  <option value={3}>In 3 Days</option>
                  <option value={7}>In 7 Days (1 week)</option>
                  <option value={14}>In 14 Days (2 weeks)</option>
                  <option value={30}>In 30 Days (1 month)</option>
                  <option value={0}>No immediate follow-up required</option>
                </select>
              </div>

              {/* Active Clinical Autograph */}
              <div className="border border-slate-200 bg-slate-50 flex items-center gap-2 p-2 rounded-lg justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                  <FileSignature className="w-3.5 h-3.5 stroke-1" />
                  E-Signature Certificate Enabled
                </div>
                <div className="font-mono text-xs italic text-indigo-700 font-bold border-b border-indigo-400">
                  {selectedDoctor ? selectedDoctor.name : "Choose Doc"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 shrink-0">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2 px-4 rounded-xl shadow-xs transition-colors text-center text-xs"
            >
              ✓ Compile EHR EMR & Print Patient Prescription Card
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT PDF PRESCRIPTION VIEW (5/12) */}
      <div className="w-full xl:w-5/12 bg-white rounded-xl border border-slate-200 max-h-full overflow-y-auto p-6 flex flex-col justify-between">
        
        {lastSavedPrescription ? (
          <div className="space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Prescription Slip #P-{lastSavedPrescription.id.slice(-4)}</span>
              <button
                onClick={() => window.print()}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print Layout (PDF)
              </button>
            </div>

            {/* PDF Sheet mock wrapper */}
            <div className="border border-slate-250 bg-white p-6 shadow-sm rounded-lg text-slate-900 text-xs flex flex-col space-y-4 max-w-md mx-auto font-sans" id="printable-prescription-ticket">
              
              {/* Header Letterhead */}
              <div className="flex justify-between border-b-2 border-indigo-900 pb-3 h-16 items-center">
                <div>
                  <h3 className="font-extrabold text-[13px] text-indigo-950 uppercase tracking-tight">Apex Healthcare</h3>
                  <p className="text-[8px] text-slate-450 italic">Suite 404, Ring Road Sector 5</p>
                  <p className="text-[8px] text-slate-450">GST: 07AAAAA1111A1Z1</p>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-[11px] text-slate-800">{lastSavedPrescription.doctorName}</h4>
                  <p className="text-[8px] text-slate-500 font-mono">Reg No: {lastSavedPrescription.doctorRegNum}</p>
                  <p className="text-[8px] text-indigo-600 font-semibold">{lastSavedPrescription.doctorSpec}</p>
                </div>
              </div>

              {/* Patient details block */}
              <div className="grid grid-cols-2 gap-2 text-[9px] bg-slate-50 p-2.5 rounded border border-slate-100">
                <div>Patient Name: <strong className="text-slate-800 text-[10px]">{lastSavedPrescription.patientName}</strong></div>
                <div className="text-right">Date: <strong>{lastSavedPrescription.date}</strong></div>
                <div>Age / Gender: <strong>{lastSavedPrescription.patientAge} years / {lastSavedPrescription.patientGender}</strong></div>
                <div className="text-right">Phone: <strong>{lastSavedPrescription.patientPhone}</strong></div>
              </div>

              {/* Symptoms / Diagnosis */}
              <div className="space-y-1">
                <div><span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Symptoms & Presentation</span> <p className="font-semibold text-slate-800">{lastSavedPrescription.symptoms}</p></div>
                <div><span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Assessment Diagnosis</span> <p className="font-extrabold text-slate-900 italic text-[11px]">Rx {lastSavedPrescription.diagnosis}</p></div>
              </div>

              {/* Medicines Table */}
              <table className="w-full text-left font-sans text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-[8px] text-slate-400 uppercase font-bold tracking-wider">
                    <th className="py-1">Formulation Brand Name</th>
                    <th className="py-1 uppercase">Dose</th>
                    <th className="py-1 text-center font-semibold">Frequency</th>
                    <th className="py-1 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lastSavedPrescription.medicines.map((med, i) => (
                    <tr key={i} className="py-2 inline-table text-[10px] w-full">
                      <td className="py-1.5">
                        <div className="font-bold text-slate-850">{med.name}</div>
                        {med.genericName && <div className="text-[8px] text-slate-450 italic lowercase">({med.genericName})</div>}
                        {med.instruction && <div className="text-[8px] text-emerald-800 font-semibold">↳ {med.instruction}</div>}
                      </td>
                      <td className="py-1.5">{med.dosage}</td>
                      <td className="py-1.5 text-center font-mono font-bold text-indigo-700">{med.frequency}</td>
                      <td className="py-1.5 text-right font-semibold">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Advice Notes */}
              {lastSavedPrescription.advice && (
                <div className="p-2 border border-dashed border-indigo-100 bg-indigo-50/20 rounded">
                  <span className="text-[8px] font-bold text-indigo-900 uppercase block mb-0.5">Special Advice / Clinical Instructions</span>
                  <p className="text-[9px] text-slate-700 leading-relaxed font-semibold">{lastSavedPrescription.advice}</p>
                </div>
              )}

              {/* Follow up & verify */}
              <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                <div className="space-y-1">
                  <div className="text-[8px] text-slate-400 font-bold uppercase">Follow-Up Date</div>
                  <div className="text-xs font-bold text-rose-600">{lastSavedPrescription.followUpDate}</div>
                </div>

                {/* Digital Verification Autograph stamp */}
                <div className="text-right space-y-1">
                  <div className="text-[8px] text-slate-400 font-bold">DIGITAL CERTIFICATE SIGNATURE</div>
                  <div className="font-mono text-indigo-900 border-b border-slate-350 italic text-[11px] font-bold">
                    {lastSavedPrescription.doctorName}
                  </div>
                  <div className="text-[6px] text-slate-400">SmartClinic Secured Blockchain</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 text-[10px] flex items-center gap-1.5 leading-relaxed font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Prescription QR is live: Patient can present their card at any SmartClinic pharmacy for auto dosage stock deduction.
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400 space-y-2 flex flex-col justify-center items-center">
            <FileText className="w-10 h-10 stroke-1 text-slate-300" />
            <div className="text-xs">No saved prescriptions are loaded. Record an EMR to compile your first layout sheet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
