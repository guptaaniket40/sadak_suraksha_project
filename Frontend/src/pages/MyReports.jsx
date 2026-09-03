import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FileText, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  PlusCircle, 
  ShieldCheck, 
  Image as ImageIcon,
  MessageSquare,
  AlertTriangle,
  Layers,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import UserFooter from "../components/UserFooter";

const STATUS_BADGES = {
  Submitted: { bg: "bg-slate-700/60 text-slate-300 border-slate-600", dot: "bg-slate-400" },
  "Under Review": { bg: "bg-amber-500/10 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  "In Progress": { bg: "bg-blue-500/10 text-blue-300 border-blue-500/30", dot: "bg-blue-400" },
  Resolved: { bg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
  Rejected: { bg: "bg-red-500/10 text-red-300 border-red-500/30", dot: "bg-red-400" }
};

const STAGES = ["Submitted", "Under Review", "In Progress", "Resolved"];

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      setError("Please login to view your reported road incidents.");
      setLoading(false);
      return;
    }
    if (isAuthenticated === null || isAuthenticated === undefined) return;

    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/myReport", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reportsData = Array.isArray(res.data.data?.reports) ? res.data.data.reports : [];
        setReports(reportsData);
        setFiltered(reportsData);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not fetch your reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated]);

  useEffect(() => {
    let result = reports;

    if (activeTab !== "All") {
      result = result.filter(r => r.status === activeTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        r =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.location && r.location.toLowerCase().includes(q)) ||
          (r.category && r.category.toLowerCase().includes(q)) ||
          (r.created_at && new Date(r.created_at).toLocaleDateString().includes(q))
      );
    }

    setFiltered(result);
  }, [search, activeTab, reports]);

  const getStageIndex = (status) => {
    if (status === "Rejected") return -1;
    return STAGES.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
              <FileText size={14} />
              <span>Citizen Incident Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Submitted Reports</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Track real-time progress and authority resolution proofs for your reported hazards.
            </p>
          </div>

          <Link to="/report">
            <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <PlusCircle size={18} />
              <span>Report New Issue</span>
            </button>
          </Link>
        </div>

        {/* Search & Status Filters */}
        <div className="space-y-4 mb-8">
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, location, category, or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {["All", "Submitted", "Under Review", "In Progress", "Resolved", "Rejected"].map((tab) => {
              const count = tab === "All" ? reports.length : reports.filter(r => r.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                      : "bg-white dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error / Feedback */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 animate-pulse h-48"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
              🚦
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Reports Found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {search || activeTab !== "All"
                ? "No matching reports found for your filter criteria."
                : "You haven't submitted any road hazard reports yet."}
            </p>
            <Link to="/report">
              <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors mt-2">
                Submit Your First Report
              </button>
            </Link>
          </div>
        ) : (
          /* Reports Grid / Cards */
          <div className="space-y-6">
            {filtered.map((report) => {
              const currentStageIdx = getStageIndex(report.status);
              const badge = STATUS_BADGES[report.status] || STATUS_BADGES.Submitted;

              return (
                <div
                  key={report.id || report._id}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-xl transition-all space-y-6"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold">
                          {report.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          <span>{report.status}</span>
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock size={13} />
                          {report.created_at || report.createdAt ? new Date(report.created_at || report.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{report.title}</h3>
                    </div>

                    <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 self-start">
                      Priority: <span className={report.priority === "High" ? "text-red-500 dark:text-red-400" : "text-amber-500 dark:text-amber-400"}>{report.priority}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{report.description}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80">
                    <MapPin size={15} className="text-orange-500 shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>

                  {/* Progress Step Indicator (Only if not rejected) */}
                  {report.status !== "Rejected" && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        {STAGES.map((stg, sIdx) => (
                          <span
                            key={sIdx}
                            className={sIdx <= currentStageIdx ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"}
                          >
                            {stg}
                          </span>
                        ))}
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${((currentStageIdx + 1) / STAGES.length) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Before vs After Images */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* User Report Image */}
                    {report.image_url || report.imageUrl ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <ImageIcon size={14} />
                          <span>Reported Photo (Before)</span>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 h-44 group relative">
                          <img
                            src={
                              (report.image_url || report.imageUrl).startsWith("http")
                                ? (report.image_url || report.imageUrl)
                                : `http://localhost:5000${report.image_url || report.imageUrl}`
                            }
                            alt="Citizen submitted hazard"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* Admin Proof Image (After) */}
                    {(report.admin_image_url || report.adminImageUrl) ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={14} />
                          <span>Authority Resolution Proof (After)</span>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-100 dark:bg-slate-950 h-44 group relative">
                          <img
                            src={
                              (report.admin_image_url || report.adminImageUrl).startsWith("http")
                                ? (report.admin_image_url || report.adminImageUrl)
                                : `http://localhost:5000${report.admin_image_url || report.adminImageUrl}`
                            }
                            alt="Authority resolution proof"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Admin Remarks */}
                  {(report.admin_remarks || report.adminRemarks) && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                      <ShieldCheck size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">Official Authority Remarks:</span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{report.admin_remarks || report.adminRemarks}</p>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      <UserFooter />
    </div>
  );
};

export default MyReports;


