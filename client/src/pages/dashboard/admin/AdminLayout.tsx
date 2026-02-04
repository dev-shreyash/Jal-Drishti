/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  LayoutGrid, // Unified Icon
  Users, 
  AlertCircle, 
  BarChart3, 
  LogOut, 
  Bell, 
  Droplet
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* --- SIDEBAR (Fixed) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed h-full z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Droplet className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Jal-Drishti</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          
          <NavItem 
            icon={Home} 
            label="Dashboard" 
            active={location.pathname === "/admin/dashboard"} 
            onClick={() => navigate("/admin/dashboard")} 
          />

          {/* 👇 UNIFIED ASSETS LINK */}
          <NavItem 
            icon={LayoutGrid} 
            label="Asset Inventory" 
            active={isActive("/admin/assets")} 
            onClick={() => navigate("/admin/assets")} 
          />

          <NavItem 
            icon={Users} 
            label="Field Operators" 
            active={isActive("/admin/operators")} 
            onClick={() => navigate("/admin/operators")} 
          />

          <NavItem 
            icon={AlertCircle} 
            label="Complaints & Alerts" 
            active={isActive("/admin/complaints")} 
            onClick={() => navigate("/admin/complaints")} 
          />

          <NavItem 
            icon={BarChart3} 
            label="Reports" 
            active={isActive("/admin/reports")} 
            onClick={() => {}} // Placeholder
          />

        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Village Status
            </h4>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Operational
            </div>
          </div>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex items-center justify-between">
            
          <h2 className="text-2xl font-bold text-gray-800">
            Admin Portal
          </h2>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell className="h-5 w-5" />
              {/* Notification Dot Example */}
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <button 
              onClick={logout}
              className="flex items-center space-x-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 p-8 bg-gradient-to-b from-blue-50 to-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Helper Component for Sidebar Links
function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
        active 
          ? "bg-blue-50 text-blue-700 font-bold border border-blue-100" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
      <span>{label}</span>
    </button>
  );
}