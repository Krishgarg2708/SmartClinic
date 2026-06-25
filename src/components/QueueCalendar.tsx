import React, { useState } from "react";
import { 
  CalendarDays, Clock, UserPlus, FileText, CheckCircle, RefreshCw, Layers, ShieldAlert, AlertCircle, PlayCircle, ToggleRight
} from "lucide-react";
import { Patient, Doctor, Appointment, AppointmentStatus } from "../types";

interface QueueCalendarProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  onAddAppointment: (app: Appointment) => void;
  onUpdateAppStatus: (id: string, status: AppointmentStatus) => void;
}

export default function QueueCalendar({ appointments, patients, doctors, onAddAppointment, onUpdateAppStatus }: QueueCalendarProps) {
  const [viewDate, setViewDate] = useState("2026-06-20");
  const [filterDocId, setFilterDocId] = useState("All");
  const [showBookModal, setShowBookModal] = useState(false);

  // Form states
  const [selectedPatId, setSelectedPatId] = useState(patients[0]?.id || "");
  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || "");
  const [appType, setAppType] = useState<Appointment["type"]>("OPD");
  const [appTimeSlot, setAppTimeSlot] = useState("09:30 - 09:45");
  const [chiefComplaint, setChiefComplaint] = useState("");

  const filteredApps = appointments.filter((app) => {
    const matchesDate = app.date === viewDate;
    const matchesDoc = filterDocId === "All" || app.doctorId === filterDocId;
    return matchesDate && matchesDoc;
  });

  const nextToken = appointments.length > 0 ? Math.max(...appointments.map(a => a.tokenNumber)) + 1 : 101;

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedPatId);
    const doc = doctors.find(d => d.id === selectedDocId);

    if (!pat || !doc) {
      alert("Please select a valid Patient & Doctor");
      return;
    }

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      clinicId: "clinic-1",
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      doctorId: doc.id,
      doctorName: doc.name,
      date: viewDate,
      timeSlot: appTimeSlot,
      tokenNumber: nextToken,
      status: AppointmentStatus.WAITING,
      type: appType,
      chiefComplaint: chiefComplaint || "Routine consultation and clinical exam",
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newApp);
    setShowBookModal(false);
    setChiefComplaint("");
  };

  const getStatusStyle = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.WAITING:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case AppointmentStatus.CONSULTING:
        return "bg-amber-100 text-amber-800 border-amber-200 animate-pulse";
      case AppointmentStatus.COMPLETED:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case AppointmentStatus.MISSED:
        return "bg-slate-100 text-slate-500 border-slate-200";
      case AppointmentStatus.CANCELLED:
        return "bg-red-150 text-red-700 bg-red-100 border-red-200";
    }
  };

  // Derived Statistics
  const activeConsulting = filteredApps.find(a => a.status === AppointmentStatus.CONSULTING);
  const totalInQueue = filteredApps.length;
  const waitingCount = filteredApps.filter(a => a.status === AppointmentStatus.WAITING).length;
  const completedCount = filteredApps.filter(a => a.status === AppointmentStatus.COMPLETED).length;

  return (
    <div className="flex-1 flex flex-col gap-6" id="queue-calendar-root">
      
      {/* Dynamic Queue Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 shrink-0">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue Focus</span>
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
          </div>
          <div className="text-xl font-bold text-slate-800">
            {activeConsulting ? `#${activeConsulting.tokenNumber}` : "None"}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 truncate">
            {activeConsulting ? `Now Calling: ${activeConsulting.patientName}` : "No active consultation"}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Scheduled</span>
          <div className="text-xl font-bold text-slate-800">{totalInQueue}</div>
          <p className="text-[10px] text-slate-500 mt-1">Appointments for {viewDate}</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patients Waiting</span>
          <div className="text-xl font-bold text-blue-600">{waitingCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Ready for screening</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Sessions</span>
          <div className="text-xl font-bold text-emerald-600">{completedCount}</div>
          <p className="text-[10px] text-slate-505 text-slate-500 mt-1">Billing requests raised</p>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Schedule Board */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden max-h-full">
          <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
            
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-800">Physicians Queue System</h3>
                <p className="text-[10px] text-slate-500">Scheduled slots ledger</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <input
                type="date"
                value={viewDate}
                onChange={(e) => setViewDate(e.target.value)}
                className="border border-slate-200 bg-white px-2 py-1 rounded outline-none text-slate-600"
              />
              <select
                value={filterDocId}
                onChange={(e) => setFilterDocId(e.target.value)}
                className="border border-slate-200 bg-white px-2 py-1 rounded outline-none text-slate-600 font-semibold"
              >
                <option value="All">All Doctors</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <button
                onClick={() => setShowBookModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white px-3 py-1 rounded"
              >
                + New Slip
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredApps.length === 0 ? (
              <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                <Clock className="w-8 h-8 text-slate-350 stroke-1" />
                <div>No appointments booked for {viewDate}.</div>
                <button
                  type="button"
                  onClick={() => setShowBookModal(true)}
                  className="text-indigo-600 font-bold underline"
                >
                  Create an Appointment Walk-in Token
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="p-4 font-bold">Token ID</th>
                    <th className="p-4 font-bold">Patient Demographics</th>
                    <th className="p-4 font-bold">Allocated Physician</th>
                    <th className="p-4 font-bold">Mode & Slit</th>
                    <th className="p-4 font-bold">Queue Status</th>
                    <th className="p-4 font-bold text-right">Consulting Directives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600">
                        #{app.tokenNumber}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{app.patientName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Ph: {app.patientPhone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{app.doctorName}</div>
                        <div className="text-[10px] text-slate-400 block truncate max-w-xs">{app.chiefComplaint}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[9px] rounded uppercase block w-max mb-1">
                          {app.type}
                        </span>
                        <span className="text-[10px] text-slate-505 text-slate-500">{app.timeSlot}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase ${getStatusStyle(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1 px-1">
                          {app.status === AppointmentStatus.WAITING && (
                            <button
                              onClick={() => onUpdateAppStatus(app.id, AppointmentStatus.CONSULTING)}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold py-1 px-2 rounded flex items-center gap-0.5"
                            >
                              <PlayCircle className="w-3.5 h-3.5" /> Call In
                            </button>
                          )}
                          {app.status === AppointmentStatus.CONSULTING && (
                            <button
                              onClick={() => onUpdateAppStatus(app.id, AppointmentStatus.COMPLETED)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1 px-2 rounded"
                            >
                              ✓ Complete
                            </button>
                          )}
                          {app.status !== AppointmentStatus.COMPLETED && app.status !== AppointmentStatus.CANCELLED && (
                            <button
                              onClick={() => onUpdateAppStatus(app.id, AppointmentStatus.CANCELLED)}
                              className="border border-red-200 text-red-600 hover:bg-red-50 text-[10px] px-1.5 py-1 rounded"
                            >
                              ✕ Drop
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Doctor Availability Ledger */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs max-h-full overflow-y-auto space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Today's Doctor Duty roster</h4>

          <div className="space-y-3">
            {doctors.map((doc) => {
              const countForDoc = filteredApps.filter(a => a.doctorId === doc.id).length;
              return (
                <div key={doc.id} className="p-3 border border-slate-100 rounded-lg space-y-2">
                  <div className="flex gap-2.5">
                    <img
                      src={doc.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      alt={doc.name}
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-800">{doc.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{doc.specialization}</div>
                      <p className="text-[9px] text-indigo-600 font-bold uppercase mt-0.5">Fee: ₹{doc.consultationFee}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[10px]">
                    <span className="text-slate-500">Scheduled Queue:</span>
                    <span className="font-bold text-slate-705 text-slate-700 bg-slate-100 px-1.5 rounded">{countForDoc} patients</span>
                  </div>

                  <div className="text-[9px] text-slate-400 font-mono">
                    Shift: {doc.availability.startTime} - {doc.availability.endTime} (Break: {doc.availability.breakStartTime} - {doc.availability.breakEndTime})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* APPOINTMENT BOOKING DIALOG */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Raise Walking Slot / Booking Token</h3>
              <button onClick={() => setShowBookModal(false)} className="text-white hover:text-slate-300 font-bold">✕</button>
            </div>

            <form onSubmit={handleBookAppointment} className="p-5 space-y-4 text-xs">
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
                <label className="font-bold text-slate-600">Select Attending Specialist *</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md outline-none bg-white font-medium"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Referral Mode</label>
                  <select
                    value={appType}
                    onChange={(e: any) => setAppType(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none bg-white"
                  >
                    <option value="OPD">OPD Clinic</option>
                    <option value="Walk-In">Walk-In Immediate</option>
                    <option value="Telemedicine">Telemedicine Video</option>
                    <option value="Emergency">⚠️ Emergency Trariage</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Scheduled Slot</label>
                  <select
                    value={appTimeSlot}
                    onChange={(e) => setAppTimeSlot(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md outline-none bg-white font-mono"
                  >
                    <option value="09:00 - 09:15">09:00 AM</option>
                    <option value="09:30 - 09:45">09:30 AM</option>
                    <option value="10:15 - 10:30">10:15 AM</option>
                    <option value="11:00 - 11:15">11:00 AM</option>
                    <option value="12:30 - 12:45">12:30 PM</option>
                    <option value="15:00 - 15:15">03:00 PM</option>
                    <option value="16:15 - 16:30">04:15 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Chief Clinical Complaint / Symptoms</label>
                <textarea
                  placeholder="e.g. Cough, sore throat, running fever for 3 days, diabetic evaluation check..."
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md h-16 outline-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-2.5 flex items-start gap-1.5 text-[10px] text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Confirming raises dynamic Token <strong>#{nextToken}</strong> that overrides standard queue metrics for automated wait calculation. SMS/WhatsApp alerts will propagate immediately.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 font-semibold rounded-lg"
                >
                  Quit
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 font-bold text-white rounded-lg hover:bg-indigo-700"
                >
                  Generate Token Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
