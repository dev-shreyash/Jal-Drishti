import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  FilePlus,      // Replaced LogPlus
  ClipboardList, 
  LogOut, 
  User as UserIcon,
  LayoutDashboard 
} from "lucide-react";

export default function OperatorDashboard() {
  const navigate = useNavigate();

  // FIX: Initialize state directly from localStorage
  // This avoids the "cascading render" effect error
  const [username] = useState(() => {
    return localStorage.getItem("username") || "Operator";
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Add Daily Log",
      description: "Record new daily activities, pump usage, and chlorine levels.",
      icon: <FilePlus className="h-8 w-8 text-blue-600" />, // Fixed Icon
      path: "/operator/daily-log",
      bg: "bg-blue-50",
      border: "border-blue-100",
      hover: "hover:border-blue-300",
    },
    {
      id: 2,
      title: "My Logs",
      description: "View and track your previously submitted daily activity logs.",
      icon: <ClipboardList className="h-8 w-8 text-green-600" />,
      path: "/operator/my-logs",
      bg: "bg-green-50",
      border: "border-green-100",
      hover: "hover:border-green-300",
    },
    {
      id: 3,
      title: "Logout",
      description: "Securely sign out from the Jal-Drishti operator portal.",
      icon: <LogOut className="h-8 w-8 text-red-600" />,
      action: handleLogout,
      bg: "bg-red-50",
      border: "border-red-100",
      hover: "hover:border-red-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="text-blue-600 h-8 w-8" />
            Operator Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Welcome back, <span className="font-semibold text-slate-700">{username}</span></p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 self-start md:self-auto">
          <div className="bg-blue-100 p-1.5 rounded-full">
            <UserIcon className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-medium text-slate-700">Official Operator</span>
        </div>
      </header>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.action ? item.action() : navigate(item.path!)}
            className={`flex flex-col text-left p-6 rounded-2xl border-2 transition-all duration-300 bg-white shadow-sm group ${item.bg} ${item.border} ${item.hover} hover:shadow-md hover:-translate-y-1`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="transition-transform group-hover:scale-110 duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
              {item.description}
            </p>
            
            <div className="flex justify-end items-center">
              <span className={`text-sm font-bold flex items-center gap-1 ${item.id === 3 ? 'text-red-600' : 'text-blue-600'}`}>
                {item.action ? "Sign Out" : "Access Portal"} 
                {!item.action && <span className="group-hover:translate-x-1 transition-transform">→</span>}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}