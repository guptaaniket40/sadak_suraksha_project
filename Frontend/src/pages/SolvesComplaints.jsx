import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Clock, 
  User, 
  Search, 
  Filter, 
  ShieldCheck, 
  Image as ImageIcon,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";

const SolvesComplaints = () => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, resolved, rejected

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/resolved-reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data = res.data.data?.reports || [];
        setReports(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    let data = reports;
    if (filter === "resolved") {
      data = data.filter((r) => r.status === "Resolved");
    } else if (filter === "rejected") {
      data = data.filter((r) => r.status === "Rejected");
    } else {
      data = data.filter((r) => r.status === "Resolved" || r.status === "Rejected");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.location && r.location.toLowerCase().includes(q)) ||
          (r.category && r.category.toLowerCase().includes(q))
      );
    }

    setFiltered(data);
  }, [filter, search, reports]);

  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="p-8 rounded-3xl bg-slate-800 border border-slate-700 text-center max-w-sm">
          <ShieldAlert size={32} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-xs text-slate-400">Admins only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 size={14} />
            <span>Closed Incidents Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Resolved & Disqualified Records
          </h1>
          <p className="text-sm text-slate-400">
            Historical audit log of all completed repairs with proof photos and rejected invalid filings.
          </p>
        </div>

        {/* Search & Filter Tabs */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search archived complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 text-white placeholder-slate-400 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Records", count: reports.length },
              { id: "resolved", label: "Resolved", count: reports.filter(r => r.status === "Resolved").length },
              { id: "rejected", label: "Rejected", count: reports.filter(r => r.status === "Rejected").length }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                  filter === t.id
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{t.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === t.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-slate-800/40 border border-slate-800 animate-pulse h-64"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 max-w-md mx-auto space-y-3">
            <div className="text-4xl">📁</div>
            <h3 className="font-bold text-lg text-white">No Archived Records</h3>
            <p className="text-xs text-slate-400">No records found matching current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((report) => {
              const isResolved = report.status === "Resolved";
              return (
                <div
                  key={report.id || report._id}
                  className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border shadow-xl space-y-4 flex flex-col justify-between transition-all ${
                    isResolved ? "border-emerald-500/30 hover:border-emerald-500/50" : "border-red-500/30 hover:border-red-500/50"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
                        isResolved ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-red-500/10 text-red-300 border-red-500/30"
                      }`}>
                        {isResolved ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{report.status}</span>
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <User size={13} />
                        <span>{report.user?.username || "Citizen"}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white">{report.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">{report.description}</p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <MapPin size={14} className="text-orange-400 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400">Reported Photo</span>
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        {report.image_url || report.imageUrl ? (
                          <img
                            src={
                              (report.image_url || report.imageUrl).startsWith("http")
                                ? (report.image_url || report.imageUrl)
                                : `http://localhost:5000${report.image_url || report.imageUrl}`
                            }
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">No Photo</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className={`text-[11px] font-semibold ${isResolved ? "text-emerald-400" : "text-red-400"}`}>
                        {isResolved ? "Fixed Proof" : "Status"}
                      </span>
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        {(report.admin_image_url || report.adminImageUrl) ? (
                          <img
                            src={
                              (report.admin_image_url || report.adminImageUrl).startsWith("http")
                                ? (report.admin_image_url || report.adminImageUrl)
                                : `http://localhost:5000${report.admin_image_url || report.adminImageUrl}`
                            }
                            alt="Admin proof"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
                            {isResolved ? "No Proof" : "Rejected"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  {(report.admin_remarks || report.adminRemarks) && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-slate-200">Remarks: </span>
                      <span>{report.admin_remarks || report.adminRemarks}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 pt-1">
                    Logged: {new Date(report.created_at || report.createdAt).toLocaleDateString()}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default SolvesComplaints;

