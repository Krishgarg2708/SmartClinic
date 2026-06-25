import React, { useState } from "react";
import { 
  Pill, Search, Filter, Plus, ShieldAlert, Award, FileText, CheckCircle, 
  Trash2, RefreshCw, Layers, Bell, ArrowUpRight, TrendingDown, DollarSign
} from "lucide-react";
import { Medicine, Supplier } from "../types";

interface LogisticsInventoryProps {
  medicines: Medicine[];
  suppliers: Supplier[];
  onUpdateMedicineStock: (id: string, newStock: number) => void;
  onAddMedicineStock: (id: string, amount: number) => void;
  onAddMedicine: (med: Medicine) => void;
}

export default function LogisticsInventory({ 
  medicines, suppliers, onUpdateMedicineStock, onAddMedicineStock, onAddMedicine 
}: LogisticsInventoryProps) {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedMedId, setSelectedMedId] = useState<string | null>(medicines[0]?.id || null);

  // Form states to ADD NEW medicine
  const [showAddModal, setShowAddModal] = useState(false);
  const [mName, setMName] = useState("");
  const [mGen, setMGen] = useState("");
  const [mBrand, setMBrand] = useState("");
  const [mMan, setMMan] = useState("");
  const [mCat, setMCat] = useState<Medicine["category"]>("Tablet");
  const [mStrength, setMStrength] = useState("500mg");
  const [mPPrice, setMPPrice] = useState(100);
  const [mSPrice, setMSPrice] = useState(150);
  const [mMrp, setMMrp] = useState(180);
  const [mBatch, setMBatch] = useState("BATCH-A");
  const [mExpiry, setMExpiry] = useState("2027-12-31");
  const [mMinStock, setMMinStock] = useState(100);
  const [mCurStock, setMCurStock] = useState(250);
  const [mRack, setMRack] = useState("A-01");

  // Dispensary simulator state
  const [dispenseQty, setDispenseQty] = useState(10);

  const filteredMeds = medicines.filter(m => {
    const sTerm = searchTerm.toLowerCase();
    const matchesSearch = m.name.toLowerCase().includes(sTerm) || m.genericName.toLowerCase().includes(sTerm);
    const matchesCat = categoryFilter === "All" || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const selectedMed = medicines.find(m => m.id === selectedMedId);

  // Derive Statistics
  const lowStockAlerts = medicines.filter(m => m.currentStock <= m.minimumStock);
  const totalSkuCount = medicines.length;

  const handleDispense = () => {
    if (!selectedMed) return;
    if (selectedMed.currentStock < dispenseQty) {
      alert("Insufficient inventory left in the rack batch!");
      return;
    }
    const finalNewStock = selectedMed.currentStock - dispenseQty;
    onUpdateMedicineStock(selectedMed.id, finalNewStock);
    alert(`Successfully dispensed ${dispenseQty} units of ${selectedMed.name}, adjusting inventory stock log.`);
  };

  const handleReceiveStock = (amount: number) => {
    if (!selectedMed) return;
    onAddMedicineStock(selectedMed.id, amount);
    alert(`Stock augmented: Added ${amount} units for Brand ${selectedMed.name}.`);
  };

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mGen) {
      alert("Please specify Medicine Name and Generic Active compound!");
      return;
    }

    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      clinicId: "clinic-1",
      name: mName,
      genericName: mGen,
      brand: mBrand || "A-Pharma Ltd",
      manufacturer: mMan || "Generic Pharmaceuticals",
      category: mCat,
      dosageForm: mCat,
      strength: mStrength,
      purchasePrice: Number(mPPrice),
      sellingPrice: Number(mSPrice),
      mrp: Number(mMrp),
      batchNumber: mBatch,
      expiryDate: mExpiry,
      rackNumber: mRack || "A-01",
      minimumStock: Number(mMinStock),
      currentStock: Number(mCurStock),
      maximumStock: Number(mCurStock) * 2
    };

    onAddMedicine(newMed);
    setSelectedMedId(newMed.id);
    setShowAddModal(false);

    // Reset forms
    setMName("");
    setMGen("");
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 h-full min-h-0" id="logistics-inventory-root">
      
      {/* LEFT COLUMN: STOCK DIRECTORY LIST (5/12) */}
      <div className="w-full xl:w-5/12 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden max-h-full">
        <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-slate-800">
              <Pill className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm tracking-tight">Pharmacy Drug Ledger</h3>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-[11px] py-1 px-2.5 rounded-md flex items-center gap-1 transition-all"
            >
              Add New Medicine
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 text-xs">
              <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chemistry compound, brand name..."
                className="w-full pl-7 pr-2 py-1.5 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-200 rounded p-1 text-[11px] bg-slate-50 text-slate-600 font-semibold"
            >
              <option value="All">All types</option>
              <option value="Tablet">Tablets</option>
              <option value="Capsule">Capsules</option>
              <option value="Syrup">Syrups</option>
              <option value="Injection">Injections</option>
            </select>
          </div>
        </div>

        {/* Medicines lists */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          {filteredMeds.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              No matching medication found.
            </div>
          ) : (
            filteredMeds.map((med) => {
              const isLow = med.currentStock <= med.minimumStock;
              return (
                <div
                  key={med.id}
                  onClick={() => setSelectedMedId(med.id)}
                  className={`p-3 cursor-pointer transition-colors flex justify-between items-center ${
                    selectedMedId === med.id ? "bg-indigo-50/50 border-r-4 border-indigo-600" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{med.name}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-505 text-slate-500 font-normal px-1 rounded">
                        {med.strength} • {med.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono block truncate max-w-xs">{med.genericName}</p>
                    <p className="text-[9px] text-slate-500">Rack location: <strong className="text-slate-700">{med.rackNumber || "Unassigned"}</strong></p>
                  </div>

                  <div className="text-right flex flex-col items-end space-y-1">
                    <div className={`font-mono font-black text-xs ${isLow ? "text-red-500 animate-pulse" : "text-slate-850"}`}>
                      {med.currentStock} Units
                    </div>
                    {isLow && (
                      <span className="text-[8px] bg-red-100 text-red-700 border border-red-200 font-bold px-1 py-0.5 rounded uppercase">
                        Low Stock Alert
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 bg-indigo-950 text-indigo-200 text-[10px] flex items-center justify-between shrink-0 font-mono">
          <span>Active SKUs: {totalSkuCount}</span>
          <span className="text-rose-400 font-bold">{lowStockAlerts.length} Warnings Pending</span>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTION & DETAIL VIEW (7/12) */}
      <div className="flex-grow bg-white rounded-xl border border-slate-200 overflow-y-auto max-h-full p-6 space-y-6">
        
        {selectedMed ? (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Drug Detail Card</div>
              <h2 className="text-base font-black text-slate-850">{selectedMed.name}</h2>
              <p className="text-xs text-indigo-650 text-indigo-600 font-bold">{selectedMed.genericName}</p>
              
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold py-0.5 px-2 rounded">
                  Category: {selectedMed.category}
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold py-0.5 px-2 rounded font-mono">
                  Batch: {selectedMed.batchNumber}
                </span>
                <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-700 font-semibold py-0.5 px-2 rounded">
                  Expiry date: {selectedMed.expiryDate}
                </span>
              </div>
            </div>

            {/* Financial analysis */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-lg text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Retail Price (MRP)</span>
                <span className="text-sm font-bold text-slate-800">₹{selectedMed.mrp}</span>
              </div>
              <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-lg text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Selling Price (SP)</span>
                <span className="text-sm font-bold text-emerald-600">₹{selectedMed.sellingPrice}</span>
              </div>
              <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-lg text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Acquisition cost</span>
                <span className="text-sm font-bold text-slate-600">₹{selectedMed.purchasePrice}</span>
              </div>
            </div>

            {/* Dispense Simulator Engine */}
            <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Direct Prescription Dispenser</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Dispense units to patient profiles immediately. This action reduces inventory counts dynamically.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(Number(e.target.value))}
                  className="w-16 p-1 bg-white border border-slate-250 border-slate-200 outline-none rounded font-bold text-center text-xs"
                />
                <button
                  type="button"
                  onClick={handleDispense}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold text-white py-1 px-3 rounded text-xs text-center block"
                >
                  Confirm Dispense Sale
                </button>
              </div>
            </div>

            {/* Augment Stock Batch Tool */}
            <div className="p-4 border border-indigo-150 border-indigo-100 bg-indigo-50/10 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <h4 className="font-extrabold text-xs text-indigo-950">AUGMENT INCOMING STOCK</h4>
                <p className="text-[10px] text-indigo-805 text-indigo-750 leading-relaxed text-indigo-700">
                  Augment inventory with a newly arrived delivery pack from the licensed drug distributor.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleReceiveStock(100)}
                  className="flex-1 bg-slate-850 bg-slate-800 hover:bg-slate-900 border text-white font-extrabold p-2 rounded text-xs text-center"
                >
                  + Add 100 Units
                </button>
                <button
                  onClick={() => handleReceiveStock(500)}
                  className="flex-1 bg-slate-850 bg-slate-800 hover:bg-slate-900 border text-white font-extrabold p-2 rounded text-xs text-center"
                >
                  + Add 500 Units
                </button>
              </div>
            </div>

            {/* Supplier Information Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Assigned Licensed Supplier</h4>
              
              <div className="divide-y divide-slate-100 border border-slate-200 bg-white shadow-xs rounded-xl p-4">
                {suppliers.slice(0, 1).map((sup) => (
                  <div key={sup.id} className="text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-800">{sup.companyName}</strong>
                      <span className="text-[10px] font-bold text-indigo-600">Active Supplier Partner</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                      <div>Contact: <strong>{sup.contactPerson}</strong></div>
                      <div>Phone: <strong>{sup.phone}</strong></div>
                      <div>Email: <strong>{sup.email}</strong></div>
                      <div>GST Code: <strong>{sup.gstNumber || "N/A"}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Pending Payable Balance:</span>
                      <strong className="text-red-600 text-xs font-bold">₹{sup.outstandingAmount}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center text-slate-400">
            No medicine directory item loaded. Add items or click below.
          </div>
        )}
      </div>

      {/* POPUP MODAL: ADD MEDICINE STOCK FILE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Create New Pharma Stock Card</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:text-slate-300 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateMedicine} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Medicine Name *</label>
                  <input
                    type="text" required placeholder="e.g. Paracetamol"
                    value={mName} onChange={e => setMName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Chemical compound *</label>
                  <input
                    type="text" required placeholder="e.g. Acetaminophen 500mg"
                    value={mGen} onChange={e => setMGen(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Category</label>
                  <select
                    value={mCat} onChange={e => setMCat(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded bg-white outline-none"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Strength (mg)</label>
                  <input
                    type="text" value={mStrength} onChange={e => setMStrength(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded outline-none font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Acquisition Price (₹)</label>
                  <input
                    type="number" value={mPPrice} onChange={e => setMPPrice(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Selling Price (₹)</label>
                  <input
                    type="number" value={mSPrice} onChange={e => setMSPrice(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Batch Code</label>
                  <input
                    type="text" value={mBatch} onChange={e => setMBatch(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Expiry Date</label>
                  <input
                    type="date" value={mExpiry} onChange={e => setMExpiry(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Stock rack position</label>
                  <input
                    type="text" value={mRack} onChange={e => setMRack(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded outline-none font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 block uppercase font-mono">Current level</span>
                    <input
                      type="number" value={mCurStock} onChange={e => setMCurStock(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 block uppercase font-mono">Threshold min limit</span>
                    <input
                      type="number" value={mMinStock} onChange={e => setMMinStock(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 font-bold text-white rounded-lg hover:bg-indigo-700"
                >
                  Validate Stock Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
