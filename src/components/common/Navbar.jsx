import { useState } from "react";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo + Company Name */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo in rounded rectangle container */}
            <div className="flex-shrink-0 bg-white/10 border border-white/20 rounded-xl p-1.5 sm:p-2 shadow-inner">
              <img
                src={logo}
                alt="Toyoda Gosei Logo"
                className="h-8 w-auto sm:h-10 object-contain rounded-lg"
              />
            </div>

            {/* Company Name */}
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-base sm:text-xl tracking-wide">
                Toyoda Gosei
              </span>
              <span className="text-indigo-300/80 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
                Visitor Safety System
              </span>
            </div>
          </div>

          {/* Mobile menu button (optional – kept minimal) */}
          <button
            className="sm:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop right side — subtle tagline */}
          <div className="hidden sm:flex items-center gap-2 text-white/40 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            System Active
          </div>
        </div>
      </div>
    </nav>
  );
}
