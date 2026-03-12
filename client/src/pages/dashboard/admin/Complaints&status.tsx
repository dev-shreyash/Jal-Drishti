import { useReducer, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComplaints, getSystemAlerts, updateComplaintStatus } from "../../../services/admin";
import { 
  AlertCircle, CheckCircle2, Clock, Filter, Search, MessageSquare, 
  Zap, AlertTriangle, X, User, MapPin, Calendar
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

interface State {
  activeTab: "COMPLAINTS" | "ALERTS";
  searchQuery: string;
  selectedComplaint: Complaint | null;
  adminComment: string;
}

type Action = 
  | { type: "SET_TAB"; payload: "COMPLAINTS" | "ALERTS" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SELECT_COMPLAINT"; payload: Complaint | null }
  | { type: "SET_COMMENT"; payload: string };

const initialState: State = {
  activeTab: "COMPLAINTS",
  searchQuery: "",
  selectedComplaint: null,
  adminComment: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TAB": return { ...state, activeTab: action.payload };
    case "SET_SEARCH": return { ...state, searchQuery: action.payload };
    case "SELECT_COMPLAINT": return { ...state, selectedComplaint: action.payload, adminComment: "" };
    case "SET_COMMENT": return { ...state, adminComment: action.payload };
    default: return state;
  }
}

export default function Complaints() {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, initialState);

  // 1. Data Fetching
  const { data: complaints = [], isLoading: loadingComplaints } = useQuery<Complaint[]>({
    queryKey: ["complaints"],
    queryFn: getComplaints,
  });

  const { data: alerts = [], isLoading: loadingAlerts } = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: getSystemAlerts,
  });

  // 2. Mutations
  const statusMutation = useMutation({
    mutationFn: (vars: { id: number; status: string; comment: string }) => 
      updateComplaintStatus(vars.id, vars.status, vars.comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      dispatch({ type: "SELECT_COMPLAINT", payload: null });
    },
  });

  // 3. Derived State (Filtering)
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => 
      c.resident_name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      c.issue_type.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }, [complaints, state.searchQuery]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-orange-100 text-orange-700 border-orange-200",
      IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
      RESOLVED: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-blue-600"/> Issue Management
          </h1>
          <p className="text-gray-600 text-sm">Monitor resident complaints and system anomalies</p>
        </div>

        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
          <button 
            onClick={() => dispatch({ type: "SET_TAB", payload: "COMPLAINTS" })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${state.activeTab === "COMPLAINTS" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <MessageSquare className="h-4 w-4"/> Resident Complaints
            <span className="bg-red-100 text-red-600 px-1.5 rounded-full text-xs">
              {complaints.filter(c => c.status === 'PENDING').length}
            </span>
          </button>
          <button 
            onClick={() => dispatch({ type: "SET_TAB", payload: "ALERTS" })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${state.activeTab === "ALERTS" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Zap className="h-4 w-4"/> System Alerts
            <span className="bg-purple-100 text-purple-600 px-1.5 rounded-full text-xs">{alerts.length}</span>
          </button>
        </div>
      </div>

      {state.activeTab === "COMPLAINTS" && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex gap-4">
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                <input 
                  placeholder="Search complaints..." 
                  className="pl-9 w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={state.searchQuery}
                  onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
                />
             </div>
          </div>

          {loadingComplaints ? (
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
                  {filteredComplaints.map(c => (
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
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                         <div className="flex items-center gap-2 text-xs"><Calendar className="h-3 w-3"/> {new Date(c.date).toLocaleDateString()}</div>
                         <div className="flex items-center gap-2 text-xs mt-1"><Clock className="h-3 w-3"/> {new Date(c.date).toLocaleTimeString()}</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => dispatch({ type: "SELECT_COMPLAINT", payload: c })}
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

      {state.activeTab === "ALERTS" && (
        <div className="grid grid-cols-1 gap-4">
          {loadingAlerts ? <div className="p-12 text-center">Loading alerts...</div> : (
            alerts.map(alert => (
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
                 </div>
              </div>
            ))
          )}
        </div>
      )}

      {state.selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800">Manage Ticket #{state.selectedComplaint.id}</h3>
                 <button onClick={() => dispatch({ type: "SELECT_COMPLAINT", payload: null })}><X className="h-5 w-5 text-gray-400"/></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="font-medium text-gray-900">{state.selectedComplaint.description}</p>
                 </div>
                 <textarea 
                   className="w-full p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                   rows={3}
                   placeholder="Add admin note..."
                   value={state.adminComment}
                   onChange={e => dispatch({ type: "SET_COMMENT", payload: e.target.value })}
                 />
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: state.selectedComplaint!.id, status: "IN_PROGRESS", comment: state.adminComment })}
                      className="flex flex-col items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Clock className="h-5 w-5 mb-1 text-blue-600"/>
                      <span className="text-xs font-bold">In Progress</span>
                    </button>
                    <button 
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: state.selectedComplaint!.id, status: "RESOLVED", comment: state.adminComment })}
                      className="flex flex-col items-center p-3 border rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <CheckCircle2 className="h-5 w-5 mb-1 text-green-600"/>
                      <span className="text-xs font-bold">Resolve</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}