import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center space-x-2 mb-4 group">
            <div className="p-1.5 bg-linear-to-tr from-cyan-500 to-purple-500 rounded-lg">
              <span className="text-white font-bold text-lg tracking-tighter">RA</span>
            </div>
            <span className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
              Resume<span className="text-cyan-500">Analyser</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-6 max-w-xs">
            Empowering your career with AI-driven resume analysis and futuristic job matching.
          </p>
          <div className="flex space-x-4">
            {/* Social Placeholders */}
            {['Twitter', 'LinkedIn', 'Github'].map((social) => (
              <a key={social} href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm uppercase tracking-wider font-semibold">
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Find Jobs</Link></li>
            <li><Link to="/profile" className="hover:text-cyan-400 transition-colors">My Profile</Link></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Resume Analysis</a></li>
          </ul>
        </div>
        {/* Links Column 2 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} ResumeAnalyser. All rights reserved. Built for the Future.
      </div>
    </footer>
  );
}

export default Footer;
