import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import { 
  ShieldAlert, 
  Home, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  Building2, 
  Info,
  Sun,
  Moon
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80"
    }`;

  const commonUserLinks = (
    <>
      <Link to="/" onClick={() => setIsOpen(false)} className={linkClass("/")}>
        <Home size={17} />
        <span>Home</span>
      </Link>
      <Link to="/report" onClick={() => setIsOpen(false)} className={linkClass("/report")}>
        <PlusCircle size={17} className="text-orange-500" />
        <span>Report Issue</span>
      </Link>
      <Link to="/my-reports" onClick={() => setIsOpen(false)} className={linkClass("/my-reports")}>
        <FileText size={17} />
        <span>My Reports</span>
      </Link>
      <Link to="/city-overview" onClick={() => setIsOpen(false)} className={linkClass("/city-overview")}>
        <Building2 size={17} />
        <span>City Solved</span>
      </Link>
      <Link to="/aboutus" onClick={() => setIsOpen(false)} className={linkClass("/aboutus")}>
        <Info size={17} />
        <span>About</span>
      </Link>
    </>
  );

  const adminLinks = (
    <>
      <Link to="/admin-home" onClick={() => setIsOpen(false)} className={linkClass("/admin-home")}>
        <Home size={17} />
        <span>Dashboard</span>
      </Link>
      <Link to="/complaints" onClick={() => setIsOpen(false)} className={linkClass("/complaints")}>
        <ShieldAlert size={17} className="text-amber-500" />
        <span>Complaints</span>
      </Link>
      <Link to="/solves-complaints" onClick={() => setIsOpen(false)} className={linkClass("/solves-complaints")}>
        <CheckCircle2 size={17} className="text-emerald-500" />
        <span>Solved Reports</span>
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-white shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link 
              to={userRole === "admin" ? "/admin-home" : "/"} 
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <span className="text-lg">🚦</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Sadak<span className="text-orange-500">Suraksha</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                  {userRole === "admin" ? "Official Authority Portal" : "Citizen Road Safety"}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
            {isAuthenticated ? (userRole === "admin" ? adminLinks : commonUserLinks) : (
              <>
                <Link to="/" className={linkClass("/")}>
                  <Home size={17} />
                  <span>Home</span>
                </Link>
                <Link to="/city-overview" className={linkClass("/city-overview")}>
                  <Building2 size={17} />
                  <span>City Overview</span>
                </Link>
                <Link to="/aboutus" className={linkClass("/aboutus")}>
                  <Info size={17} />
                  <span>About</span>
                </Link>
              </>
            )}
          </div>

          {/* Actions: Theme Toggle + Auth Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              aria-label="Toggle dark/light theme"
            >
              {isDark ? (
                <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={18} className="text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
                  {userRole === "admin" ? (
                    <>
                      <ShieldCheck size={14} className="text-amber-500 dark:text-amber-400" />
                      <span className="font-semibold text-amber-600 dark:text-amber-300">Admin</span>
                    </>
                  ) : (
                    <>
                      <User size={14} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-blue-600 dark:text-blue-300">Citizen</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu and Theme Toggle button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              aria-label="Toggle dark/light theme"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 space-y-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {isAuthenticated ? (userRole === "admin" ? adminLinks : commonUserLinks) : (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className={linkClass("/")}>
                  <Home size={17} />
                  <span>Home</span>
                </Link>
                <Link to="/city-overview" onClick={() => setIsOpen(false)} className={linkClass("/city-overview")}>
                  <Building2 size={17} />
                  <span>City Overview</span>
                </Link>
                <Link to="/aboutus" onClick={() => setIsOpen(false)} className={linkClass("/aboutus")}>
                  <Info size={17} />
                  <span>About</span>
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


