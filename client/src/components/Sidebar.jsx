import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, History, Settings, Sparkles, X, Bookmark } from "lucide-react";

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Create Startup", path: "/create", icon: PlusCircle },
    { name: "Saved Ideas", path: "/saved", icon: Bookmark },
    { name: "History", path: "/history", icon: History },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm relative z-10">
      <div className="p-6 flex items-center justify-between border-b border-gray-50/50">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="bg-gradient-to-tr from-brand-600 to-accent-600 p-2 rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">AI Startup Builder</h2>
        </Link>
        <button 
          onClick={onClose}
          className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-1.5">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-50/50">
        <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-xl p-4 border border-brand-100/50 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-gray-600 mb-3">Get unlimited AI generations.</p>
            <button className="w-full bg-white text-brand-600 text-xs font-semibold py-2 rounded-lg shadow-sm hover:shadow transition-shadow border border-gray-100">
              View Plans
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Sparkles className="w-20 h-20 text-brand-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
