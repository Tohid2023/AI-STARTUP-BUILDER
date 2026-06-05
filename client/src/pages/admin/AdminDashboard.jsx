import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Lightbulb,
  Calendar,
  Activity,
  Flame,
  ArrowRight,
  TrendingUp,
  Loader2,
  ShieldCheck,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      // Fetch stats
      const statsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // Fetch recent users (limit 5)
      const usersRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.data.success) {
        setRecentUsers(usersRes.data.data.users || []);
      }

      // Fetch recent ideas (limit 5)
      const ideasRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/ideas?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ideasRes.data.success) {
        setRecentIdeas(ideasRes.data.data.ideas || []);
      }

    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError(err.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-slate-800 rounded-lg w-48 mb-2"></div>
            <div className="h-4 bg-slate-800 rounded-lg w-72"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl p-6"></div>
          ))}
        </div>

        {/* Panels Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          <div className="h-96 bg-slate-900 border border-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Registered Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      desc: "Excluding soft-deleted accounts",
    },
    {
      label: "Total Startup Ideas",
      value: stats?.totalIdeas ?? 0,
      icon: Lightbulb,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      desc: "AI & ML models generated",
    },
    {
      label: "Ideas Generated Today",
      value: stats?.ideasToday ?? 0,
      icon: Calendar,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      desc: "Tracked in UTC timezone",
    },
    {
      label: "7-Day Active Users",
      value: stats?.activeUsers ?? 0,
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      desc: "Unique creators this week",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-brand-400" />
            Admin Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Real-time analytics and management system metrics for AI Startup Builder.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Grid count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="group relative overflow-hidden bg-slate-900 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/60 transition-all duration-300 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">{card.value}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Average display banner */}
      <div className="bg-gradient-to-r from-brand-900/10 via-indigo-900/10 to-transparent border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-brand-500/10 p-3 rounded-xl">
            <Flame className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Platform Generation Rate</h3>
            <p className="text-xs text-slate-400 mt-0.5">Average ideas generated per registered account</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-brand-400 tracking-tight">{stats?.averageIdeasPerUser ?? 0}</span>
          <span className="text-xs font-medium text-slate-400 ml-1">ideas / user</span>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent users list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Registrations</h3>
            <Link
              to="/admin/users"
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Manage Users
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800/60 flex-1">
            {recentUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No users registered yet.</div>
            ) : (
              recentUsers.map((user) => (
                <div key={user._id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs uppercase">
                      {user.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      user.role === "admin" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-[9px] text-slate-600 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent startup ideas generated */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Startup Ideas</h3>
            <Link
              to="/admin/ideas"
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors"
            >
              View Ideas
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800/60 flex-1">
            {recentIdeas.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No startup ideas generated yet.</div>
            ) : (
              recentIdeas.map((idea) => (
                <div key={idea._id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-all">
                  <div className="min-w-0 pr-4">
                    <p className="text-xs font-bold text-white truncate">{idea.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      by {idea.createdBy?.name || "Unknown Creator"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-400">
                      {idea.category || idea.industry || "General"}
                    </span>
                    <p className="text-[9px] text-slate-600 mt-1">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
