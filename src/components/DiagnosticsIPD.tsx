import React, { useState } from "react";
import { 
  FlaskConical, Activity, Image, Printer, Download, Sparkles, CheckSquare, 
  Trash2, Files, CheckCircle, ShieldAlert, BedDouble, ChevronRight
} from "lucide-react";
import { Patient, LabTest, RadiologyRecord } from "../types";

interface DiagnosticsIPDProps {
  patients: Patient[];
  labTests: LabTest[];
  onUpdateLabResults: (id: string, results: LabTest["results"], notes: string) => void;
  onAddLabTest: (test: LabTest) => void;
}

export default function DiagnosticsIPD({ patients, labTests, onUpdateLabResults, onAddLabTest }: DiagnosticsIPDProps) {
  const [activeSubTab, setActiveSubTab] = useState<"lab" | "radiology" | "ipd">("lab");
  const [selectedLabId, setSelectedLabId] = useState<string | null>(labTests[0]?.id || null);

  // New Lab test booking form states
  const [selectedPatId, setSelectedPatId] = useState(patients[0]?.id || "");
  const [testCategory, setTestCategory] = useState<LabTest["testCategory"]>("Thyroid");
  const [testName, setTestName] = useState("Comprehensive Thyroid Profile (T3, T4, Ultratsh)");

  // Lab Results inputs
  const [tshVal, setTshVal] = useState("5.82");
  const [t3Val, setT3Val] = useState("1.25");
  const [t4Val, setT4Val] = useState("7.8");
  const [labNotes, setLabNotes] = useState("TSH suggests subclinical hypothyroidism.");

  const selectedLab = labTests.find(l => l.id === selectedLabId);

  // Core IPD Ward Mock DB
  const [ipdRecords, setIpdRecords] = useState([
    {
      id: "ipd-1",
      admissionNum: "SC-IPD-30041",
      patName: "Rajesh Kumar",
      admissionDate: "2026-06-15",
      room: "A-201",
      bed: "Bed-2 (General Intensive)",
      doctor: "Dr. Vikram Aditya",
      vitalsHistory: [
        { date: "06-19 09:00", bp: "140/92", temp: "99.2", hr: "88", spo2: "96%" },
        { date: "06-19 18:00", bp: "135/88", temp: "98.6", hr: "80", spo2: "98%" }
      ],
      dietPlan: "Low sodium, diabetic specific regular diabetic meal, strictly no caffeine.",
      shiftNotes: "Stable pulse, slight afternoon fatigue. BP monitored twice during active cycles."
    },
    {
      id: "ipd-2",
      admissionNum: "SC-IPD-30042",
      patName: "Sunita Devi",
      admissionDate: "2026-06-18",
      room: "C-104",
      bed: "Bed-1 (Surgical Ward)",
      doctor: "Dr. Anjali Sharma",
      vitalsHistory: [
        { date: "06-19 11:30", bp: "120/80", temp: "98.4", hr: "72", spo2: "99%" }
      ],
      dietPlan: "Soft diet liquid fluids, fruit broth, normal water intake.",
      shiftNotes: "Recovering nicely. Sleep cycle was peaceful. Vitals monitored every 4 hours."
    }
  ]);

  // Radiology simulator mock DB
  const [radiologyRecords] = useState<RadiologyRecord[]>([
    {
      id: "rad-1",
      clinicId: "clinic-1",
      patientId: "pat-1",
      patientName: "Rajesh Kumar",
      type: "ECG",
      technicianNotes: "12-lead ECG completed. Normal sinus rhythm recorded with slight QT prolongation.",
      radiologistNotes: "Confirm clinical history of chronic hypertension. No acute ischemic indicators.",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300",
      status: "Completed",
      date: "2026-06-18"
    },
    {
      id: "rad-2",
      clinicId: "clinic-1",
      patientId: "pat-2",
      patientName: "Sunita Devi",
      type: "Ultrasound",
      technicianNotes: "Pelvic region scan, slight distension reported in abdominal profile.",
      radiologistNotes: "Pelvis scan detects normal hepatic and cystic outlines. Trace free fluid.",
      imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=300",
      status: "Completed",
      date: "2026-06-19"
    }
  ]);

  const handleBookLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedPatId);
    if (!pat) return;

    const newLab: LabTest = {
      id: `lab-${Date.now()}`,
      clinicId: "clinic-1",
      patientId: pat.id,
      patientName: pat.name,
      testName: testName,
      testCategory: testCategory,
      notes: "Sample yet to be collected by diagnostic technician in Ward",
      status: "Processing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddLabTest(newLab);
    setSelectedLabId(newLab.id);
    alert(`Diagnostics test ${testCategory} requested for patient!`);
  };

  const handleUpdateLabResults = () => {
    if (!selectedLab) return;
    
    // Construct dynamic parameter panel based on type
    const parsedResults = [
      { parameter: "Thyroid Stimulating Hormone (TSH)", value: tshVal, unit: "uIU/mL", normalRange: "0.4 - 4.2 uIU/mL", isAbnormal: Number(tshVal) > 4.2 },
      { parameter: "Total Triiodothyronine (T3)", value: t3Val, unit: "ng/mL", normalRange: "0.8 - 2.0 ng/mL", isAbnormal: Number(t3Val) < 0.8 || Number(t3Val) > 2.0 },
      { parameter: "Total Thyroxine (T4)", value: t4Val, unit: "ug/dL", normalRange: "5.1 - 14.1 ug/dL", isAbnormal: Number(t4Val) < 5.1 || Number(t4Val) > 14.1 }
    ];

    onUpdateLabResults(selectedLab.id, parsedResults, labNotes);
    alert("Diagnostic laboratory bio-indicators verified, logged, and status flagged Completed!");
  };

  return (
    <div className="flex-1 flex flex-col gap-6 h-full min-h-0" id="diagnostics-ipd-root">
      
      {/* Sub tabs selector */}
      <div className="flex border-b border-slate-200 shrink-0 text-xs">
        <button
          onClick={() => setActiveSubTab("lab")}
          className={`px-6 py-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeSubTab === "lab" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FlaskConical className="w-4 h-4 text-indigo-500" /> Laboratory Diagnostics
        </button>
        <button
          onClick={() => setActiveSubTab("radiology")}
          className={`px-6 py-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeSubTab === "radiology" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Image className="w-4 h-4 text-emerald-500" /> Radiology Scans
        </button>
        <button
          onClick={() => setActiveSubTab("ipd")}
          className={`px-6 py-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeSubTab === "ipd" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BedDouble className="w-4 h-4 text-rose-500" /> Inpatient Wards (IPD Allocation)
        </button>
      </div>

      {activeSubTab === "lab" && (
        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          {/* Left panel diagnostics log */}
          <div className="w-full md:w-5/12 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden max-h-full">
            <div className="p-4 border-b border-slate-100 shrink-0 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tenant Diagnostics register</h4>
              
              <form onSubmit={handleBookLabTest} className="flex gap-2 text-xs items-end">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] text-slate-450 block font-semibold text-slate-500">Book Test for:</span>
                  <select
                    value={selectedPatId}
                    onChange={(e) => setSelectedPatId(e.target.value)}
                    className="w-full p-1.5 border border-slate-100 rounded bg-white"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded flex items-center gap-1"
                >
                  Book Slot
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
              {labTests.map(test => (
                <div
                  key={test.id}
                  onClick={() => setSelectedLabId(test.id)}
                  className={`p-3 cursor-pointer transition-colors flex justify-between items-center ${
                    selectedLabId === test.id ? "bg-indigo-50/45 border-r-4 border-indigo-600" : "hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-800">{test.patientName}</div>
                    <div className="text-[10px] text-slate-450 text-slate-400 font-mono mt-0.5">{test.testName}</div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    test.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {test.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel results compiler */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 overflow-y-auto max-h-full">
            {selectedLab ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Specimen Analysis Compiler</span>
                  <h3 className="text-sm font-bold text-slate-805 text-slate-800">{selectedLab.testName}</h3>
                  <p className="text-xs text-slate-505 text-slate-500">Patient: <strong className="text-indigo-650 text-indigo-650">{selectedLab.patientName}</strong> • Category: {selectedLab.testCategory}</p>
                </div>

                {selectedLab.results && selectedLab.results.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-700">Lab biochemist parameter logs:</div>
                    <div className="border border-slate-100 bg-white shadow-xs rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                      {selectedLab.results.map((res, i) => (
                        <div key={i} className="px-4 py-3 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800">{res.parameter}</span>
                            <div className="text-[10px] text-slate-400 font-mono">Normal range: {res.normalRange}</div>
                          </div>

                          <div className="text-right">
                            <span className={`font-black font-mono text-sm ${res.isAbnormal ? "text-red-650 text-red-600" : "text-slate-800"}`}>
                              {res.value} {res.unit}
                            </span>
                            {res.isAbnormal && (
                              <span className="text-[8px] font-bold bg-red-100 text-red-700 border border-red-200 px-1 rounded block mt-0.5 uppercase">
                                Out of Range
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedLab.notes && (
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 text-xs text-left">
                        <strong>Technician Assessment Notes:</strong> <p className="mt-1 leading-relaxed font-semibold text-indigo-800">{selectedLab.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-xl max-w-md text-xs">
                    <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" /> Load Thyroid Blood specimen values
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">TSH (uIU/mL)</span>
                        <input
                          type="text" value={tshVal} onChange={e => setTshVal(e.target.value)}
                          className="w-full mt-1 border border-slate-250 p-1 bg-white font-black font-mono text-center text-rose-600 rounded text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">Total T3 (ng/mL)</span>
                        <input
                          type="text" value={t3Val} onChange={e => setT3Val(e.target.value)}
                          className="w-full mt-1 border border-slate-250 p-1 bg-white font-mono text-center text-slate-700 rounded text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">Total T4 (ug/dL)</span>
                        <input
                          type="text" value={t4Val} onChange={e => setT4Val(e.target.value)}
                          className="w-full mt-1 border border-slate-250 p-1 bg-white font-mono text-center text-slate-700 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[9px] text-slate-400 font-bold block">Pathologist clinic Remarks</span>
                      <textarea
                        value={labNotes} onChange={e => setLabNotes(e.target.value)}
                        placeholder="e.g. Subclincial hyperthyroidism detected, recommend clinical validation course."
                        className="w-full p-2 border border-slate-250 bg-white rounded outline-none h-16 text-xs"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleUpdateLabResults}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold p-2 rounded text-center block text-xs"
                    >
                      ✓ Validate Specimen Results & Flag Complete
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-slate-400 text-center">
                Please add or select a laboratory record to compile clinical reports.
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "radiology" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          {radiologyRecords.map(rec => (
            <div key={rec.id} className="bg-white border border-slate-220 border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs">{rec.patientName} ({rec.type})</h4>
                  <p className="text-[9px] text-slate-400 font-mono">Completed Date: {rec.date}</p>
                </div>
                <span className="p-1 text-[9px] font-bold bg-emerald-150 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  {rec.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <img
                  src={rec.imageUrl}
                  className="w-full h-24 object-cover rounded-md border border-slate-200 col-span-1 shadow-sm"
                  alt="Radiology scan visual"
                />

                <div className="col-span-2 space-y-2 text-[11px] leading-relaxed">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Technician Imaging Notes:</span>
                    <p className="text-slate-600 font-medium">{rec.technicianNotes}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-indigo-650 text-indigo-600 font-bold uppercase block">Radiologist Diagnosis:</span>
                    <p className="text-slate-900 font-bold">{rec.radiologistNotes}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === "ipd" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 text-xs">
          {ipdRecords.map(rec => (
            <div key={rec.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs">{rec.patName}</h4>
                  <span className="text-[9px] text-slate-400 font-mono">Admission Code: {rec.admissionNum}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Admitted: {rec.admissionDate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Assigned Location</span>
                  <div className="font-bold text-slate-700 mt-0.5">{rec.room} • {rec.bed}</div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Attending Clinician</span>
                  <div className="font-bold text-slate-700 mt-0.5">{rec.doctor}</div>
                </div>
              </div>

              {/* vitals log history */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] text-red-500 font-black uppercase tracking-wider block">Nursing vitals logs</span>
                <div className="border border-slate-100 rounded-md overflow-hidden text-[10px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[8px]">
                      <tr>
                        <th className="p-1.5">Timestamp</th>
                        <th className="p-1.5">BP (mmHg)</th>
                        <th className="p-1.5">Temp (°F)</th>
                        <th className="p-1.5">Pulse (BPM)</th>
                        <th className="p-1.5">SpO2</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rec.vitalsHistory.map((vit, index) => (
                        <tr key={index} className="font-medium text-slate-700 font-mono">
                          <td className="p-1.5 text-slate-400 font-sans">{vit.date}</td>
                          <td className="p-1.5 font-bold text-rose-500">{vit.bp}</td>
                          <td className="p-1.5 font-bold">{vit.temp}</td>
                          <td className="p-1.5">{vit.hr}</td>
                          <td className="p-1.5 font-bold text-emerald-600">{vit.spo2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] leading-relaxed text-slate-600 text-left">
                <strong>Assigned Diet Chart:</strong> <p className="mt-0.5 font-semibold text-slate-800">{rec.dietPlan}</p>
                <div className="h-px bg-slate-200 my-1.5"></div>
                <strong>Nursing shift Notes:</strong> <p className="mt-0.5 italic">{rec.shiftNotes}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
