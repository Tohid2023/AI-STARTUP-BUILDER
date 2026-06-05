import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Lightbulb,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  FileText,
  Calendar,
  User,
  Eye,
  Rocket,
  BookmarkCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function AdminIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    idea: null,
    processing: false,
    error: ""
  });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 4000);
  };

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/ideas`, {
        params: {
          page,
          limit,
          startDate,
          endDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setIdeas(res.data.data.ideas);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to load ideas:", error);
      triggerToast(error.response?.data?.message || "Failed to fetch startup ideas", "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleDeleteClick = (idea) => {
    setConfirmDeleteModal({
      isOpen: true,
      idea,
      processing: false,
      error: ""
    });
  };

  const handleConfirmDelete = async () => {
    const { idea } = confirmDeleteModal;
    if (!idea) return;

    setConfirmDeleteModal(prev => ({ ...prev, processing: true, error: "" }));
    const token = localStorage.getItem("token");

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/idea/${idea._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        triggerToast(res.data.message, "success");
        if (ideas.length === 1 && page > 1) {
          setPage(prev => prev - 1);
        } else {
          fetchIdeas();
        }
      }
      setConfirmDeleteModal({ isOpen: false, idea: null, processing: false, error: "" });
    } catch (err) {
      console.error("Failed to delete idea:", err);
      setConfirmDeleteModal(prev => ({
        ...prev,
        processing: false,
        error: err.response?.data?.message || "Operation failed to complete."
      }));
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast alert popup */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border text-sm font-semibold flex items-center gap-2 animate-bounce ${
          toast.type === "error" 
            ? "bg-red-950 border-red-800 text-red-300" 
            : "bg-emerald-950 border-emerald-800 text-emerald-300"
        }`}>
          {toast.type === "error" ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-brand-400" />
          Startup Ideas Catalog
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Browse, review, and delete AI-generated startup concepts and pricing sheets.
        </p>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Start Date */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-xl focus:outline-none focus:border-brand-500 text-xs text-slate-300"
            />
          </div>
          {/* End Date */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-xl focus:outline-none focus:border-brand-500 text-xs text-slate-300"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setPage(1);
            }}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Ideas list panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
            <span className="text-sm font-medium">Fetching generated concepts...</span>
          </div>
        ) : ideas.length === 0 ? (
          <div className="p-20 text-center text-slate-500">
            <Rocket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold">No startup ideas matched your current parameters.</p>
            <p className="text-xs text-slate-600 mt-1">Users haven't generated matching products yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Concept Title</th>
                  <th className="p-4">Industry / Category</th>
                  <th className="p-4">Generated By</th>
                  <th className="p-4">Creation Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ideas.map((idea) => (
                  <tr key={idea._id} className="hover:bg-slate-800/20 text-slate-300 transition-colors">
                    <td className="p-4 font-bold text-white max-w-xs truncate">{idea.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950 text-slate-400 border border-slate-800">
                        {idea.category || idea.industry || "General"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{idea.createdBy?.name || "Deleted User"}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{idea.createdBy?.email || ""}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(idea.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2.5">
                      <button
                        onClick={() => setSelectedIdea(idea)}
                        className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                        title="View Full Specifications"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(idea)}
                        className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete Idea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer controls pagination */}
        {!loading && ideas.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between text-slate-400">
            <span className="text-xs">
              Showing <span className="font-bold text-white">{ideas.length}</span> of{" "}
              <span className="font-bold text-white">{total}</span> generated concepts
            </span>
            <div className="flex gap-2.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="flex items-center text-xs font-semibold px-2 text-slate-300">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Spec Viewer Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
                  {selectedIdea.category || selectedIdea.industry || "General"}
                </span>
                <h3 className="text-xl font-black text-white mt-2 leading-tight">
                  {selectedIdea.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Generated by {selectedIdea.createdBy?.name || "Deleted User"} ({selectedIdea.createdBy?.email || ""})
                </p>
              </div>
              <button
                onClick={() => setSelectedIdea(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable specs) */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
              {/* Concept description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Original Prompt / Core Idea
                </h4>
                <p className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs leading-relaxed text-slate-300">
                  {selectedIdea.idea}
                </p>
              </div>

              {/* AI response specifications */}
              {selectedIdea.aiResponse ? (
                <div className="space-y-6">
                  {/* Executive Summary */}
                  {selectedIdea.aiResponse.tagline && (
                    <div className="space-y-1 bg-brand-500/5 border border-brand-500/10 p-4 rounded-xl">
                      <span className="text-[9px] font-bold text-brand-400 uppercase tracking-widest">Tagline</span>
                      <p className="text-sm font-bold text-white leading-relaxed">"{selectedIdea.aiResponse.tagline}"</p>
                    </div>
                  )}

                  {/* Tech stack recommendations */}
                  {selectedIdea.mlRecommendations?.techStack && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Rocket className="w-4 h-4 text-slate-500" />
                        Recommended Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedIdea.mlRecommendations.techStack.map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-950 border border-slate-800 text-xs rounded-xl font-medium text-slate-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Model details */}
                  {selectedIdea.aiResponse.pricingModel && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <BookmarkCheck className="w-4 h-4 text-slate-500" />
                        Monetization Strategy
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(selectedIdea.aiResponse.pricingModel).map(([tier, data], i) => (
                          <div key={i} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1.5">
                            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">{tier} Tier</span>
                            <div className="text-lg font-bold text-white">{typeof data === 'object' ? data.price : data}</div>
                            <p className="text-xs text-slate-500 leading-normal">
                              {typeof data === 'object' && Array.isArray(data.features) 
                                ? data.features.join(", ") 
                                : typeof data === 'object' && data.description 
                                  ? data.description 
                                  : "Standard access tier settings"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 text-xs text-center py-6">No detailed AI response payload compiled.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
              <button
                onClick={() => setSelectedIdea(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl flex-shrink-0 bg-red-500/10 text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Delete Startup Idea?
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Are you sure you want to soft-delete concept{" "}
                  <span className="text-white font-semibold">"{confirmDeleteModal.idea?.title}"</span>?
                  This action is reversible by administrators and will soft delete the entry immediately.
                </p>
              </div>
            </div>

            {confirmDeleteModal.error && (
              <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-xl text-xs text-red-400">
                {confirmDeleteModal.error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                disabled={confirmDeleteModal.processing}
                onClick={() => setConfirmDeleteModal({ isOpen: false, idea: null, processing: false, error: "" })}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/85 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={confirmDeleteModal.processing}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-50 shadow-md shadow-red-600/10 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {confirmDeleteModal.processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete Idea"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
