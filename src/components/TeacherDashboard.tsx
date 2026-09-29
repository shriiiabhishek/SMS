import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { 
  UserCheck, BookOpen, CalendarCheck, FileText, 
  BarChart3, CheckCircle2, XCircle, ArrowRight, Clock, Users,
  TrendingUp, ChevronRight, Sparkles, MessageSquare
} from 'lucide-react';
import { SessionUser, Subject, Course, Student } from '../types';
import { DBService } from '../services/storage';

Chart.register(...registerables);

interface TeacherDashboardProps {
  session: SessionUser;
  subjects: Subject[];
  courses: Course[];
  students: Student[];
  onNavigateTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  session,
  subjects,
  courses,
  students,
  onNavigateTab,
}) => {
  const performanceTrendRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Find teacher's assigned subjects
  const teacherSubjects = useMemo(() => {
    return subjects.filter(s => s.teacher_id === session.teacher_id);
  }, [subjects, session.teacher_id]);

  const allAttendance = DBService.getAttendance();
  const today = new Date().toISOString().slice(0, 10);

  // Compute stats for teacher's subjects
  const teacherSubjectIds = teacherSubjects.map(s => s.subject_id);
  const teacherAllAttendance = allAttendance.filter(a => teacherSubjectIds.includes(a.subject_id));
  const overallPresent = teacherAllAttendance.filter(a => a.status === 'Present').length;
  const overallAbsent = teacherAllAttendance.filter(a => a.status === 'Absent').length;
  const overallTotal = overallPresent + overallAbsent;
  const overallPct = overallTotal > 0 ? Number(((overallPresent / overallTotal) * 100).toFixed(1)) : 0;

  const teacherAttendanceToday = allAttendance.filter(
    a => teacherSubjectIds.includes(a.subject_id) && a.attendance_date === today
  );

  const todayPresent = teacherAttendanceToday.filter(a => a.status === 'Present').length;
  const todayAbsent = teacherAttendanceToday.filter(a => a.status === 'Absent').length;

  // Chart setup
  useEffect(() => {
    if (!performanceTrendRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = teacherSubjects.length > 0 ? teacherSubjects.map(s => s.subject_code) : ['No subjects'];
    const values = teacherSubjects.length > 0 ? teacherSubjects.map(s => {
      const subjectRecords = teacherAllAttendance.filter(a => a.subject_id === s.subject_id);
      const present = subjectRecords.filter(a => a.status === 'Present').length;
      const total = subjectRecords.length || 1;
      return Number(((present / total) * 100).toFixed(1));
    }) : [0];

    chartInstance.current = new Chart(performanceTrendRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Attendance Trend',
            data: values,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.12)',
            fill: true,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#312e81',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.38,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { callback: value => `${value}%` },
            grid: { color: '#eef2ff' },
          },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Attendance: ${context.parsed.y}%`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [overallPresent, overallAbsent, overallTotal, todayPresent, todayAbsent, teacherSubjects, teacherAllAttendance]);

  return (
    <div className="space-y-8">
      {/* Teacher Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty Academic Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {session.full_name} 👨‍🏫
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Department of Computer Science & Engineering. Manage roll-calls, review subject-wise percentages, and track student attendance records.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('queries')}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer font-display"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Student Queries & Resolve</span>
          </button>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer font-display"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark Class Attendance</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">My Subjects</span>
          <div className="text-3xl font-black text-indigo-700">{teacherSubjects.length}</div>
          <p className="text-[11px] text-slate-400">Assigned curricula</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
          <div className="text-3xl font-black text-slate-900">{students.length}</div>
          <p className="text-[11px] text-slate-400">Batch strength</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-emerald-700">Today's Present</span>
          <div className="text-3xl font-black text-emerald-600">{todayPresent}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Logged in lectures</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-rose-700">Today's Absent</span>
          <div className="text-3xl font-black text-rose-600">{todayAbsent}</div>
          <p className="text-[11px] text-rose-600 font-medium">Missed attendance</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Faculty Performance Pulse</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Subject Attendance Momentum
            </h3>
            <p className="text-xs text-slate-500">
              More modern trend analysis, with cleaner linear graphs instead of pie slices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 h-64 sm:h-72 relative flex items-center justify-center">
            <canvas ref={performanceTrendRef} />
          </div>

          <div className="lg:col-span-5 space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Faculty Turnout Summary</span>
              <span className="font-mono text-indigo-700">{overallPct}% Avg</span>
            </h4>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-slate-700">Total Present Marks</span>
                </div>
                <div className="text-right font-bold text-slate-900">
                  {overallPresent} <span className="text-[11px] font-normal text-slate-500">({overallPct}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="font-medium text-slate-700">Total Absent Marks</span>
                </div>
                <div className="text-right font-bold text-slate-900">
                  {overallAbsent} <span className="text-[11px] font-normal text-slate-500">({overallTotal > 0 ? (100 - overallPct).toFixed(1) : 0}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="font-semibold text-indigo-900">Total Student Records</span>
                <span className="font-bold text-indigo-700">{overallTotal} Verified Entries</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              💡 <em>Faculty Note: Toggle between "Overall Lectures", "Today's Classes", and "Subject Ratio" to analyze student engagement.</em>
            </p>
          </div>
        </div>
      </div>

      {/* Sequential Next Steps Workflow Bar ("FIR Din page open Hote Jaenge next next") */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-5 rounded-2xl border border-indigo-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Instructor Workflow • Next Sequential Steps
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            Quickly Navigate to the Next Teacher Modules
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Next: Take Class Attendance</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Next: View Reports & CSV</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigateTab('analytics')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>Next: Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Assigned Subjects Card Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>My Teaching Assignments & Subjects</span>
            </h3>
            <p className="text-xs text-slate-500">
              Classes where you are the designated instructor in the academic schedule
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            {teacherSubjects.length} Active Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherSubjects.map(sub => (
            <div 
              key={sub.subject_id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {sub.subject_code}
                  </span>
                  <span className="text-[11px] text-slate-500">Sem {sub.semester}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-2">{sub.subject_name}</h4>
                <p className="text-xs text-slate-500 mt-1">Course: {sub.course_name} ({sub.branch})</p>
              </div>

              <div className="pt-3 border-t border-slate-200/60">
                <button
                  onClick={() => onNavigateTab('attendance')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Take Attendance</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigateTab('reports')}
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Attendance Reports & Logs</h4>
          <p className="text-xs text-slate-500">
            Generate and export official attendance reports by date range and subject, print rosters, or download CSV.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('analytics')}
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Departmental Analytics</h4>
          <p className="text-xs text-slate-500">
            Interactive Chart.js visualizations for attendance distributions, daily attendance trends, and low-attendance alerts.
          </p>
        </div>
      </div>
    </div>
  );
};
