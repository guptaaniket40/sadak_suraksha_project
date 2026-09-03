import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Shield, 
  Zap, 
  Building, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Users, 
  PhoneCall,
  Bot
} from "lucide-react";
import ChatPopup from "../components/ChatPopup";
import UserFooter from "../components/UserFooter";

const STATS = [
  { label: "Hazards Reported", value: "2,500+", icon: AlertTriangle, color: "text-orange-500" },
  { label: "Issues Resolved", value: "1,980+", icon: CheckCircle2, color: "text-emerald-500" },
  { label: "Active Cities", value: "35+", icon: Building, color: "text-blue-500" },
  { label: "Avg Resolution Time", value: "36 hrs", icon: Clock, color: "text-purple-500" }
];

const STEPS = [
  {
    step: "01",
    title: "Spot & Snap",
    desc: "Take a photo of the pothole, damaged signal, or broken divider and detect location automatically.",
    icon: Camera,
    color: "from-orange-500 to-amber-500"
  },
  {
    step: "02",
    title: "AI Analysis & Routing",
    desc: "Our system categorizes the issue severity and routes it directly to local municipal authorities.",
    icon: Zap,
    color: "from-blue-600 to-indigo-600"
  },
  {
    step: "03",
    title: "Verified Resolution",
    desc: "Officials fix the issue and upload proof photos. You get real-time progress notifications.",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-600"
  }
];

const CATEGORIES = [
  { name: "Potholes & Craters", icon: "🕳️", desc: "Dangerous road depressions & surface craters" },
  { name: "Traffic Signals", icon: "🚦", desc: "Malfunctioning lights, missing timers & power cuts" },
  { name: "Broken Streetlights", icon: "💡", desc: "Dark spots, blown bulbs & exposed wires" },
  { name: "Water Logging", icon: "🌊", desc: "Monsoon flooding & blocked roadside drains" },
  { name: "Road Cracks & Sinks", icon: "⚡", desc: "Structural damage & asphalt peeling" },
  { name: "Damaged Dividers", icon: "🚧", desc: "Broken concrete barriers & hazard obstacles" }
];

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 selection:bg-orange-500 selection:text-white transition-colors duration-200">
      
      {/* Background ambient glow */}
      <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-500/10 dark:from-blue-600/20 via-indigo-500/10 dark:via-indigo-600/10 to-orange-500/10 blur-[130px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm dark:shadow-md backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                🇮🇳 AI-Powered Citizen Road Safety Initiative
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Safer Roads, <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                One Report
              </span>{" "}
              at a Time.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Empowering citizens across India to report potholes, dangerous road damages, and broken signals. Direct tracking with municipal authorities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/report" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                  <Camera size={20} />
                  <span>Report a Hazard Now</span>
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/city-overview" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 font-semibold text-base shadow-sm dark:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                  <CheckCircle2 size={19} className="text-emerald-500" />
                  <span>View Solved Issues</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm dark:shadow-lg flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/80 flex items-center justify-center shrink-0 shadow-inner ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-950/70 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-orange-500">Simple 3-Step Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">How Sadak Suraksha Works</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              From snapping a photo on your phone to completed repair work by local authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {STEPS.map((item, index) => {
              const StepIcon = item.icon;
              return (
                <div 
                  key={index}
                  className="relative p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <StepIcon size={26} />
                    </div>
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-slate-400 dark:group-hover:text-slate-600 transition-colors">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Reportable Categories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-blue-500">Road Hazards</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">What You Can Report</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Any issue affecting citizen safety or traffic flow on national, state, or municipal roads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {CATEGORIES.map((cat, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-blue-500/40 transition-all duration-200 group flex items-start gap-4 shadow-xs"
              >
                <div className="text-3xl p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">{cat.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-700/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold">
                Make Your City Safer
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Spotted a hazard on your route today?
              </h3>
              <p className="text-sm text-blue-200/80">
                It takes less than 60 seconds to file a report with photo and location. Help prevent road accidents!
              </p>
            </div>
            <Link to="/report" className="shrink-0">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Submit Report Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Chatbot Launcher Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        aria-label="Open chat support"
        className="fixed right-6 bottom-6 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/20 group"
      >
        <Bot size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
      </button>

      {/* Chat Popup Widget */}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Modern Footer */}
      <UserFooter />
    </div>
  );
};

export default Home;


