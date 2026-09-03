import React from 'react';
import { 
  GraduationCap, Users, CalendarCheck, BarChart3, 
  ShieldCheck, Database, ArrowRight, CheckCircle2, Sparkles, Server, Terminal
} from 'lucide-react';

interface LandingPageProps {
  navigate: (path: string) => void;
  onQuickLogin: (role: 'admin' | 'teacher' | 'student') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate, onQuickLogin }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-radial-[at_top_center] from-indigo-50 via-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>B.Tech CSE Capstone Project • Normalized SQL & Analytics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none mb-6">
            🎓 STUDENT MANAGEMENT SYSTEM
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-600 max-w-2xl mx-auto mb-4">
            Student Management &nbsp;•&nbsp; Attendance Management &nbsp;•&nbsp; Data Analytics
          </p>

          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto mb-8">
            An enterprise-grade, role-based academic portal engineered with relational database constraints, dynamic attendance percentage algorithms, and interactive SQL-driven visual charts.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              id="hero-register-btn"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>REGISTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-slate-500 text-sm flex items-center gap-2">
              <span>Already have an account?</span>
              <button
                id="hero-login-btn"
                onClick={() => navigate('/login')}
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                [ LOGIN ]
              </button>
            </div>
          </div>

          {/* Viva / Quick Demo Account Evaluator Box */}
          <div className="mt-8 max-w-xl mx-auto p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
              <span>⚡ Viva / Evaluator Quick Demo Accounts (1-Click Switch)</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onQuickLogin('admin')}
                className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-rose-800 group-hover:text-rose-900">Admin</div>
                <div className="text-[10px] text-rose-600 font-mono">admin / admin123</div>
              </button>

              <button
                onClick={() => onQuickLogin('teacher')}
                className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-amber-800 group-hover:text-amber-900">Teacher</div>
                <div className="text-[10px] text-amber-600 font-mono">prof_sharma</div>
              </button>

              <button
                onClick={() => onQuickLogin('student')}
                className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-emerald-800 group-hover:text-emerald-900">Student</div>
                <div className="text-[10px] text-emerald-600 font-mono">rahul101</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            System Capabilities
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Engineered to strictly follow academic compliance and real-world institution requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Student Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Complete CRUD lifecycle for student enrollments. Stores roll number, parent details, batch, branch, semester, and personal profiles with SQL constraint validation.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multi-criteria Search & Filtering</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Full Student Profile History</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Unique Roll Number Enforcements</li>
            </ul>
          </div>

          {/* Card 2: Attendance Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Attendance Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fast, teacher-driven daily lecture roll calls with 1-click "Mark All Present". Prevents duplicate records per subject-date-student via relational unique key checks.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Dynamic % Calculation: (Present / Total) × 100</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 75% Threshold Alerts (Good / Warning / Critical)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Printable Reports & CSV Data Export</li>
            </ul>
          </div>

          {/* Card 3: Data Analytics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Data Analytics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Interactive visual intelligence powered by Chart.js. Real-time SQL aggregations using COUNT(), SUM(), AVG(), and GROUP BY without hardcoding values.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Present vs Absent Doughnut Distribution</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Subject-wise & Monthly Attendance Trends</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Low Attendance (Below 75%) Analytics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* About System & Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-xl">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-indigo-300 text-xs font-mono border border-slate-700">
              <Database className="w-3.5 h-3.5" />
              <span>Relational Schema & Query Resolution</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Engineered for Enterprise Campus Operations & Problem Resolution
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              The application strictly implements 3NF normalization with integrated academic entities: 
              <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded mx-1">users</code>, 
              <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded mx-1">students</code>, 
              <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded mx-1">teachers</code>, 
              <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded mx-1">attendance</code>, 
              <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded mx-1">academic_queries</code>, and 
              <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded mx-1">notifications</code>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                <div className="text-lg sm:text-2xl font-black text-indigo-400">100%</div>
                <div className="text-[11px] text-slate-400">Role Verification</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                <div className="text-lg sm:text-2xl font-black text-indigo-400">3NF</div>
                <div className="text-[11px] text-slate-400">Normalized Schema</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                <div className="text-lg sm:text-2xl font-black text-indigo-400">&lt; 75%</div>
                <div className="text-[11px] text-slate-400">Warning Engine</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                <div className="text-lg sm:text-2xl font-black text-indigo-400">Flask + SQL</div>
                <div className="text-[11px] text-slate-400">REST APIs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer and Contact Quick Link */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-base font-bold text-slate-900">Need Help or Project Inquiries?</h3>
            <p className="text-xs text-slate-600">Connect with the project author or submit a support ticket.</p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Contact & Support
          </button>
        </div>
      </section>
    </div>
  );
};
