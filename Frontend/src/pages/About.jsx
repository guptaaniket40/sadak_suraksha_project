import React from "react";
import { 
  Shield, 
  Users, 
  MapPin, 
  Zap, 
  Bot, 
  Eye, 
  Building, 
  Heart,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import UserFooter from "../components/UserFooter";

const PILLARS = [
  {
    icon: Users,
    title: "Citizen-Powered & Transparent",
    desc: "Community reports create public visibility, accelerating municipal response times across Indian cities."
  },
  {
    icon: Zap,
    title: "AI & Severity Categorization",
    desc: "Incidents are tagged with priority levels (Potholes, Signals, Cracks) for quick emergency triage."
  },
  {
    icon: MapPin,
    title: "GPS Geotagged Accuracy",
    desc: "Precise latitude and longitude coordinates ensure repair crews reach exact hazard spots without delays."
  },
  {
    icon: Bot,
    title: "24/7 AI Chatbot Guidance",
    desc: "Bilingual virtual assistant guides citizens through reporting and checks live complaint statuses."
  },
  {
    icon: Eye,
    title: "Verified Resolution Proof",
    desc: "Authorities upload before & after photographic evidence upon fixing road issues for total accountability."
  },
  {
    icon: Building,
    title: "Scalable Nation-Wide",
    desc: "Engineered to support Municipal Corporations, State Highways, and National Highway Authorities (NHAI)."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Shield size={14} />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Safer Indian Roads Through Citizen Action
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            <span className="text-orange-400 font-semibold">Sadak Suraksha</span> is India's next-generation crowdsourced road safety infrastructure platform, connecting commuters directly with local municipal bodies.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 shadow-xl hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commitment Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-2xl text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Heart size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Pledge to Commuters</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every year, thousands of road accidents in India are caused by unattended potholes and damaged road infrastructure. By enabling rapid reporting and verified tracking, we aim to eliminate hazardous blindspots from our streets.
          </p>
        </div>

      </div>

      <UserFooter />
    </div>
  );
}