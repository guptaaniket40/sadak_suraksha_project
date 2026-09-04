import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Clock, 
  User, 
  Upload, 
  MessageSquare, 
  Camera, 
  Search, 
  AlertTriangle,
  RefreshCw,
  Save,
  Check,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";
import { API_BASE_URL, getImageUrl } from "../config/api";

const statusOptions = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
];

const Complaints = () => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { isAuthenticated, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploadingReportId, setUploadingReportId] = useState(null);
  const [savingRemarksId, setSavingRemarksId] = useState(null);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data.data?.reports || [];
        setReports(list);
        setFiltered(list);
        setError("");

        const initialRemarks = {};
        list.forEach((report) => {
          initialRemarks[report.id || report._id] = report.admin_remarks || report.adminRemarks || "";
        });
        setRemarks(initialRemarks);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    let list = reports.filter((r) => r.status !== "Resolved" && r.status !== "Rejected");
    
    if (selectedStatus !== "All") {
      list = list.filter((r) => r.status === selectedStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.location && r.location.toLowerCase().includes(q)) ||
          (r.category && r.category.toLowerCase().includes(q)) ||
          (r.user?.username && r.user.username.toLowerCase().includes(q))
      );
    }

    setFiltered(list);
  }, [search, selectedStatus, reports]);

  const handleStatusChange = async (reportId, newStatus) => {
    const report = reports.find((r) => (r.id || r._id) === reportId);

    if (newStatus === "Resolved" && !(report.admin_image_url || report.adminImageUrl)) {
      setError("Official proof photo must be uploaded before marking a report as Resolved.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/api/complaints/${reportId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prev) =>
        prev.map((r) => ((r.id || r._id) === reportId ? { ...r, status: newStatus } : r))
      );
      setSuccessMsg(`Status updated to "${newStatus}"`);
      setTimeout(() => setSuccessMsg(""), 3000);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleReject = async (reportId) => {
    if (!window.confirm("Are you sure you want to reject this report?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/api/complaints/${reportId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prev) => prev.filter((r) => (r.id || r._id) !== reportId));
      setSuccessMsg("Report rejected.");
      setTimeout(() => setSuccessMsg(""), 3000);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject report.");
    }
  };

  const handleImageUpload = async (reportId, file) => {
    if (!file) return;
    setUploadingReportId(reportId);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("adminImage", file);

      const res = await axios.post(
        `${API_BASE_URL}/api/complaints/${reportId}/admin-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newUrl = res.data.data.report.admin_image_url || res.data.data.report.adminImageUrl;

      setReports((prev) =>
        prev.map((r) =>
          (r.id || r._id) === reportId ? { ...r, admin_image_url: newUrl, adminImageUrl: newUrl } : r
        )
      );
      setSuccessMsg("Resolution proof photo uploaded successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload admin image.");
    } finally {
      setUploadingReportId(null);
    }
  };

  const saveAdminRemarks = async (reportId) => {
    if (!remarks[reportId]) return;
    setSavingRemarksId(reportId);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/api/complaints/${reportId}/admin-remarks`,
        { remarks: remarks[reportId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("Admin remarks saved.");
      setTimeout(() => setSuccessMsg(""), 3000);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save remarks.");
    } finally {
      setSavingRemarksId(null);
    }
  };

  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors duration-200">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center max-w-sm shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 dark:text-red-400 mx-auto flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Admins only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
              <ShieldAlert size={14} />
              <span>Pending Action Queue</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Active Incident Complaints</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Verify road damage reports, assign crews, upload proof, and update resolution states.
            </p>
          </div>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm flex items-center gap-2.5">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, location, citizen, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
            {["All", "Submitted", "Under Review", "In Progress"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedStatus === st
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-sm"
                    : "bg-white dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-8 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 animate-pulse h-64"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 max-w-md mx-auto space-y-3 shadow-sm">
            <div className="text-4xl">🎉</div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">All Caught Up!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">No active complaints pending action in this category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((report) => {
              const repId = report.id || report._id;
              return (
                <div
                  key={repId}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-xl space-y-6 transition-all"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold">
                          {report.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
                          Priority: {report.priority}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <User size={13} />
                          <span>{report.user?.username || "Citizen"}</span>
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          • {new Date(report.created_at || report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{report.title}</h3>
                    </div>

                    {/* Status Select & Reject */}
                    <div className="flex items-center gap-2.5 self-start">
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(repId, e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer shadow-xs"
                      >
                        {statusOptions
                          .filter((st) => st !== "Rejected")
                          .map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                      </select>

                      <button
                        onClick={() => handleReject(repId)}
                        className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{report.description}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <MapPin size={15} className="text-orange-500 shrink-0" />
                    <span>{report.location}</span>
                  </div>

                  {/* Photos Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Citizen Photo */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">📸 Citizen Reported Photo</span>
                      <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        {report.image_url || report.imageUrl ? (
                          <img
                            src={getImageUrl(report.image_url || report.imageUrl)}
                            alt="Reported"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-600">No Photo Provided</div>
                        )}
                      </div>
                    </div>

                    {/* Admin Resolution Proof Upload */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✅ Authority Proof Photo</span>
                      <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative p-3">
                        {report.admin_image_url || report.adminImageUrl ? (
                          <img
                            src={getImageUrl(report.admin_image_url || report.adminImageUrl)}
                            alt="Proof"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <label className="w-full h-full border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors p-2 bg-white/50 dark:bg-slate-950/50">
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingReportId === repId}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageUpload(repId, e.target.files[0]);
                                  e.target.value = null;
                                }
                              }}
                              className="hidden"
                            />
                            <Camera size={24} className="text-slate-400 dark:text-slate-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                              {uploadingReportId === repId ? "Uploading..." : "Upload After-Fix Proof"}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remarks Editor */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Official Remarks / Notes for Citizen:
                    </label>
                    <div className="flex gap-2">
                      <textarea
                        rows={2}
                        value={remarks[repId] || ""}
                        onChange={(e) => setRemarks({ ...remarks, [repId]: e.target.value })}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-500 resize-none"
                        placeholder="e.g. Patchwork completed by Ward 4 maintenance team on 28th Feb..."
                      />
                      <button
                        onClick={() => saveAdminRemarks(repId)}
                        disabled={savingRemarksId === repId}
                        className="px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        {savingRemarksId === repId ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                        <span>Save</span>
                      </button>
                    </div>
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

export default Complaints;

