import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  User, 
  Search, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import UserFooter from "../components/UserFooter";
import { API_BASE_URL, getImageUrl } from "../config/api";

const CityOverview = () => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResolvedReports = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/resolved-reports/onlyresolved`);
        const list = res.data.data?.reports || [];
        setReports(list);
        setFiltered(list);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not fetch resolved reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedReports();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(reports);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      reports.filter(
        (r) =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.location && r.location.toLowerCase().includes(q)) ||
          (r.category && r.category.toLowerCase().includes(q))
      )
    );
  }, [search, reports]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 size={14} />
            <span>Public Transparency Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            City Road Resolution Wall
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Real-world road damages reported by citizens and officially fixed with photo proof by local authorities.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by locality, hazard type, or road name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm dark:shadow-xl transition-all"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 animate-pulse h-64"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md mx-auto">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 max-w-md mx-auto space-y-3 shadow-sm">
            <div className="text-4xl">🌟</div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Solved Reports Found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Try searching for a different area or keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((report) => (
              <div
                key={report.id || report._id}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm dark:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>Resolved</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        {report.category || "Road Hazard"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <User size={13} />
                      <span>{report.user?.username || "Citizen"}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">{report.title}</h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{report.description}</p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <MapPin size={14} className="text-orange-500 shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>
                </div>

                {/* Images Comparison Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <ImageIcon size={12} />
                        <span>Before Report</span>
                      </span>
                      <div className="h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        {report.image_url || report.imageUrl ? (
                          <img
                            src={getImageUrl(report.image_url || report.imageUrl)}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-600">No Photo</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Fixed by Authority</span>
                      </span>
                      <div className="h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-emerald-500/30">
                        {(report.admin_image_url || report.adminImageUrl) ? (
                          <img
                            src={getImageUrl(report.admin_image_url || report.adminImageUrl)}
                            alt="Fixed by authority"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-600">Proof Pending</div>
                        )}
                      </div>
                    </div>
                  </div>

                {/* Remarks */}
                {(report.admin_remarks || report.adminRemarks) && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Action: </span>
                    <span>{report.admin_remarks || report.adminRemarks}</span>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      <UserFooter />
    </div>
  );
};

export default CityOverview;


