import React, { useState } from "react";
import axios from "axios";
import { 
  Camera, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  X, 
  Compass, 
  Send, 
  Info, 
  Layers,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import UserFooter from "../components/UserFooter";
import { API_BASE_URL } from "../config/api";

const CATEGORIES = [
  { id: "Pothole", label: "Pothole", icon: "🕳️" },
  { id: "Speed Bump", label: "Speed Bump", icon: "⛰️" },
  { id: "Road Crack", label: "Road Crack", icon: "⚡" },
  { id: "Faded Markings", label: "Faded Markings", icon: "🚧" },
  { id: "Traffic Signal", label: "Traffic Signal", icon: "🚦" },
  { id: "Debris", label: "Debris / Fallen Tree", icon: "🪨" },
  { id: "Streetlight", label: "Broken Streetlight", icon: "💡" },
  { id: "Other", label: "Other Hazard", icon: "📋" }
];

const PRIORITIES = [
  { id: "High", label: "High Priority", desc: "Dangerous / Accident Prone", color: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" },
  { id: "Medium", label: "Medium Priority", desc: "Disruptive / Slows Traffic", color: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20" },
  { id: "Low", label: "Low Priority", desc: "Minor Inconvenience", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20" }
];

const Report = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`);
        setLocating(false);
      },
      (err) => {
        console.error("Location error:", err);
        setLocating(false);
        alert("Could not retrieve your location. Please enter manually.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setMessage("Please log in first to submit an official road report.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("priority", priority);
      if (image) formData.append("image", image);

      const res = await axios.post(`${API_BASE_URL}/api/report`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSuccess(true);
      setMessage(res.data.message || "Hazard report submitted successfully! Authorities have been notified.");

      // Reset form
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setLocation("");
      setCategory("Pothole");
      setPriority("Medium");
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold">
            <AlertTriangle size={14} />
            <span>Citizen Incident Filing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Report a Road Hazard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Provide details of the pothole or damaged road infrastructure to notify local municipal authorities.
          </p>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in duration-200 ${
              isSuccess 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" 
                : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
            }`}
          >
            {isSuccess ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="e.g. Deep pothole causing skidding near Ring Road flyover"
              />
            </div>

            {/* Category Selector */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers size={16} className="text-blue-500" />
                <span>Hazard Category</span> <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-2xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                      category === cat.id
                        ? "bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Severity / Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      priority === p.id
                        ? `${p.color} border-current shadow-sm`
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-sm">{p.label}</div>
                    <div className="text-xs opacity-75 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location & GPS detect */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Location / Landmark <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locating}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  <Compass size={14} className={locating ? "animate-spin" : ""} />
                  <span>{locating ? "Locating..." : "📍 Detect My GPS"}</span>
                </button>
              </div>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Near City Center Mall, Sector 18, Road No. 4"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                placeholder="Describe the hazard extent, approximate depth/width, and potential risks to two-wheelers or heavy traffic..."
              />
            </div>

            {/* Photo Upload Dropzone */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Proof Photo (Recommended)
              </label>
              
              {!imagePreview ? (
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/80 transition-all cursor-pointer group">
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-600/20 group-hover:text-blue-500 text-slate-400 flex items-center justify-center transition-all">
                      <Camera size={26} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">Click or Drag & Drop photo here</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 max-w-sm">
                  <img src={imagePreview} alt="Hazard preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-red-400 hover:text-red-300 border border-slate-700 transition-colors cursor-pointer"
                    aria-label="Remove photo"
                  >
                    <X size={16} />
                  </button>
                  <div className="p-2.5 text-xs text-slate-600 dark:text-slate-300 truncate bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    📷 {image?.name}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-base shadow-xl shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Submitting Incident Report...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit Incident Report</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

      <UserFooter />
    </div>
  );
};

export default Report;


