import React from 'react';
import { Mail, Heart, Code2, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 font-semibold text-white">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Student Management & Attendance Analytics System</span>
          </div>
          <p className="text-xs text-slate-400">
            B.Tech CSE Major Capstone Project • Normalized Relational Architecture
          </p>
        </div>

        <div className="text-sm space-y-1">
          <p className="text-slate-200 font-medium">
            © 2026 Student Management System
          </p>
          <p className="text-xs text-slate-400">
            Developed by <span className="text-indigo-300 font-semibold">Abhishek Shrivastava</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs text-slate-400">Contact & Support:</span>
          <a
            id="footer-email-link"
            href="mailto:shrivastavaabhishek66772o@gmail.com"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 rounded-lg text-xs font-medium border border-indigo-700/50 transition-colors shadow-sm"
          >
            <Mail className="w-3.5 h-3.5" />
            shrivastavaabhishek66772o@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};
