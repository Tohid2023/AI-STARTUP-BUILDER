import { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, Loader2, Lightbulb, Heading } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function CreateStartup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ idea: "", title: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const allSuggestions = [
    { title: "DentalCRM AI", idea: "An AI-powered CRM for dental clinics that automatically schedules patient follow-ups based on treatment history." },
    { title: "PortPass Digital", idea: "Real-time AI-driven container dwell time prediction and port congestion routing engine." },
    { title: "CreatorFlow", idea: "An automated multi-platform content repurposing engine for indie creators using LLMs." },
    { title: "EcoSupply API", idea: "A real-time carbon footprint calculation API for e-commerce checkout flows." },
    { title: "LegalReview AI", idea: "A specialized AI contract analysis tool for freelance graphic designers to spot bad clauses." },
    { title: "LocalBite Route", idea: "A hyper-local predictive routing algorithm for cloud kitchens to optimize batch deliveries." }
  ];

  useEffect(() => {
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 2));
  }, []);

  const handleCreateStartup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await axios.post("https://ai-startup-builder-k422.onrender.com/api/startup/create", { idea: form.idea, title: form.title }, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate startup plan. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl mb-4 shadow-sm border border-brand-100">
            <Sparkles className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create a Startup</h1>
          <p className="text-gray-500 mt-2 font-medium">Let AI build your complete business model, features, and strategy.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-brand-500/5 border border-gray-100 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center justify-center">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateStartup} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Startup Name</label>
              <div className="relative group">
                <Heading className={`absolute left-3.5 top-3.5 w-5 h-5 transition-colors duration-200 ${focusedField === 'title' ? 'text-brand-500' : 'text-gray-400'}`} />
                <input
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-gray-400 font-medium"
                  placeholder="e.g. NexusAI"
                  value={form.title}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center justify-between">
                The Idea
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Be as specific as possible</span>
              </label>
              <div className="relative group">
                <Lightbulb className={`absolute left-3.5 top-3.5 w-5 h-5 transition-colors duration-200 ${focusedField === 'idea' ? 'text-brand-500' : 'text-gray-400'}`} />
                <textarea
                  required
                  rows="5"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-gray-400 resize-none font-medium leading-relaxed"
                  placeholder="Describe your startup idea in a few sentences. What problem does it solve?"
                  value={form.idea}
                  onFocus={() => setFocusedField('idea')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setForm({ ...form, idea: e.target.value })}
                ></textarea>
              </div>

              {/* Suggestions */}
              {!form.idea && !form.title && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {suggestions.map((s, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => setForm({ title: s.title, idea: s.idea })}
                      className="text-xs bg-gray-50 border border-gray-200 text-gray-600 hover:text-brand-700 hover:bg-brand-50 hover:border-brand-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <Sparkles className="w-3 h-3" /> {s.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !form.idea || !form.title}
                className="w-full gradient-bg font-bold py-4 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Market & Building Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Generate with AI
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" /> This might take up to 30 seconds to generate a full analysis.
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}