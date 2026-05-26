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
      </Routes>
    </Router>
  );
}