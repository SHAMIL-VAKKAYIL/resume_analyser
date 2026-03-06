import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Analyser", path: "/analyser" },
    { name: "Applications", path: "/applications" },
    { name: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 top-0 start-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-shadow">
              {/* <span className="text-white font-bold text-xl tracking-tighter">RA</span> */}
            </div>
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white group-hover:text-cyan-400 transition-colors">
              Resume<span className="text-cyan-500">Analyser</span>
            </span>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-400 rounded-lg md:hidden hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
            aria-controls="navbar-default"
            aria-expanded={open}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className={`${open ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-slate-800 rounded-2xl bg-slate-900 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block py-2 px-3 rounded md:p-0 transition-all duration-300 relative group ${isActive(link.path)
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-white"
                      }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                    {/* Active/Hover Underline */}
                    <span className={`hidden md:block absolute -bottom-1 left-0 h-0.5 bg-cyan-500 transition-all duration-300 ${isActive(link.path) ? "w-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "w-0 group-hover:w-full"}`}></span>
                  </Link>
                </li>
              ))}

              {/* Logout Button */}
              {/* <li>
                <button
                  onClick={() => dispatch(logout())}
                  className="flex bg-red-500 hover:bg-red-600 w-full md:w-auto text-center py-2 px-3 text-white rounded md:border-0  transition-colors"
                >
                  Logout
                </button>
              </li> */}
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
