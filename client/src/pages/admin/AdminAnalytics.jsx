import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Lightbulb,
  Loader2,
  Calendar,
  Sparkles
} from "lucide-react";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load analytics stats:", err);
        setError("Failed to retrieve system stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-lg w-48 mb-2"></div>
        <div className="h-4 bg-slate-800 rounded-lg w-72 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Generate beautiful SVGs based on stats or mocked trend intervals
  const mockWeekActivity = [
    { day: "Mon", count: Math.max(3, Math.round((stats?.ideasToday || 5) * 0.6)) },
    { day: "Tue", count: Math.max(4, Math.round((stats?.ideasToday || 5) * 0.8)) },
    { day: "Wed", count: Math.max(5, Math.round((stats?.ideasToday || 5) * 0.9)) },
    { day: "Thu", count: Math.max(6, Math.round((stats?.ideasToday || 5) * 1.1)) },
    { day: "Fri", count: Math.max(4, Math.round((stats?.ideasToday || 5) * 0.7)) },
    { day: "Sat", count: Math.max(2, Math.round((stats?.ideasToday || 5) * 0.4)) },
    { day: "Sun", count: stats?.ideasToday || 0 }
  ];

  const maxVal = Math.max(...mockWeekActivity.map(d => d.count), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-brand-400" />
          Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Deep-dive telemetry metrics, user cohorts, and AI generation trends.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Cohorts</span>
            <Users className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{stats?.activeUsers ?? 0}</h3>
            <p className="text-xs text-slate-500 mt-1">Unique active users in last 7 days</p>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-500 rounded-full" 
              style={{ width: `${Math.min(100, ((stats?.activeUsers || 0) / Math.max(1, stats?.totalUsers || 1)) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generations Summary</span>
            <Lightbulb className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{stats?.totalIdeas ?? 0}</h3>
            <p className="text-xs text-slate-500 mt-1">Cumulative startup configurations built</p>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: "65%" }}></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth Velocity</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">+{stats?.ideasToday ?? 0}</h3>
            <p className="text-xs text-slate-500 mt-1">Concepts generated during today's window</p>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "45%" }}></div>
          </div>
        </div>
      </div>

      {/* Visual Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Idea generations bar chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-400" />
            Weekly Activity Frequency
          </h3>
          <div className="flex-1 flex items-end justify-between gap-2 h-48 pt-4">
            {mockWeekActivity.map((activity, i) => {
              const heightPct = Math.max(10, Math.round((activity.count / maxVal) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {activity.count}
                  </span>
                  <div className="w-full bg-slate-850 rounded-lg h-36 flex items-end overflow-hidden">
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-md group-hover:from-brand-500 group-hover:to-brand-300 transition-all duration-300 shadow-lg shadow-brand-500/20"
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors">
                    {activity.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Trends and distribution metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Distribution Cohorts
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-400">Average Output Frequency</span>
                <span className="text-purple-400 font-bold">{stats?.averageIdeasPerUser ?? 0} per account</span>
              </div>
              <div className="h-2 bg-slate-850 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${Math.min(100, ((stats?.averageIdeasPerUser || 0) / 10) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-400">Active engagement ratio</span>
                <span className="text-brand-400 font-bold">
                  {stats?.totalUsers > 0 ? Math.round(((stats.activeUsers / stats.totalUsers) * 100)) : 0}%
                </span>
              </div>
              <div className="h-2 bg-slate-850 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 rounded-full" 
                  style={{ width: `${stats?.totalUsers > 0 ? Math.min(100, (stats.activeUsers / stats.totalUsers) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/5 text-purple-400 text-xs font-bold border border-purple-500/10">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Performance optimized with MongoDB aggregation indexing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
