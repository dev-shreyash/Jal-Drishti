import { useEffect, useState } from "react";
import { getComplaints, getSystemAlerts, updateComplaintStatus } from "../../../services/admin";
import { 
  AlertCircle, CheckCircle2, Clock, 
  Filter, Search, MessageSquare, 
  Zap, AlertTriangle, Check, X,
  User, MapPin, Calendar
} from "lucide-react";

// --- Types ---
interface Complaint {
  id: number;
  resident_name: string;
  village: string;
  issue_type: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  date: string;
  priority: "HIGH" | "MEDIUM" | "CRITICAL";
}

interface Alert {
  id: string;
  asset: string;
  message: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  timestamp: string;
}

export default function Complaints() {
  // State
  const [activeTab, setActiveTab] = useState<"COMPLAINTS" | "ALERTS">("COMPLAINTS");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [adminComment, setAdminComment] = useState("");

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cData, aData] = await Promise.all([getComplaints(), getSystemAlerts()]);
        setComplaints(cData as Complaint[]);
        setAlerts(aData as Alert[]);
      } catch (error) {
        console.error("Failed to load data");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle Status Update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedComplaint) return;
    
    // Optimistic Update (Update UI immediately)
    const updatedList = complaints.map(c => 
      c.id === selectedComplaint.id ? { ...c, status: newStatus as any } : c
    );
    setComplaints(updatedList);
    
    // Call API
    await updateComplaintStatus(selectedComplaint.id, newStatus, adminComment);
    
    setSelectedComplaint(null);
    setAdminComment("");
  };

  // Helper: Status Badge Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-orange-100 text-orange-700 border-orange-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700 border-blue-200";
      case "RESOLVED": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-blue-600"/>
            Issue Management
          </h1>
          <p className="text-gray-600 text-sm">Monitor resident complaints and system anomalies</p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
          <button 
            onClick={() => setActiveTab("COMPLAINTS")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "COMPLAINTS" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <MessageSquare className="h-4 w-4"/> Resident Complaints
            <span className="bg-red-100 text-red-600 px-1.5 rounded-full text-xs">{complaints.filter(c => c.status === 'PENDING').length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("ALERTS")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "ALERTS" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Zap className="h-4 w-4"/> System Alerts
            <span className="bg-purple-100 text-purple-600 px-1.5 rounded-full text-xs">{alerts.length}</span>
          </button>
        </div>
      </div>

      {/* --- CONTENT: RESIDENT COMPLAINTS --- */}
      {activeTab === "COMPLAINTS" && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-4 border-b bg-gray-50 flex gap-4">
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                <input placeholder="Search by name or ticket ID..." className="pl-9 w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
             </div>
             <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Filter className="h-4 w-4"/> Filter Status
             </button>
          </div>

          {loading ? (
             <div className="p-12 text-center text-gray-500">Loading tickets...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b text-gray-500">
                  <tr>
                    <th className="py-3 px-6 font-medium">Ticket Details</th>
                    <th className="py-3 px-6 font-medium">Resident</th>
                    <th className="py-3 px-6 font-medium">Status</th>
                    <th className="py-3 px-6 font-medium">Date</th>
                    <th className="py-3 px-6 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {complaints.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 group">
                      <td className="py-4 px-6">
                         <div className="font-semibold text-gray-900">{c.issue_type}</div>
                         <div className="text-gray-500 text-xs mt-1 truncate max-w-xs">{c.description}</div>
                         <div className="mt-1">
                           {c.priority === "CRITICAL" && <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">CRITICAL</span>}
                         </div>
                      </td>
                      <td className="py-4 px-6">
                         <div className="flex items-center gap-2 text-gray-900 font-medium"><User className="h-3 w-3 text-gray-400"/> {c.resident_name}</div>
                         <div className="flex items-center gap-2 text-gray-500 text-xs mt-1"><MapPin className="h-3 w-3"/> {c.village}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(c.status)}`}>
                          {c.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                         <div className="flex items-center gap-2"><Calendar className="h-3 w-3"/> {new Date(c.date).toLocaleDateString()}</div>
                         <div className="flex items-center gap-2 text-xs mt-1"><Clock className="h-3 w-3"/> {new Date(c.date).toLocaleTimeString()}</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setSelectedComplaint(c)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- CONTENT: SYSTEM ALERTS --- */}
      {activeTab === "ALERTS" && (
        <div className="grid grid-cols-1 gap-4">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-5 rounded-lg border-l-4 shadow-sm bg-white flex items-start gap-4 transition-transform hover:-translate-y-1 ${
               alert.severity === "CRITICAL" ? "border-l-red-500" : "border-l-orange-400"
            }`}>
               <div className={`p-3 rounded-full ${alert.severity === "CRITICAL" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}>
                 <AlertTriangle className="h-6 w-6"/>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-lg">{alert.asset} Issue</h3>
                    <span className="text-gray-400 text-xs font-mono">{alert.timestamp}</span>
                 </div>
                 <p className="text-gray-600 mt-1">{alert.message}</p>
                 <div className="mt-3 flex gap-2">
                    <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">View Asset Sensor Data</button>
                    <button className="text-xs font-bold text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">Dismiss</button>
                 </div>
               </div>
            </div>
          ))}
          {alerts.length === 0 && (
             <div className="p-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
               <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2"/>
               <h3 className="text-gray-900 font-medium">All Systems Nominal</h3>
               <p className="text-gray-500 text-sm">No active alerts detected.</p>
             </div>
          )}
        </div>
      )}

      {/* --- MODAL: MANAGE COMPLAINT --- */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800">Manage Complaint #{selectedComplaint.id}</h3>
                 <button onClick={() => setSelectedComplaint(null)}><X className="h-5 w-5 text-gray-400"/></button>
              </div>
              <div className="p-6 space-y-4">
                 
                 {/* Details Box */}
                 <div className="bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-100">
                    <div className="flex justify-between">
                       <span className="text-xs font-bold text-blue-600 uppercase">Issue</span>
                       <span className="text-xs font-bold text-gray-500">{selectedComplaint.date.split("T")[0]}</span>
                    </div>
                    <p className="font-medium text-gray-900">{selectedComplaint.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                       <User className="h-4 w-4"/> {selectedComplaint.resident_name} ({selectedComplaint.village})
                    </div>
                 </div>

                 {/* Action Area */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Note (Optional)</label>
                    <textarea 
                      className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      rows={3}
                      placeholder="e.g. Assigned to Operator Rajesh..."
                      value={adminComment}
                      onChange={e => setAdminComment(e.target.value)}
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => handleStatusUpdate("IN_PROGRESS")}
                      className={`flex flex-col items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors ${selectedComplaint.status === "IN_PROGRESS" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200"}`}
                    >
                      <Clock className="h-5 w-5 mb-1 text-blue-600"/>
                      <span className="text-xs font-bold">Mark In Progress</span>
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate("RESOLVED")}
                      className={`flex flex-col items-center p-3 border rounded-lg hover:bg-green-50 transition-colors ${selectedComplaint.status === "RESOLVED" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200"}`}
                    >
                      <CheckCircle2 className="h-5 w-5 mb-1 text-green-600"/>
                      <span className="text-xs font-bold">Mark Resolved</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}