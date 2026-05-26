import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, Rocket, Tag, CheckCircle2, 
  Target, LayoutDashboard, Cpu, Layers, DollarSign,
  Briefcase, TrendingUp, AlertTriangle, Lightbulb, Trash2,
  Star, RefreshCw, Copy, FileText, Users, BarChart3, Clock
} from "lucide-react";
import Layout from "../components/Layout";
import ReactMarkdown from 'react-markdown';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

export default function StartupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const contentRef = useRef(null);

  const fetchStartup = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://ai-startup-builder-k422.onrender.com/api/startup/my", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      const found = res.data.find(s => s._id === id);
      setStartup(found);
      setIsSaved(found?.isSaved || false);
    } catch (error) {
      console.error("Failed to fetch startup details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartup();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this startup?")) return;
    
    try {
      await axios.delete(`https://ai-startup-builder-k422.onrender.com/api/startup/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete startup:", error);
      alert("Failed to delete startup.");
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(`https://ai-startup-builder-k422.onrender.com/api/startup/${id}/save`, {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setIsSaved(res.data.isSaved);
    } catch (error) {
      console.error("Failed to toggle save state:", error);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("Regenerating will overwrite the current AI analysis. Continue?")) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`https://ai-startup-builder-k422.onrender.com/api/startup/${id}/regenerate`, {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setStartup(res.data.startup);
    } catch (error) {
      console.error("Failed to regenerate startup:", error);
      alert("Failed to regenerate AI analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (startup) {
      navigator.clipboard.writeText(JSON.stringify(startup, null, 2));
      alert("Copied to clipboard!");
    }
  };

  const handleDownloadPDF = useReactToPrint({
    contentRef,
    documentTitle: startup ? `${startup.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis` : 'startup_analysis'
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center gap-2 text-gray-500 mb-8">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="glass-panel p-10 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!startup) {
    return (
      <Layout>
        <div className="glass-panel p-12 text-center">
          <h2 className="text-xl font-bold mb-2">Startup not found</h2>
          <button onClick={() => navigate("/dashboard")} className="text-brand-600 hover:underline">
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const isJson = startup.aiResponse && typeof startup.aiResponse === 'object';
  const data = isJson ? startup.aiResponse : null;

  const difficultyColor = {
    "Easy": "bg-green-100 text-green-700 border-green-200",
    "Medium": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Hard": "bg-red-100 text-red-700 border-red-200"
  }[data?.difficulty] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <button onClick={handleSave} className="flex items-center gap-2 text-gray-600 hover:text-brand-600 bg-white border border-gray-200 hover:border-brand-200 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm text-sm font-medium whitespace-nowrap">
            <Star className={`w-4 h-4 ${isSaved ? "fill-yellow-400 text-yellow-400" : ""}`} /> {isSaved ? "Saved" : "Save Startup"}
          </button>
          <button onClick={handleRegenerate} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm text-sm font-medium whitespace-nowrap">
            <RefreshCw className="w-4 h-4" /> Regenerate AI
          </button>
          <button onClick={() => handleDownloadPDF()} className="flex items-center gap-2 text-gray-600 hover:text-brand-600 bg-white border border-gray-200 hover:border-brand-200 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm text-sm font-medium whitespace-nowrap">
            <FileText className="w-4 h-4" /> Print / Save PDF
          </button>
          <button onClick={handleCopy} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm text-sm font-medium whitespace-nowrap">
            <Copy className="w-4 h-4" /> Copy Idea
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-medium whitespace-nowrap">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div ref={contentRef} id="startup-analysis-content" className="p-1 sm:p-2 bg-gray-50 -m-1 sm:-m-2 rounded-xl print:p-0 print:bg-white">
      {/* Main Header Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 relative transition-all duration-300 hover:shadow-xl print:shadow-none print:border-gray-200 print:mb-4">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Rocket className="w-64 h-64" />
        </div>
        
        <div className="p-8 md:p-10 relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-brand-100">
              <Tag className="w-3 h-3" /> {isJson && data.category ? data.category : (startup.category || startup.industry)}
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> AI Generated
            </span>
            {data?.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${difficultyColor}`}>
                <BarChart3 className="w-3 h-3" /> Difficulty: {data.difficulty}
              </span>
            )}
            {data?.monetization && data.monetization[0] && (
              <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-200 flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" /> {data.monetization[0].split(' ')[0]}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {startup.title}
          </h1>
          
          {isJson && data.pitch && (
            <div className="bg-gradient-to-r from-brand-50 to-transparent p-4 rounded-xl border-l-4 border-brand-500 mb-6 max-w-4xl">
              <p className="text-xl text-brand-900 font-semibold leading-relaxed">
                "{data.pitch}"
              </p>
            </div>
          )}

          {isJson && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-sm font-medium text-gray-600">
              {data.monetization && data.monetization[0] && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-gray-400" /> {data.monetization[0]}
                </div>
              )}
              {data.timeSaved && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" /> Saves {data.timeSaved}
                </div>
              )}
              {data.targetUsers && data.targetUsers.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" /> {data.targetUsers[0]}
                </div>
              )}
            </div>
          )}

          <div className="flex items-start gap-3 bg-gray-50/80 p-5 rounded-xl border border-gray-100 max-w-4xl">
            <Lightbulb className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Original Idea Context</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {startup.idea}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isJson ? (
        <>
          {/* Row 1: Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="The Problem" icon={AlertTriangle} color="text-red-500" bg="bg-red-50" borderClass="border-l-4 border-l-red-400">
              <div className="prose prose-sm text-gray-700 leading-relaxed space-y-2 max-w-none">
                <ReactMarkdown>{data.problem?.replace(/\\n/g, '\\n\\n')}</ReactMarkdown>
              </div>
            </Card>

            <Card title="The Solution" icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-50" borderClass="border-l-4 border-l-emerald-400">
              <div className="prose prose-sm text-gray-700 leading-relaxed space-y-2 max-w-none">
                <ReactMarkdown>{data.solution?.replace(/\\n/g, '\\n\\n')}</ReactMarkdown>
              </div>
            </Card>
          </div>

          {/* Row 2: Features, Tech Stack, Target Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card title="Target Users" icon={Users} color="text-blue-500" bg="bg-blue-50" borderClass="border-l-4 border-l-blue-400">
              <ul className="space-y-3">
                {(data.targetUsers?.length > 0 ? data.targetUsers : ["Indie creators (10k–100k audience)", "Agencies managing 5–20 clients", "Growth-focused startups using content marketing"]).map((u, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed font-medium">{u}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Key Features" icon={Layers} color="text-brand-500" bg="bg-brand-50" borderClass="border-l-4 border-l-brand-400">
              <ul className="list-disc pl-4 space-y-2">
                {data.features?.map((f, i) => (
                  <li key={i} className="text-gray-700 text-sm leading-relaxed">{f}</li>
                ))}
              </ul>
            </Card>

            <Card title="Tech Stack" icon={Cpu} color="text-cyan-500" bg="bg-cyan-50" borderClass="border-l-4 border-l-cyan-400">
              <div className="flex flex-wrap gap-2">
                {data.techStack?.map((t, i) => (
                  <span key={i} className="bg-cyan-50 text-cyan-700 border border-cyan-100 text-xs font-semibold px-2.5 py-1 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Row 3: Monetization, Risks, Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card title="Monetization" icon={DollarSign} color="text-yellow-500" bg="bg-yellow-50" borderClass="border-l-4 border-l-yellow-400">
              <ul className="list-disc pl-4 space-y-2 mb-4">
                {data.monetization?.map((m, i) => (
                  <li key={i} className="text-gray-700 text-sm leading-relaxed">{m}</li>
                ))}
              </ul>
              {data.businessModel && (
                <>
                  <div className="h-px bg-yellow-100 my-4 w-full"></div>
                  <div className="prose prose-sm text-yellow-800 leading-relaxed max-w-none text-xs bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                    <span className="font-bold block mb-1">Business Model Trade-offs:</span>
                    <ReactMarkdown>{data.businessModel?.replace(/\\n/g, '\\n\\n')}</ReactMarkdown>
                  </div>
                </>
              )}
            </Card>

            <Card title="Risks & Challenges" icon={AlertTriangle} color="text-orange-500" bg="bg-orange-50" borderClass="border-l-4 border-l-orange-400">
              <ul className="list-disc pl-4 space-y-2">
                {data.risks?.map((r, i) => (
                  <li key={i} className="text-gray-700 text-sm leading-relaxed">{r}</li>
                ))}
              </ul>
            </Card>

            <Card title="Execution Logistics" icon={Clock} color="text-gray-500" bg="bg-gray-50" borderClass="border-l-4 border-l-gray-400">
              <div className="space-y-4">
                {data.estimatedCost && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated MVP Cost</h4>
                    <p className="text-gray-900 font-medium">{data.estimatedCost}</p>
                  </div>
                )}
                {data.timeToBuild && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time to Build</h4>
                    <p className="text-gray-900 font-medium">{data.timeToBuild}</p>
                  </div>
                )}
                {data.revenuePotential && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Revenue Potential</h4>
                    <p className="text-emerald-600 font-bold">{data.revenuePotential}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Row 4: Growth Strategy & Dynamics */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card title="Growth Strategy" icon={TrendingUp} color="text-purple-500" bg="bg-purple-50" borderClass="border-l-4 border-l-purple-400">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.growth?.map((g, i) => (
                  <li key={i} className="flex items-start gap-3 bg-purple-50/30 p-4 rounded-xl border border-purple-100/50">
                    <Rocket className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm leading-relaxed">{g}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Dynamic Row: Market Size & Competitors (if present) */}
          {(data.marketSize || (data.competitors && data.competitors.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {data.marketSize && (
                <Card title="Market Size (TAM)" icon={BarChart3} color="text-indigo-500" bg="bg-indigo-50" borderClass="border-l-4 border-l-indigo-400">
                  <p className="text-3xl font-black text-indigo-700">{data.marketSize}</p>
                </Card>
              )}
              {data.competitors && data.competitors.length > 0 && (
                <Card title="Competitors" icon={Target} color="text-rose-500" bg="bg-rose-50" borderClass="border-l-4 border-l-rose-400">
                  <div className="flex flex-wrap gap-2">
                    {data.competitors.map((c, i) => (
                      <span key={i} className="bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold px-3 py-1.5 rounded-lg">
                        {c}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 md:p-10">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-brand-50 p-2 rounded-lg text-brand-600">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">AI Deep Analysis (Legacy)</h2>
          </div>
          
          <div className="prose prose-brand max-w-none text-sm md:text-base leading-relaxed">
            <ReactMarkdown className="markdown-body">{startup.aiResponse}</ReactMarkdown>
          </div>
        </div>
      )}
      
      </div>
      </div>
    </Layout>
  );
}

function Card({ title, icon: Icon, color, bg, borderClass = "", children }) {
  return (
    <div className={`bg-gradient-to-br from-white to-gray-50/80 rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${borderClass}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg md:text-xl tracking-tight">{title}</h3>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
