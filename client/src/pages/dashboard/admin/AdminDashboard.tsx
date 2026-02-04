import { useEffect, useState } from "react";
import { getAdminStats } from "../../../services/admin";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Droplet,
  Building2,
  Users,
  AlertCircle,
  BarChart3,
  LogOut,
  Bell,
  Activity,
  Shield,
  TrendingUp,
  Calendar,
  Wrench
} from "lucide-react";

interface AdminStats {
  villages: number;
  pumps: number;
  operators: number;
  complaints: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats>({
    villages: 0,
    pumps: 0,
    operators: 0,
    complaints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-700 p-3 rounded-xl shadow-md">
                <Droplet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jal-Drishti</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">Ministry of Jal Shakti</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Jal Jeevan Mission
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="space-y-1">
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => navigate("/admin/villages")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Villages</span>
                </button>
                <button
                  onClick={() => navigate("/admin/pumps")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <Droplet className="h-5 w-5" />
                  <span>Pumps</span>
                </button>
                <button
                  onClick={() => navigate("/admin/tanks")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <Building2 className="h-5 w-5" />
                  <span>Tanks</span>
                </button>
                <button
                  onClick={() => navigate("/admin/operators")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Operators</span>
                </button>
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl shadow-lg p-5">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>System Status</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Uptime</span>
                  <span className="font-semibold">99.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Last Updated</span>
                  <span className="text-xs">Today 10:30 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Security</span>
                  <span className="inline-flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome Back, Administrator</h1>
                  <p className="text-blue-100">
                    Overview of the rural water management system. Monitor key metrics and system performance.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-3 font-medium text-sm ${activeTab === "overview" 
                  ? "text-blue-700 border-b-2 border-blue-700" 
                  : "text-gray-600 hover:text-blue-600"}`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-3 font-medium text-sm ${activeTab === "analytics" 
                  ? "text-blue-700 border-b-2 border-blue-700" 
                  : "text-gray-600 hover:text-blue-600"}`}
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-3 font-medium text-sm ${activeTab === "reports" 
                  ? "text-blue-700 border-b-2 border-blue-700" 
                  : "text-gray-600 hover:text-blue-600"}`}
              >
                <Wrench className="h-4 w-4 inline mr-2" />
                Maintenance
              </button>
            </div>

            {/* Stats Cards Grid */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading dashboard data...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard 
                    title="Total Villages" 
                    value={stats.villages} 
                    icon={MapPin}
                    color="blue"
                    description="Under management"
                  />
                  <StatCard 
                    title="Water Pumps" 
                    value={stats.pumps} 
                    icon={Droplet}
                    color="green"
                    description="Active installations"
                  />
                  <StatCard 
                    title="Active Operators" 
                    value={stats.operators} 
                    icon={Users}
                    color="purple"
                    description="On duty"
                  />
                  <StatCard 
                    title="Pending Complaints" 
                    value={stats.complaints} 
                    icon={AlertCircle}
                    color="red"
                    description="Require attention"
                  />
                </div>

                {/* Additional Dashboard Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <ActivityItem 
                        icon={Droplet}
                        title="New pump installed"
                        description="Village: Ramnagar"
                        time="2 hours ago"
                        color="green"
                      />
                      <ActivityItem 
                        icon={AlertCircle}
                        title="Complaint resolved"
                        description="Water pressure issue fixed"
                        time="Yesterday"
                        color="blue"
                      />
                      <ActivityItem 
                        icon={Users}
                        title="Operator assigned"
                        description="To Belgaum district"
                        time="2 days ago"
                        color="purple"
                      />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <ActionButton 
                        label="Add Village"
                        icon={MapPin}
                        onClick={() => navigate("/admin/villages")}
                        color="blue"
                      />
                      <ActionButton 
                        label="Register Pump"
                        icon={Droplet}
                        onClick={() => navigate("/admin/pumps")}
                        color="green"
                      />
                      <ActionButton 
                        label="View Complaints"
                        icon={AlertCircle}
                        onClick={() => navigate("/admin/complaints")}
                        color="red"
                      />
                      <ActionButton 
                        label="Generate Report"
                        icon={BarChart3}
                        onClick={() => {}}
                        color="purple"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-blue-700 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">System Information</h4>
                      <p className="text-sm text-gray-700">
                        All systems operational. The water management dashboard is updated in real-time. 
                        For emergency situations, contact the district control room immediately.
                      </p>
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                          System Status: Normal
                        </span>
                        <span>Last Backup: Today 04:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "blue" | "green" | "red" | "purple" | "orange";
  description: string;
}

function StatCard({ title, value, icon: Icon, color, description }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">Total</span>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h2>
      <p className="font-medium text-gray-900 mb-2">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  color: string;
}

function ActivityItem({ icon: Icon, title, description, time, color }: ActivityItemProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  color: string;
}

function ActionButton({ label, icon: Icon, onClick, color }: ActionButtonProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
    green: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
    red: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
    purple: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-lg border ${colorClasses[color] || colorClasses.blue} transition-colors`}
    >
      <Icon className="h-6 w-6 mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}