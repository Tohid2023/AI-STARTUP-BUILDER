import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Clock, Eye, Trash2, Rocket, Search } from "lucide-react";
import Layout from "../components/Layout";

export default function History() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this startup from history?")) return;
    
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

  const filteredStartups = startups.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.idea?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Generation History</h1>
            <p className="text-sm text-gray-500 mt-1">View all your past AI generation logs and activities.</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 shadow-sm"
            />
          </div>
        </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No history found</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              {searchTerm ? "No startups match your search." : "You haven't generated any startup ideas yet."}
            </p>
            {!searchTerm && (
              <Link to="/create" className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 font-medium text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors">
                Create First Startup
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Startup Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Idea Snippet</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStartups.map((startup) => {
                  const categoryText = (startup.aiResponse && typeof startup.aiResponse === 'object' && startup.aiResponse.category) 
                    ? startup.aiResponse.category 
                    : (startup.category || startup.industry || "Analyzing...");
                    
                  return (
                    <tr key={startup._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-brand-50 p-2.5 rounded-xl text-brand-600 hidden sm:block">
                            <Rocket className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{startup.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {startup.createdAt ? new Date(startup.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Generated by AI"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="text-[10px] font-bold tracking-wider uppercase bg-brand-50 text-brand-700 border border-brand-100 px-2.5 py-1 rounded-md inline-block max-w-[200px] truncate align-middle"
                          title={categoryText}
                        >
                          {categoryText}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 hidden md:table-cell max-w-xs truncate">
                        {startup.idea}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/startup/${startup._id}`}
                            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(startup._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
}
