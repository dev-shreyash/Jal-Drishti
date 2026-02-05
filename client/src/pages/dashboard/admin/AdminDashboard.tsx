import React, { useEffect, useState } from "react";
import { getAdminStats } from "../../../services/admin";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import {
  Users,
  Droplet,
  Wrench,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import AiPredictionChart from "../../../component/AiPredictionChart";

// --- TYPE DEFINITIONS ---

interface DashboardData {
  villageName: string;
  population: number;
  pumps: number;
  operators: number;
  complaints: number;
  alerts: number;
}

interface AiForecastData {
  date: string;
  day: string;
  displayDate: string; 
  predicted_usage: number;
  reason: string;
  isAlert: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "red";
  trend: string;
  alert?: boolean;
}

interface QuickActionProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  color: string;
}

interface HealthItemProps {
  label: string;
  status: string;
  color: "green" | "yellow" | "red";
}

// --- MAIN COMPONENT ---

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData>({
    villageName: "Loading...",
    population: 0,
    pumps: 0,
    operators: 0,
    complaints: 0,
    alerts: 0,
  });

  const [aiData, setAiData] = useState<AiForecastData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await getAdminStats();
      setData(result);

      const aiRes = await api.get("/admin/dashboard/ai-insights");
      setAiData(Array.isArray(aiRes.data) ? aiRes.data : []);

    } catch (error) {
      console.error("Failed to load stats:", error);
      setAiData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Population Served"
          value={data.population}
          icon={Users}
          color="blue"
          trend="Updated from Census"
        />
        <StatCard
          title="Active Pumps"
          value={data.pumps}
          icon={Droplet}
          color="green"
          trend="100% Uptime"
        />
        <StatCard
          title="Field Operators"
          value={data.operators}
          icon={Wrench}
          color="purple"
          trend="Currently Active"
        />
        <StatCard
          title="Pending Issues"
          value={data.complaints}
          icon={AlertCircle}
          color="red"
          trend="Action Required"
          alert={data.complaints > 0}
        />
      </div>

      {/* 2. MAIN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: AI & ACTIONS */}
        <div className="lg:col-span-2 space-y-8">
            
           {/* --- AI INSIGHTS --- */}
           <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 opacity-50"></div>
             
             <div className="flex items-center space-x-2 mb-6">
               <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                 <Sparkles className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-bold text-gray-900">Jal-Drishti AI Insights</h3>
               <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                 Live Analysis
               </span>
             </div>

             {aiData.filter(d => d.isAlert).length === 0 ? (
               <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                 <Sparkles className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                 <p>System Optimal. No anomalies detected by AI.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {aiData.filter(d => d.isAlert).map((alert, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 bg-white border border-l-4 border-l-red-500 border-gray-100 rounded-r-lg shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex items-start space-x-4">
                       <div className="p-2 bg-red-50 text-red-600 rounded-full">
                         <Zap className="h-5 w-5" />
                       </div>
                       <div>
                         <h4 className="font-semibold text-gray-900">High Usage Alert</h4>
                         <p className="text-sm text-red-600 font-medium">{alert.displayDate} ({alert.day})</p>
                         <p className="text-xs text-gray-500 mt-1">
                           Predicted Usage: <span className="font-bold">{alert.predicted_usage} L</span>
                         </p>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-1">
                         Critical
                       </span>
                       <button className="mt-2 text-xs text-blue-600 font-medium hover:underline">
                         Schedule Maintenance
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>

           {/* --- AI FORECAST CHART --- */}
           <AiPredictionChart data={aiData} />

           {/* --- OLD PREVIOUS QUICK MANAGEMENT SECTION --- */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-4">
               Quick Management
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               <QuickAction
                 label="Register Pump"
                 icon={Droplet}
                 onClick={() => navigate("/admin/pumps")}
                 color="bg-blue-50 text-blue-700 hover:bg-blue-100"
               />
               <QuickAction
                 label="Add Operator"
                 icon={Users}
                 onClick={() => navigate("/admin/operators")}
                 color="bg-purple-50 text-purple-700 hover:bg-purple-100"
               />
               <QuickAction
                 label="View Alerts"
                 icon={AlertCircle}
                 onClick={() => navigate("/admin/complaints")}
                 color="bg-red-50 text-red-700 hover:bg-red-100"
               />
               <QuickAction
                 label="Log Maintenance"
                 icon={Wrench}
                 onClick={() => {}}
                 color="bg-orange-50 text-orange-700 hover:bg-orange-100"
               />
             </div>
           </div>
        </div>

        {/* RIGHT COLUMN: SYSTEM HEALTH */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            System Health
          </h3>
          <div className="space-y-4">
            <HealthItem
              label="Server Connection"
              status="Operational"
              color="green"
            />
            <HealthItem
              label="Database Sync"
              status="Operational"
              color="green"
            />
            <HealthItem
              label="Sensor Network"
              status="Warning"
              color="yellow"
            />
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Last synced: Just now
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatCard({ title, value, icon: Icon, color, trend, alert }: StatCardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className={`bg-white rounded-xl p-6 border transition-all hover:shadow-md ${alert ? "border-red-300 ring-2 ring-red-50" : "border-gray-200"}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {alert && <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value?.toLocaleString() || 0}</h3>
      <p className="text-sm font-medium text-gray-500 mb-3">{title}</p>
      <div className="text-xs text-gray-400 border-t border-gray-50 pt-3">{trend}</div>
    </div>
  );
}

function QuickAction({ label, icon: Icon, onClick, color }: QuickActionProps) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${color}`}>
      <Icon className="h-6 w-6 mb-2" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function HealthItem({ label, status, color }: HealthItemProps) {
  const statusColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <span className={`h-2 w-2 rounded-full ${statusColors[color]}`}></span>
        <span className="font-medium text-gray-900">{status}</span>
      </div>
    </div>
  );
}