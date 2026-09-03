import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, ShieldCheck, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 mt-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚦</span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">SadakSuraksha Admin</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Official authority dashboard for tracking road damage complaints, resolving verified issues, and updating citizens with proof photos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Authority Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/complaints" className="text-slate-600 dark:text-slate-400 hover:text-amber-500 flex items-center gap-1.5 transition-colors">
                  <ArrowRight size={13} className="text-slate-400" />
                  <span>Pending Complaints</span>
                </Link>
              </li>
              <li>
                <Link to="/solves-complaints" className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 flex items-center gap-1.5 transition-colors">
                  <ArrowRight size={13} className="text-slate-400" />
                  <span>Resolved Archives</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Status & Support */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              System Support
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Technical Support: hppdeepseek10@gmail.com</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-4 text-center text-xs text-slate-500">
          🇮🇳 Sadak Suraksha Administration System © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
