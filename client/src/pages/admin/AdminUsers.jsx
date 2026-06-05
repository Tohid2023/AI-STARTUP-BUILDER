import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // active, blocked, or empty
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "", // "block", "unblock", "delete"
    user: null,
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

  // Implement 300ms debouncing logic for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on search change
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        params: {
          page,
          limit,
          search: debouncedSearch,
          status: filterStatus,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUsers(res.data.data.users);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      triggerToast(error.response?.data?.message || "Failed to fetch users list", "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleActionClick = (type, user) => {
    setConfirmModal({
      isOpen: true,
      type,
      user,
      processing: false,
      error: ""
    });
  };

  const handleConfirmAction = async () => {
    const { type, user } = confirmModal;
    if (!user) return;

    setConfirmModal(prev => ({ ...prev, processing: true, error: "" }));
    const token = localStorage.getItem("token");

    try {
      if (type === "block" || type === "unblock") {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/user/${user._id}/block`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          triggerToast(res.data.message, "success");
          fetchUsers();
        }
      } else if (type === "delete") {
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/admin/user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          triggerToast(res.data.message, "success");
          // If deleted last user on page, go back a page
          if (users.length === 1 && page > 1) {
            setPage(prev => prev - 1);
          } else {
            fetchUsers();
          }
        }
      }
      setConfirmModal({ isOpen: false, type: "", user: null, processing: false, error: "" });
    } catch (err) {
      console.error("Administrative execution failed:", err);
      setConfirmModal(prev => ({
        ...prev,
        processing: false,
        error: err.response?.data?.message || "Operation failed to complete."
      }));
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Alert */}
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
          <Users className="w-8 h-8 text-brand-400" />
          User Management
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          View, search, block, and soft-delete user accounts on the platform.
        </p>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl focus:outline-none focus:border-brand-500 text-sm placeholder-slate-500 text-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-44 px-3 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl focus:outline-none focus:border-brand-500 text-sm text-slate-300"
          >
            <option value="">All Account Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
            <span className="text-sm font-medium">Fetching accounts database...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center text-slate-500">
            <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold">No registered users matched your criteria.</p>
            <p className="text-xs text-slate-600 mt-1">Try updating your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Access Level</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Standing Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/20 text-slate-300 transition-colors">
                    <td className="p-4 font-bold text-white">{user.name}</td>
                    <td className="p-4 text-slate-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        user.role === "admin" 
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      {user.isBlocked ? (
                        <span className="flex items-center gap-1 text-red-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          Blocked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2.5">
                      <button
                        onClick={() => handleActionClick(user.isBlocked ? "unblock" : "block", user)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          user.isBlocked
                            ? "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                            : "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                        }`}
                        title={user.isBlocked ? "Unblock Account" : "Block Account"}
                      >
                        {user.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleActionClick("delete", user)}
                        className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete User"
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

        {/* Pagination controls footer */}
        {!loading && users.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between text-slate-400">
            <span className="text-xs">
              Showing <span className="font-bold text-white">{users.length}</span> of{" "}
              <span className="font-bold text-white">{total}</span> accounts
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

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${
                confirmModal.type === "delete" 
                  ? "bg-red-500/10 text-red-400" 
                  : "bg-amber-500/10 text-amber-400"
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white capitalize">
                  {confirmModal.type} Account?
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Are you sure you want to {confirmModal.type} user{" "}
                  <span className="text-white font-semibold">{confirmModal.user?.name}</span> (
                  {confirmModal.user?.email})?
                  {confirmModal.type === "delete" && " This is a soft deletion. The user will lose access immediately but their records are preserved."}
                </p>
              </div>
            </div>

            {confirmModal.error && (
              <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-xl text-xs text-red-400">
                {confirmModal.error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                disabled={confirmModal.processing}
                onClick={() => setConfirmModal({ isOpen: false, type: "", user: null, processing: false, error: "" })}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={confirmModal.processing}
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50 ${
                  confirmModal.type === "delete"
                    ? "bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/10"
                    : "bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/10"
                }`}
              >
                {confirmModal.processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  confirmModal.type === "delete" ? "Delete User" : `${confirmModal.type} User`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
