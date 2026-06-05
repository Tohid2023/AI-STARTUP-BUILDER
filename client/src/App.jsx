import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateStartup from "./pages/CreateStartup";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StartupDetails from "./pages/StartupDetails";
import History from "./pages/History";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";

// Administrative components
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminIdeas from "./pages/admin/AdminIdeas";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateStartup />} />
        <Route path="/startup/:id" element={<StartupDetails />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Protected Administrative Section */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/ideas" element={<AdminLayout><AdminIdeas /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
        </Route>
      </Routes>
    </Router>
  );
}