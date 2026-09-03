import React from 'react';
import { 
  Users, UserCheck, BookOpen, Layers, CheckCircle2, 
  XCircle, TrendingUp, AlertTriangle, CalendarCheck, 
  FileText, BarChart3, HelpCircle, ArrowUpRight, Plus, ExternalLink
} from 'lucide-react';
import { AnalyticsSummary, SessionUser } from '../types';

interface AdminDashboardProps {
  summary: AnalyticsSummary;
  session: SessionUser;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  summary,
  session,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <span>Admin Console</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>System Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Logged in as <strong className="text-white">{session.full_name}</strong>. Real-time institutional overview, database CRUD operations, and academic attendance governance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('students')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Students</span>
          </button>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Take Attendance</span>
          </button>
        </div>
      </div>

      {/* Primary 8 Metrics Cards as defined in requirement 9 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Students</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.total_students}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Enrolled across courses</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </p>
        </div>

        {/* Card 2: Total Teachers */}
        <div 
          onClick={() => onNavigateTab('teachers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Teachers</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.total_teachers}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Faculty members active</p>
        </div>

        {/* Card 3: Total Courses */}
        <div 
          onClick={() => onNavigateTab('courses')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Courses</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.total_courses}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">B.Tech, BCA programs</p>
        </div>

        {/* Card 4: Total Subjects */}
        <div 
          onClick={() => onNavigateTab('subjects')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Subjects</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.total_subjects}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Assigned curricula</p>
        </div>

        {/* Card 5: Today's Present */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Today's Present</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {summary.today_present}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">Attended lectures</p>
        </div>

        {/* Card 6: Today's Absent */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Today's Absent</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700">
            {summary.today_absent}
          </div>
          <p className="text-[11px] text-rose-600 mt-1 font-medium">Missed attendance</p>
        </div>

        {/* Card 7: Average Attendance */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Average Attendance</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-900">
            {summary.avg_attendance}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Aggregated overall</p>
        </div>

        {/* Card 8: Students Below 75% */}
        <div 
          onClick={() => onNavigateTab('low-attendance')}
          className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group bg-amber-50/20"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-amber-900">Below 75% Alert</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700">
            {summary.low_attendance_count}
          </div>
          <p className="text-[11px] text-amber-800 font-semibold mt-1">Students at risk</p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Directory</h3>
              <p className="text-xs text-slate-500">Enrollments, profiles, and attendance records</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Execute CRUD operations on student database entries with roll number uniqueness checks and batch assignments.
          </p>
          <button
            onClick={() => onNavigateTab('students')}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Students Manager</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Data Analytics</h3>
              <p className="text-xs text-slate-500">SQL aggregations & Chart.js visualizations</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Examine monthly trends, daily volume curves, subject distribution graphs, and low attendance risk cohorts.
          </p>
          <button
            onClick={() => onNavigateTab('analytics')}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Launch Analytics Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Attendance Reports</h3>
              <p className="text-xs text-slate-500">Filter, Print & Download CSV</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Generate formal academic attendance rosters with percentage categorizations: Good (≥75%), Warning (60-74%), Critical (&lt;60%).
          </p>
          <button
            onClick={() => onNavigateTab('reports')}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Attendance Reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Queries & Grievances</h3>
              <p className="text-xs text-indigo-700 font-medium">Problem Sharing & Resolution Hub</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Review student problems, syllabus doubts, and attendance correction requests. Post official resolutions with instant notifications.
          </p>
          <button
            onClick={() => onNavigateTab('queries')}
            className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>Open Problem Resolution Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
