import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.data && res.data.role === "admin" && !res.data.isBlocked && !res.data.isDeleted) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin verification error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl glass-panel max-w-sm w-full border border-white/10 bg-white/5">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
          <h3 className="text-lg font-semibold tracking-tight">Verifying credentials</h3>
          <p className="text-xs text-slate-400 text-center">Checking administrative access level...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
