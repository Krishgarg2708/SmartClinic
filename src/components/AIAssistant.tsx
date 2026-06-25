import React, { useState } from "react";
import { Sparkles, Brain, Search, HelpCircle, Activity, Heart, ShieldAlert, Cpu } from "lucide-react";
import { Patient, Appointment, Medicine } from "../types";

interface AIAssistantProps {
  currentClinicId: string;
  patients: Patient[];
  appointments: Appointment[];
  medicines: Medicine[];
}

export default function AIAssistant({ currentClinicId, patients, appointments, medicines }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<"copilot" | "analysis" | "search">("copilot");
  const [notesInput, setNotesInput] = useState("");
  const [analysisInput, setAnalysisInput] = useState("");
  const [analysisType, setAnalysisType] = useState<"ocr" | "report" | "interaction" | "prescription">("report");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick prompt presets
  const handlePresetAnalysis = (text: string, type: typeof analysisType) => {
    setAnalysisInput(text);
    setAnalysisType(type);
  };

  const handleRunAnalysis = async () => {
    if (!analysisInput.trim()) {
      setError("Please paste or type content to analyze first.");
      return;
    }
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: analysisInput, type: analysisType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.text);
    } catch (err: any) {
      setError(err?.message || "Gemini API could not be reached.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunCopilot = async (command: string) => {
    if (!notesInput.trim()) {
      setError("Please type some rough doctor draft or dictation notes first.");
      return;
    }
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await fetch("/api/gemini/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, notesText: notesInput }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.text);
    } catch (err: any) {
      setError(err?.message || "Copilot command execution failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunNLSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please formulate a clinical query (e.g., 'diabetic patients over 40').");
      return;
    }
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      // Package contextual tables for Gemini evaluation
      const tablesContext = {
        patients: patients.map(p => ({ id: p.patientId, name: p.name, age: p.age, gender: p.gender, chronic: p.chronicDiseases, allergies: p.allergies })),
        appointments: appointments.map(a => ({ id: a.id, patientName: a.patientName, date: a.date, doc: a.doctorName, status: a.status })),
        medicines: medicines.map(m => ({ name: m.name, generic: m.genericName, stock: m.currentStock, min: m.minimumStock, mrp: m.mrp }))
      };

      const res = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, tableContext: tablesContext }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.text);
    } catch (err: any) {
      setError(err?.message || "Intelligent search query failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full" id="ai-assistant-root">
      {/* Header Banner */}
      <div className="bg-indigo-950 p-4 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">Enterprise intelligence</div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1">Gemini Pro Medical Copilot</h3>
          </div>
        </div>
        <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-mono border border-indigo-500/20">v3.5 Flash</span>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-slate-100 bg-slate-50 shrink-0 text-xs">
        <button
          onClick={() => { setActiveTab("copilot"); setOutput(""); setError(null); }}
          className={`flex-1 py-3 text-center font-semibold border-b-2 transition-all ${
            activeTab === "copilot" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Clinical Dictation Copilot
        </button>
        <button
          onClick={() => { setActiveTab("analysis"); setOutput(""); setError(null); }}
          className={`flex-1 py-3 text-center font-semibold border-b-2 transition-all ${
            activeTab === "analysis" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Report Simplifiers
        </button>
        <button
          onClick={() => { setActiveTab("search"); setOutput(""); setError(null); }}
          className={`flex-1 py-3 text-center font-semibold border-b-2 transition-all ${
            activeTab === "search" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          AI Clinician Search
        </button>
      </div>

      {/* Panel Workspace */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {activeTab === "copilot" && (
          <div className="space-y-3">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unstructured Transcripts / Quick Doctor Notes</div>
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Paste rough speech transcriber notes or quick typing drafts (e.g. 'Patient 34F Sunita Devi arrived with sore throat, heavy wheezing, history of childhood asthma. bp 140/90. prescribe pan-d empty stomach plus montair course for 5 days. reschedule 1 week.')"
              className="w-full h-24 p-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
            
            <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
              <button
                disabled={loading}
                onClick={() => handleRunCopilot("Compile structured clinical SOAP note")}
                className="p-2 border border-slate-200 rounded-lg font-bold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
              >
                📝 Format SOAP Note
              </button>
              <button
                disabled={loading}
                onClick={() => handleRunCopilot("Generate prescription plan & advice details")}
                className="p-2 border border-slate-200 rounded-lg font-bold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
              >
                💊 Draft Prescriptions
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed italic text-center">
              💡 Tip: Clinical speech-to-text dictation allows you to record standard patient symptoms hands-free and transcribe them instantly.
            </p>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Text Analyzer</span>
              <select
                value={analysisType}
                onChange={(e: any) => setAnalysisType(e.target.value)}
                className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-600 outline-none"
              >
                <option value="report">Blood / Lab Report Simplifier</option>
                <option value="ocr">Prescription OCR Digitizer</option>
                <option value="interaction">Drug Interaction Evaluator</option>
                <option value="prescription">Explain Prescribed Medicines</option>
              </select>
            </div>

            <textarea
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Paste lab reports, blood panels, medicine list, or handwritten diagnostic content..."
              className="w-full h-24 p-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />

            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Preset Samples</div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetAnalysis("TSH: 5.82 uIU/mL (Normal 0.4 - 4.2), Total T3: 1.25 ng/mL (Normal 0.8 - 2.0), Total T4: 7.8 ug/dL", "report")}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded"
                >
                  Thyroid Blood Panel
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetAnalysis("Check together: Telmisartan 40mg (BP) + Amlodipine 5mg + Pantoprazole 40mg + Aspirin 150mg daily", "interaction")}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded"
                >
                  Drug Interaction Check
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetAnalysis("Rx: Tab Telma-AM 1 strip morning after breakfast. Tab Pan-D afternoon meal empty stomach 10 days.", "prescription")}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded"
                >
                  Rx Explainer
                </button>
              </div>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: loading ? "2s" : "0s" }} />
              {loading ? "Processing Clinical Intelligence..." : "Begin AI Simplification"}
            </button>
          </div>
        )}

        {activeTab === "search" && (
          <div className="space-y-3">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Natural Language Clinician Queries</div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 'Show hypertension or diabetic patients'"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  onKeyDown={(e) => e.key === "Enter" && handleRunNLSearch()}
                />
              </div>
              <button
                onClick={handleRunNLSearch}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 font-bold rounded-lg"
              >
                Ask SmartSearch
              </button>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
              <div className="text-[10px] font-bold text-indigo-900 uppercase flex items-center gap-1 mb-1">
                <Heart className="w-3 h-3 text-indigo-500" />
                Query Capabilities Includes:
              </div>
              <p className="text-[10px] text-indigo-800 leading-relaxed">
                SmartClinic AI can contextually query current patient lists, pending appointment queues, and drug inventory levels instantly using relative parameters.
              </p>
            </div>
          </div>
        )}

        {/* Output Console */}
        {(output || error || loading) && (
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 min-h-24 flex flex-col space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <span>SmartClinic AI Consultation Output</span>
              <span>Live</span>
            </div>
            
            {loading && (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400 text-xs text-center space-y-2">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div>Generating final clinical assessment data...</div>
              </div>
            )}

            {error && (
              <div className="p-2 border border-red-200 bg-red-50 rounded text-red-700 text-xs font-medium flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            {output && !loading && (
              <div className="text-xs text-slate-800 leading-relaxed prose prose-sm max-w-none font-sans whitespace-pre-wrap">
                {output}
              </div>
            )}
            
            {!loading && output && (
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic">
                ⚠️ Disclaimer: SmartClinic AI Assistant works strictly as an auxiliary aid. All clinical decisions, prescriptions, and diagnostics are explicitly subject to credentialed physician validation and approval.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
