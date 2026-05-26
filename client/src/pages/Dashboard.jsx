import { useEffect, useState } from "react";
import axios from "axios";
import { Rocket, FileText, Activity, Plus, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get("https://ai-startup-builder-k422.onrender.com/api/startup/my", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setStartups(res.data);
    } catch (error) {
      console.error("Failed to fetch startups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent navigation
    if (!window.confirm("Are you sure you want to delete this startup?")) return;
    
    try {
      await axios.delete(`https://ai-startup-builder-k422.onrender.com/api/startup/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setStartups(startups.filter(s => s._id !== id));
    } catch (error) {
      console.error("Failed to delete startup:", error);
      alert("Failed to delete startup.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your AI-generated startups.</p>
        </div>
        <Link 
          to="/create" 
          className="gradient-bg w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm shadow-sm flex items-center justify-center gap-2 group"
        >
          <Plus className="w-4 h-4" />
          <span>New Startup</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Startups", value: loading ? "-" : startups.length, icon: Rocket, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "AI Generations", value: loading ? "-" : startups.length * 4, icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Platform Status", value: "Active", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-lg font-bold text-gray-900">Recent Startups</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-24 bg-gray-100 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      ) : startups.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No startups yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm">
            You haven't generated any startup ideas yet. Create your first one to get started!
          </p>
          <Link to="/create" className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 font-medium text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors">
            Create First Startup
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((s) => {
            const categoryText = (s.aiResponse && typeof s.aiResponse === 'object' && s.aiResponse.category) ? s.aiResponse.category : (s.category || s.industry || "Analyzing...");
            const pitchText = s.aiResponse && typeof s.aiResponse === 'object' ? s.aiResponse.pitch : (typeof s.aiResponse === 'string' ? s.aiResponse : "Analyzing idea...");
            
            return (
              <div
                key={s._id}
                onClick={() => navigate(`/startup/${s._id}`)}
                className="group relative bg-white rounded-2xl p-6 cursor-pointer flex flex-col h-full border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden z-10"
              >
                {/* Subtle top gradient line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Abstract background shape */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-50 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-5 relative z-20">
                  <h3 className="text-xl font-black text-gray-900 line-clamp-1 leading-tight group-hover:text-brand-600 transition-colors">
                    {s.title}
                  </h3>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => handleDelete(e, s._id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 -mr-2 -mt-2 z-30"
                    title="Delete Startup"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 relative z-20">
                  {/* Pitch as main description */}
                  <p className="text-gray-700 font-medium text-sm mb-4 line-clamp-3 leading-relaxed">
                    {pitchText}
                  </p>
                  
                  {/* Original Idea as subtle context */}
                  <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100/50 mb-4">
                    <p className="text-xs text-gray-500 line-clamp-2 italic">
                      "{s.idea}"
                    </p>
                  </div>
                </div>

                {/* Footer with tag */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center relative z-20">
                  <span className="text-[11px] font-bold tracking-wider uppercase bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full border border-brand-100/50 truncate max-w-[200px]">
                    {categoryText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}