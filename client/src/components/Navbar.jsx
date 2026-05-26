import { Bell, Search, LogOut, Menu, User as UserIcon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://ai-startup-builder-k422.onrender.com/api/user/profile", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3.5 flex justify-between items-center transition-all">
      <div className="flex-1 flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search startups..." 
            className="w-full bg-gray-50/50 border border-gray-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-200 mx-1"></div>
        
        <Link to="/settings" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-xl transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm border-2 border-white ring-1 ring-gray-100 uppercase">
            {user?.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-sm text-left">
            <p className="font-semibold text-gray-900 leading-none">{user?.name || "Loading..."}</p>
            <p className="text-xs text-gray-500 mt-1">Free Plan</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}