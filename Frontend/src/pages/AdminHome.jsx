import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  FileText, 
  Building,
  Sparkles
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config/api";

const AdminHome = () => {
  const [counts, setCounts] = useState({ Resolved: 0, Rejected: 0 });
  const [error, setError] = useState("");
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") return;

    const fetchStatusCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/report/status-counts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCounts(res.data.data || { Resolved: 0, Rejected: 0 });
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report counts.");
      }
    };

    fetchStatusCounts();
  }, [isAuthenticated, userRole]);

  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors duration-200">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center max-w-sm space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 dark:text-red-400 mx-auto flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">This area is restricted to authorized municipal officers.</p>
          <Link to="/login">
            <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
              Sign In as Admin
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>Authority Management Portal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Road Safety Command Center
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Review citizen incident filings, verify pothole and hazard complaints, and upload proof photos to mark issues resolved.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/complaints">
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                <ShieldAlert size={18} />
                <span>Manage Live Complaints</span>
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/solves-complaints">
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm shadow-sm transition-all cursor-pointer">
                <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" />
                <span>Resolved Archives</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Resolved KPI */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm dark:shadow-xl transition-all space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{counts.Resolved || 0}</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Resolved Incidents</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Total road hazards successfully repaired with verified after-fix photos uploaded.
              </p>
            </div>
            <Link to="/solves-complaints" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 pt-2">
              <span>View Resolved Records</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Rejected KPI */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-red-500/40 shadow-sm dark:shadow-xl transition-all space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <XCircle size={28} />
              </div>
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{counts.Rejected || 0}</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Rejected / Spam Submissions</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Reports disqualified due to duplicate submissions, invalid photos, or off-scope issues.
              </p>
            </div>
            <Link to="/complaints" className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 pt-2">
              <span>Review Submissions</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default AdminHome;

