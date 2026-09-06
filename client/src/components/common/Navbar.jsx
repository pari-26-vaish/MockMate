import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Zap, ChevronDown, User, Settings, LogOut, Menu, X, Sparkles } from "lucide-react";
import "./Navbar.css";

const NAV_LINKS = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Interviews", path: "/interviews" },
  { name: "Progress", path: "/progress" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user?.name?.charAt(0).toUpperCase() || "U";
  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <nav className="navbar-glass w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="logo-group flex items-center gap-2.5 shrink-0">
          <div className="logo-orb w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              MockMate
            </h1>
            <p className="text-[9px] sm:text-[10px] text-cyan-400/80 tracking-[0.2em] font-semibold -mt-0.5">
              AI INTERVIEWER
            </p>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-link px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive ? "text-white nav-link-active" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="credit-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5 text-cyan-300" fill="currentColor" />
            <span className="text-sm font-semibold text-cyan-300">
              {user?.credits ?? 0}
            </span>
            <span className="text-xs text-cyan-300/70">Credits</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="profile-trigger flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full"
            >
              <div className="avatar w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">
                {initial}
              </div>
              <span className="text-sm text-white max-w-[90px] truncate">
                {firstName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu absolute right-0 mt-2 w-56 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700/60">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email || "—"}
                  </p>
                </div>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="dropdown-item w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="dropdown-item w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="border-t border-slate-700/60 my-1" />
                <button
                  onClick={logout}
                  className="dropdown-item dropdown-item-danger w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu md:hidden px-4 pb-4 pt-1 space-y-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="flex items-center justify-between px-3 py-3 mt-2 border-t border-slate-800">
            <div className="credit-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-cyan-300" fill="currentColor" />
              <span className="text-sm font-semibold text-cyan-300">
                {user?.credits ?? 0}
              </span>
              <span className="text-xs text-cyan-300/70">Credits</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="avatar w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                {initial}
              </div>
              <span className="text-sm text-white">{firstName}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 justify-center mt-1 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;