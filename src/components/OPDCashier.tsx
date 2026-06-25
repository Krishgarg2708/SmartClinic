import React, { useState } from "react";
import { 
  CreditCard, IndianRupee, Search, Filter, Plus, Printer, Download, Sparkles, CheckSquare, 
  Trash2, FileText, CheckCircle, ShieldAlert, BadgeInfo, Check, RefreshCw
} from "lucide-react";
import { Patient, Invoice, BillItem } from "../types";

interface OPDCashierProps {
  invoices: Invoice[];
  patients: Patient[];
  onAddInvoice: (inv: Invoice) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice["status"]) => void;
}

export default function OPDCashier({ invoices, patients, onAddInvoice, onUpdateInvoiceStatus }: OPDCashierProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatId, setSelectedPatId] = useState<string>(patients[0]?.id || "");
  const [showUPIDialog, setShowUPIDialog] = useState(false);
  const [viewInvoiceId, setViewInvoiceId] = useState<string | null>(invoices[0]?.id || null);

  // Form states for NEW invoice itemizer
  const [items, setItems] = useState<BillItem[]>([]);
  const [currentItemName, setCurrentItemName] = useState("Consultation");
  const [currentItemType, setCurrentItemType] = useState<BillItem["type"]>("Consultation");
  const [currentItemPrice, setCurrentItemPrice] = useState(600);
  const [currentItemQty, setCurrentItemQty] = useState(1);

  const [discount, setDiscount] = useState(0);
  const [gstPercent, setGstPercent] = useState(5); // 5% CGST+SGST default on medical care
  const [paymentMode, setPaymentMode] = useState<Invoice["paymentMode"]>("UPI");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedInvoice = invoices.find(i => i.id === viewInvoiceId);

  // Calc metrics
  const calculatedSubTotal = items.reduce((acc, current) => acc + current.totalPrice, 0);
  const calculatedGst = parseFloat(((calculatedSubTotal * gstPercent) / 100).toFixed(2));
  const preFinal = calculatedSubTotal - discount + calculatedGst;
  const calculatedRoundOff = parseFloat((Math.round(preFinal) - preFinal).toFixed(2));
  const calculatedTotal = Math.round(preFinal);

  const handleAddItemToInvoice = () => {
    if (!currentItemName) return;
    const newItem: BillItem = {
      id: `item-${Date.now()}`,
      name: currentItemName,
      type: currentItemType,
      quantity: Number(currentItemQty),
      unitPrice: Number(currentItemPrice),
      totalPrice: Number(currentItemPrice) * Number(currentItemQty)
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Please add at least 1 charge line item!");
      return;
    }

    const pat = patients.find(p => p.id === selectedPatId);
    if (!pat) {
      alert("Selected Patient not found");
      return;
    }

    const autoInvId = `SC-INV-100${invoices.length + 24}`;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceId: autoInvId,
      clinicId: "clinic-1",
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      date: new Date().toISOString().split("T")[0],
      items,
      subTotal: calculatedSubTotal,
      discount,
      gst: calculatedGst,
      roundOff: calculatedRoundOff,
      total: calculatedTotal,
      paidAmount: paymentMode === "UPI" ? 0 : calculatedTotal, // UPI is pending until they scan
      status: paymentMode === "UPI" ? "Pending" : "Paid",
      paymentMode,
      createdAt: new Date().toISOString()
    };

    onAddInvoice(newInv);
    setViewInvoiceId(newInv.id);
    setItems([]);
    setDiscount(0);

    if (paymentMode === "UPI") {
      setShowUPIDialog(true);
    } else {
      alert(`Invoice ${autoInvId} raised successfully!`);
    }
  };

  // Derive Summary stats
  const totalReceivedRevenue = invoices
    .filter(i => i.status === "Paid")
    .reduce((acc, cur) => acc + cur.total, 0);

  const totalOutstanding = invoices
    .filter(i => i.status === "Pending")
    .reduce((acc, cur) => acc + cur.total, 0);

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full min-h-0" id="opd-cashier-root">
      
      {/* LEFT PANEL: RAISE BILL FORM */}
      <div className="w-full lg:w-7/12 bg-white rounded-xl border border-slate-200 overflow-y-auto max-h-full p-6 space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-800">
            <IndianRupee className="w-5 h-5 text-indigo-650 text-indigo-600" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">Raise OPD Consultation Invoice</h3>
              <p className="text-[10px] text-slate-450">Itemize diagnostic bills, medicines sales, and procedures</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
          {/* Patient select and billing terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Select Patient File *</label>
              <select
                value={selectedPatId}
                onChange={(e) => setSelectedPatId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded outline-none bg-white font-medium"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600">Preferred payment gateway</label>
              <select
                value={paymentMode}
                onChange={(e: any) => setPaymentMode(e.target.value)}
                className="w-full p-2 border border-slate-100 rounded outline-none bg-white font-bold text-indigo-600"
              >
                <option value="UPI">Insta-UPI (Generate Dynamic QR)</option>
                <option value="Cash">Direct Cash Handover</option>
                <option value="Card">POS Credit/Debit Terminal</option>
                <option value="Net Banking">IMPS / Net Banking transfer</option>
              </select>
            </div>
          </div>

          {/* Add Line Items Workspace */}
          <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/30">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Line Item compiler</div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Line Classification</span>
                <select
                  value={currentItemType}
                  onChange={(e: any) => setCurrentItemType(e.target.value)}
                  className="w-full p-1.5 border border-slate-200 bg-white"
                >
                  <option value="Consultation">Doctor Consultation</option>
                  <option value="Procedure">Procedure / Nursing</option>
                  <option value="Medicine">Prescribed Medicines</option>
                  <option value="LabTest">Laboratory Diagnostics</option>
                  <option value="Radiology">Radiology Scan</option>
                  <option value="Other">Standard Utility fee</option>
                </select>
              </div>

              <div className="space-y-1 col-span-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Item Description / code Name</span>
                <input
                  type="text" value={currentItemName} onChange={e => setCurrentItemName(e.target.value)}
                  placeholder="e.g. ECG Scan charges"
                  className="w-full p-1.5 border border-slate-200 rounded bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Unit Price (₹)</span>
                <input
                  type="number" value={currentItemPrice} onChange={e => setCurrentItemPrice(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-200 rounded bg-white font-semibold"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAddItemToInvoice}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 rounded transition-all"
                >
                  + Add Line
                </button>
              </div>
            </div>

            {/* Compiled line items list */}
            {items.length > 0 && (
              <div className="border border-slate-200 bg-white rounded divide-y divide-slate-100 overflow-hidden">
                {items.map((it, i) => (
                  <div key={i} className="px-3 py-2 flex items-center justify-between font-medium">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800">{it.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono">Classification: {it.type} • Price: ₹{it.unitPrice}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">₹{it.totalPrice}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calculator Calculations Panel */}
          <div className="grid grid-cols-2 gap-4 pb-2">
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Applied Discount (Coupon / Waived) (₹)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(Number(e.target.value))}
                  placeholder="₹0"
                  className="w-full p-2 border border-slate-200 rounded-md outline-none bg-white font-bold text-red-650 text-red-600"
                />
              </div>
              
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Standard Healthcare GST (%)</label>
                <select
                  value={gstPercent}
                  onChange={e => setGstPercent(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 bg-white outline-none rounded-md"
                >
                  <option value={0}>0% Tax (Govt Waived)</option>
                  <option value={5}>5% CGST+SGST (Default Care)</option>
                  <option value={12}>12% Medical Consumables</option>
                  <option value={18}>18% Luxury Ward admissions</option>
                </select>
              </div>
            </div>

            {/* Calculations summaries */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-right flex flex-col justify-between shrink-0">
              <div className="space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Receipt Total</div>
                <div className="text-xs text-slate-500 font-medium">Sub-total: ₹{calculatedSubTotal}</div>
                <div className="text-xs text-slate-500 font-medium">Discount Code: - ₹{discount}</div>
                <div className="text-xs text-indigo-650 text-indigo-600 font-medium">GST Tax Line: + ₹{calculatedGst}</div>
                <div className="text-xs text-slate-400">Round Off: ₹{calculatedRoundOff}</div>
              </div>

              <div className="text-lg font-black text-slate-900 border-t border-slate-200 pt-2.5 mt-2">
                Total: ₹{calculatedTotal}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-4 rounded-xl text-center text-xs transition-colors"
          >
            ✓ Save Cashier Receipt & Generate Patient Ledger Ticket
          </button>
        </form>
      </div>

      {/* RIGHT PANEL: BILLING LEDGER HISTORY LIST */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-y-auto max-h-full p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tenant Receipts Ledger</h4>
          <span className="text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono font-bold text-indigo-700">
            Total Revenue Collected: ₹{totalReceivedRevenue}
          </span>
        </div>

        <div className="space-y-3">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => setViewInvoiceId(inv.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                viewInvoiceId === inv.id ? "bg-indigo-50/40 border-indigo-500" : "bg-slate-50/50 border-slate-105 hover:bg-slate-100"
              }`}
            >
              <div className="flex justify-between items-center text-xs font-semibold">
                <div className="font-extrabold text-slate-800">{inv.patientName}</div>
                <div className="font-mono text-slate-400 text-[10px]">{inv.invoiceId}</div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <div>Date: {inv.date} • Mode: {inv.paymentMode}</div>
                <div className="font-bold text-slate-700">₹{inv.total}</div>
              </div>
              
              <div className="flex justify-between items-center text-[10px] mt-2.5 pt-2 border-t border-slate-100/60">
                <span className={`px-1.5 py-0.5 font-bold rounded-full text-[9px] uppercase ${
                  inv.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {inv.status}
                </span>

                {inv.status === "Pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateInvoiceStatus(inv.id, "Paid");
                    }}
                    className="text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-0.5 px-2 rounded"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPI DYNAMIC QR GENERATOR DIALOG */}
      {showUPIDialog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4">
            <h3 className="font-extrabold text-slate-850 text-sm">Dynamic UPI Merchant QR Gate</h3>
            
            <div className="p-3 bg-indigo-50 rounded-lg text-[11.5px] text-indigo-900 leading-relaxed font-semibold">
              Scan from any UPI application (GPay, PhonePe, Paytm, BHIM) to settle current invoice instant.
            </div>

            <div className="py-4 flex flex-col items-center justify-center">
              {/* Custom SVG QR Code Simulator frame */}
              <div className="border-4 border-slate-900 p-2 rounded-lg bg-white w-36 h-36 flex flex-col justify-between items-center relative hover:scale-105 transition-transform duration-300">
                <div className="absolute top-1.5 left-1.5 w-4 h-4 border-2 border-slate-900 bg-slate-900"></div>
                <div className="absolute top-1.5 right-1.5 w-4 h-4 border-2 border-slate-900 bg-slate-900"></div>
                <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-2 border-slate-900 bg-slate-900"></div>
                
                <div className="grid grid-cols-6 gap-1 w-full h-full p-3 opacity-90">
                  <div className="bg-slate-900"></div><div className="bg-transparent"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-transparent"></div><div className="bg-slate-900"></div>
                  <div className="bg-slate-900"></div><div className="bg-slate-100"></div><div className="bg-slate-900"></div><div className="bg-slate-100"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div>
                  <div className="bg-transparent"></div><div className="bg-slate-900"></div><div className="bg-transparent"></div><div className="bg-slate-900"></div><div className="bg-slate-100"></div><div className="bg-slate-900"></div>
                  <div className="bg-slate-900"></div><div className="bg-slate-150 bg-indigo-50"></div><div className="bg-slate-900"></div><div className="bg-transparent"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div>
                  <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-slate-100"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-transparent"></div>
                </div>
              </div>

              <div className="text-xl font-black text-slate-800 mt-4">₹{calculatedTotal}</div>
              <div className="text-[10px] text-slate-400 font-mono">ID: merc.apexhealthcare@upi</div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowUPIDialog(false)}
                className="flex-1 py-1 px-2 border border-slate-200 text-slate-655 text-slate-500 font-bold hover:bg-slate-50 rounded"
              >
                Postpone Bill
              </button>
              <button
                type="button"
                onClick={() => {
                  if (invoices.length > 0) {
                    onUpdateInvoiceStatus(invoices[invoices.length - 1].id, "Paid");
                  }
                  setShowUPIDialog(false);
                  alert("Simulated payment processed perfectly via UPI Merchant API integrations!");
                }}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded shadow-sm text-xs"
              >
                Simulate Successful scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
