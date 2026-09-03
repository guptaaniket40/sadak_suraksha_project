import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, PhoneCall, ShieldCheck, Heart, ArrowRight } from "lucide-react";

const UserFooter = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 mt-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-blue-600 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <span className="text-base">🚦</span>
                </div>
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white">
                Sadak<span className="text-orange-500">Suraksha</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              India's community-driven road safety initiative. Empowering citizens to report potholes, signals, and hazards for swift authority action.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck size={16} />
              <span>Verified Citizen Reporting Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Citizen Portal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/report" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 flex items-center gap-1.5 transition-colors">
                  <ArrowRight size={14} className="text-slate-400" />
                  <span>Report a Hazard</span>
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 flex items-center gap-1.5 transition-colors">
                  <ArrowRight size={14} className="text-slate-400" />
                  <span>Track My Complaints</span>
                </Link>
              </li>
              <li>
                <Link to="/city-overview" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 flex items-center gap-1.5 transition-colors">
                  <ArrowRight size={14} className="text-slate-400" />
                  <span>City Solved Reports</span>
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 flex items-center gap-1.5 transition-colors">
                  <ArrowRight size={14} className="text-slate-400" />
                  <span>About Initiative</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <PhoneCall size={16} className="text-red-500 dark:text-red-400" />
              <span>Emergency Helplines</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-xs">
                <span className="text-slate-700 dark:text-slate-300">NHAI Road Helpline</span>
                <span className="font-bold text-orange-500 text-sm">1033</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-xs">
                <span className="text-slate-700 dark:text-slate-300">National Emergency</span>
                <span className="font-bold text-red-500 text-sm">112</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-xs">
                <span className="text-slate-700 dark:text-slate-300">Ambulance Service</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">108</span>
              </div>
            </div>
          </div>

          {/* Connect & Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Get in Touch
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Have suggestions or want to integrate with your local municipal corporation? Reach out to our team.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/shivam260304/Sadak-Suraksha"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-all shadow-xs"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/shivamrajput263/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:border-blue-500/40 transition-all shadow-xs"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Sadak Suraksha. Open Infrastructure Initiative.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built for Safer Commutes in India</span>
            <Heart size={14} className="text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;