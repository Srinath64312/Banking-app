import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Palette } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [baseTheme, setBaseTheme] = useState(localStorage.getItem("nova-base-theme") || "navy");
  const [accentColor, setAccentColor] = useState(localStorage.getItem("nova-accent-color") || "gold");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const classesToRemove = ["theme-emerald", "theme-crimson", "theme-purple", "theme-slate", "accent-gold", "accent-aqua", "accent-emerald", "accent-purple", "accent-rose"];
    classesToRemove.forEach(cls => document.body.classList.remove(cls));

    if (baseTheme !== "navy") {
      document.body.classList.add(`theme-${baseTheme}`);
    }
    document.body.classList.add(`accent-${accentColor}`);

    localStorage.setItem("nova-base-theme", baseTheme);
    localStorage.setItem("nova-accent-color", accentColor);
  }, [baseTheme, accentColor]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Cards", path: "/cards" },
    { name: "Loans", path: "/loans" },
    { name: "Investments", path: "/investments" },
    { name: "Support", path: "/support" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-navy-900/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
            <span className="text-navy-900 font-display font-bold text-lg leading-none">N</span>
          </div>
          <span className="font-display text-xl font-semibold text-white">
            Nova<span className="gold-gradient">Banque</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 block ${
                  location.pathname === link.path || (link.path !== "/" && location.pathname.startsWith(link.path))
                    ? "bg-navy-600/60 text-gold-400"
                    : "text-navy-200 hover:text-white hover:bg-navy-700/40"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3 relative">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2.5 rounded-lg glass text-navy-200 hover:text-white transition-all flex items-center justify-center"
            title="Customize Theme"
          >
            <Palette size={18} />
          </button>
          
          {settingsOpen && (
            <div className="absolute right-0 top-14 w-64 glass-card border border-navy-500/30 rounded-2xl p-4 shadow-2xl z-50 animate-slide-up">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Palette size={16} className="text-gold-400" />
                Customize Theme
              </h4>
              
              {/* Base Theme */}
              <div className="mb-4">
                <span className="text-xs text-navy-300 block mb-2 font-medium">Base Color</span>
                <div className="flex gap-2">
                  {[
                    { key: "navy", class: "bg-blue-950 border-blue-400" },
                    { key: "emerald", class: "bg-emerald-950 border-emerald-400" },
                    { key: "crimson", class: "bg-red-950 border-red-400" },
                    { key: "purple", class: "bg-purple-950 border-purple-400" },
                    { key: "slate", class: "bg-slate-900 border-slate-400" }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => setBaseTheme(item.key)}
                      className={`w-6 h-6 rounded-full border-2 ${item.class} ${baseTheme === item.key ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                      title={item.key}
                    />
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <span className="text-xs text-navy-300 block mb-2 font-medium">Accent Color</span>
                <div className="flex gap-2">
                  {[
                    { key: "gold", class: "bg-yellow-500 border-yellow-300" },
                    { key: "aqua", class: "bg-cyan-400 border-cyan-200" },
                    { key: "emerald", class: "bg-emerald-500 border-emerald-300" },
                    { key: "purple", class: "bg-purple-500 border-purple-300" },
                    { key: "rose", class: "bg-rose-500 border-rose-300" }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => setAccentColor(item.key)}
                      className={`w-6 h-6 rounded-full border-2 ${item.class} ${accentColor === item.key ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                      title={item.key}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <Link
            to="/dashboard"
            className="text-sm text-navy-200 hover:text-white transition-colors ml-1"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-gold-500/20 block"
          >
            Open Account
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-navy-700/30 px-6 pb-6 pt-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all ${
                location.pathname === link.path || (link.path !== "/" && location.pathname.startsWith(link.path))
                  ? "bg-navy-600/60 text-gold-400"
                  : "text-navy-200 hover:text-white hover:bg-navy-700/40"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Theme Customizer */}
          <div className="px-4 py-3 border-t border-navy-700/30 mt-3">
            <span className="text-xs text-navy-300 block mb-2 font-mono uppercase tracking-wider">Customize Theme</span>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-navy-400">Base Color</span>
                <div className="flex gap-2">
                  {["navy", "emerald", "crimson", "purple", "slate"].map(k => (
                    <button
                      key={k}
                      onClick={() => setBaseTheme(k)}
                      className={`w-5 h-5 rounded-full border border-white/20 ${
                        k === 'navy' ? 'bg-blue-950' : k === 'emerald' ? 'bg-emerald-950' : k === 'crimson' ? 'bg-red-950' : k === 'purple' ? 'bg-purple-950' : 'bg-slate-900'
                      } ${baseTheme === k ? 'ring-2 ring-gold-400' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-navy-400">Accent Color</span>
                <div className="flex gap-2">
                  {["gold", "aqua", "emerald", "purple", "rose"].map(k => (
                    <button
                      key={k}
                      onClick={() => setAccentColor(k)}
                      className={`w-5 h-5 rounded-full border border-white/20 ${
                        k === 'gold' ? 'bg-yellow-500' : k === 'aqua' ? 'bg-cyan-400' : k === 'emerald' ? 'bg-emerald-500' : k === 'purple' ? 'bg-purple-500' : 'bg-rose-500'
                      } ${accentColor === k ? 'ring-2 ring-gold-400' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
            className="mt-4 w-full px-5 py-2.5 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 text-sm font-semibold"
          >
            Open Account
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
