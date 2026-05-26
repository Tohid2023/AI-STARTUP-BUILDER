import { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Lock, Save, Loader2, CheckCircle2 } from "lucide-react";
import Layout from "../components/Layout";

export default function Settings() {
  const [form, setForm] = useState({ name: "", email: "", currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/user/profile", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setForm({ name: res.data.name, email: res.data.email, currentPassword: "", newPassword: "" });
      } catch (err) {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updateData = { name: form.name };
      if (form.newPassword) {
        if (!form.currentPassword) {
          setError("Current password is required to set a new password.");
          setSaving(false);
          return;
        }
        updateData.password = form.newPassword;
        updateData.currentPassword = form.currentPassword;
      }
      
      const res = await axios.put("http://localhost:5001/api/user/profile", updateData, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      
      setMessage("Profile updated successfully!");
      setForm(prev => ({ ...prev, name: res.data.name, currentPassword: "", newPassword: "" }));
      
      // refresh window to update navbar or we could just let it be
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">Manage your account and preferences.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-brand-500/5 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="p-6 md:p-8 relative z-10">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-500" /> Profile Information
            </h2>
            
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-5">
                {message && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {message}
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="relative group">
                    <User className={`absolute left-3.5 top-3 w-5 h-5 transition-colors duration-200 ${focusedField === 'name' ? 'text-brand-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      disabled
                      value={form.email}
                      className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl pl-11 pr-4 py-2.5 cursor-not-allowed font-medium"
                      title="Email cannot be changed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 font-medium">Your email address is used for login and cannot be changed.</p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-brand-500" /> Security
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                      <div className="relative group">
                        <Lock className={`absolute left-3.5 top-3 w-5 h-5 transition-colors duration-200 ${focusedField === 'currentPassword' ? 'text-brand-500' : 'text-gray-400'}`} />
                        <input
                          type="password"
                          placeholder="Enter current password if changing"
                          value={form.currentPassword}
                          onFocus={() => setFocusedField('currentPassword')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <div className="relative group">
                        <Lock className={`absolute left-3.5 top-3 w-5 h-5 transition-colors duration-200 ${focusedField === 'newPassword' ? 'text-brand-500' : 'text-gray-400'}`} />
                        <input
                          type="password"
                          placeholder="Leave blank to keep current password"
                          value={form.newPassword}
                          onFocus={() => setFocusedField('newPassword')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="gradient-bg px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-70 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
