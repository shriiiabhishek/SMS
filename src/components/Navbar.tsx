import React from 'react';
import { 
  GraduationCap, LogOut, User as UserIcon, BarChart3, 
  BookOpen, CalendarCheck, Shield, HelpCircle, FileText, MessageSquare, Bell 
} from 'lucide-react';
import { SessionUser } from '../types';

interface NavbarProps {
  session: SessionUser | null;
  currentPath: string;
  navigate: (path: string) => void;
  onLogout: () => void;
  unreadQueriesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  currentPath,
  navigate,
  onLogout,
  unreadQueriesCount = 0,
}) => {
  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'teacher':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'student':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header id="app-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          id="brand-logo"
          onClick={() => navigate(session ? (session.role === 'admin' ? '/admin/dashboard' : session.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard') : '/login')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-2">
              <span>SMS Portal</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 hidden sm:inline-block">
                College ERP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Student & Attendance Analytics Management
            </p>
          </div>
        </div>

        {/* Center / Navigation items */}
        <nav className="hidden lg:flex items-center gap-1">
          {!session ? (
            <>
              <button
                id="nav-login-top-btn"
                onClick={() => navigate('/login')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === '/login' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Sign In
              </button>
              <button
                id="nav-home-btn"
                onClick={() => navigate('/')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                College Overview
              </button>
              <button
                id="nav-contact-btn"
                onClick={() => navigate('/contact')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === '/contact' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Contact & Support
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-dashboard-btn"
                onClick={() => navigate(session.role === 'admin' ? '/admin/dashboard' : session.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPath.includes('dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Dashboard
              </button>

              {session.role !== 'student' && (
                <button
                  id="nav-attendance-btn"
                  onClick={() => navigate('/attendance')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentPath === '/attendance' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  Take Attendance
                </button>
              )}

              <button
                id="nav-reports-btn"
                onClick={() => navigate('/attendance-report')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPath === '/attendance-report' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                Reports
              </button>

              <button
                id="nav-analytics-btn"
                onClick={() => navigate('/analytics')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPath === '/analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Data Analytics
              </button>

              <button
                id="nav-queries-auth-btn"
                onClick={() => navigate('/queries')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPath === '/queries' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Queries</span>
                {unreadQueriesCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    {unreadQueriesCount}
                  </span>
                )}
              </button>

              <button
                id="nav-contact-auth-btn"
                onClick={() => navigate('/contact')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPath === '/contact' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Support
              </button>
            </>
          )}
        </nav>

        {/* Right action bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dedicated Queries & Grievances Button */}
          <button
            id="open-queries-hub-btn"
            onClick={() => navigate('/queries')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer font-display"
            title="Student & Teacher Problem Sharing, Notification & Resolution"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Queries & Help</span>
            <span className="sm:hidden">Queries</span>
            {unreadQueriesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {unreadQueriesCount}
              </span>
            )}
          </button>

          {!session ? (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => navigate('/login')}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors"
              >
                Login
              </button>
              <button
                id="header-register-btn"
                onClick={() => navigate('/register')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition-colors"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-800 leading-tight max-w-[130px] truncate">
                    {session.full_name}
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 text-[10px] font-bold uppercase rounded border ${getRoleBadgeColor(session.role)}`}>
                    {session.role}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                id="header-logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors"
                title="Log Out of Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
