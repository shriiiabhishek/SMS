import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { 
  GraduationCap, CheckCircle2, AlertTriangle, XCircle, 
  BookOpen, Calendar, Clock, ShieldCheck, FileText, ArrowRight,
  PieChart as PieIcon, ChevronRight, HelpCircle, MessageSquare, PlusCircle
} from 'lucide-react';
import { SessionUser, Student } from '../types';
import { DBService } from '../services/storage';

// Ensure Chart.js is registered
Chart.register(...registerables);

interface StudentDashboardProps {
  session: SessionUser;
  studentId?: number;
  navigate: (path: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  session,
  studentId,
  navigate,
}) => {
  // Chart refs and state
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartMode, setChartMode] = useState<'overall' | 'subjects'>('overall');

  // Identify student record
  const effectiveStudentId = studentId || session.student_id || 1;
  const attendanceData = useMemo(() => {
    return DBService.getOverallStudentAttendance(effectiveStudentId);
  }, [effectiveStudentId]);

  if (!attendanceData) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Student enrollment record not found in database.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const { student, total_classes, present_classes, absent_classes, overall_percentage, status_category, subject_breakdown, recent_records } = attendanceData;

  // Initialize or update Pie Chart
  useEffect(() => {
    if (!pieChartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartMode === 'overall') {
      chartInstance.current = new Chart(pieChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Present Classes', 'Absent Classes'],
          datasets: [
            {
              data: [present_classes, absent_classes],
              backgroundColor: ['#10b981', '#f43f5e'],
              borderColor: ['#059669', '#e11d48'],
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
                padding: 14,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = present_classes + absent_classes;
                  const value = Number(context.raw) || 0;
                  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                  return ` ${context.label}: ${value} classes (${pct}%)`;
                },
              },
            },
          },
          cutout: '62%',
        },
      });
    } else {
      // Subject-wise attended classes breakdown
      const labels = subject_breakdown.map(s => s.subject_code);
      const data = subject_breakdown.map(s => s.present);
      const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

      chartInstance.current = new Chart(pieChartRef.current, {
        type: 'pie',
        data: {
          labels: labels.length > 0 ? labels : ['No Subjects'],
          datasets: [
            {
              data: data.length > 0 ? data : [1],
              backgroundColor: colors.slice(0, Math.max(labels.length, 1)),
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
                padding: 12,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = Number(context.raw) || 0;
                  return ` ${context.label}: ${value} Present Lectures`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartMode, present_classes, absent_classes, subject_breakdown]);

  const getStatusBadge = (category: 'Good' | 'Warning' | 'Critical', pct: number) => {
    switch (category) {
      case 'Good':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{pct}% ✅ Good Standing</span>
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{pct}% ⚠️ Attendance Warning</span>
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs animate-pulse">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{pct}% 🔴 Critical (&lt;60%)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Student Welcome Header as specified in requirement 19 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student Academic Profile • Read-Only Verified</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {student.full_name} 👋
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 pt-1">
            <span className="font-mono bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Roll No: <strong className="text-white">{student.roll_number}</strong>
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Course: <strong className="text-white">{student.course_name} ({student.branch})</strong>
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Semester: <strong className="text-white">{student.semester}</strong>
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Batch: <strong className="text-white">{student.batch}</strong>
            </span>
          </div>
        </div>

        {/* Big Overall Attendance Card */}
        <div className="bg-white/10 backdrop-blur border border-white/20 p-5 rounded-2xl text-center min-w-[220px] space-y-2">
          <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold block font-display">
            Overall Attendance
          </span>
          <div className="text-4xl sm:text-5xl font-black text-white font-display">
            {overall_percentage}%
          </div>
          <div className="pt-1">
            {getStatusBadge(status_category, overall_percentage)}
          </div>
          <button
            type="button"
            onClick={() => navigate('/queries')}
            className="w-full mt-2 py-1.5 px-3 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 hover:text-white border border-indigo-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-display"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-300" />
            <span>Report Query / Doubt</span>
          </button>
        </div>
      </div>

      {/* Class Counts Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Classes Conducted</span>
          <div className="text-3xl font-black text-slate-900">{total_classes}</div>
          <p className="text-[11px] text-slate-400">Total lectures scheduled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-emerald-700">Present Classes</span>
          <div className="text-3xl font-black text-emerald-600">{present_classes}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Lectures attended physically</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-rose-700">Absent Classes</span>
          <div className="text-3xl font-black text-rose-600">{absent_classes}</div>
          <p className="text-[11px] text-rose-600 font-medium">Lectures missed</p>
        </div>
      </div>

      {/* NEW: Student Attendance Distribution Pie Chart Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold mb-1">
              <PieIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Student Attendance Visual Analytics</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Personal Attendance Distribution (Pie Chart)
            </h3>
            <p className="text-xs text-slate-500">
              Interactive visual breakdown of physical presence vs absences across all enrolled lectures
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setChartMode('overall')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartMode === 'overall'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Present vs Absent
            </button>
            <button
              onClick={() => setChartMode('subjects')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartMode === 'subjects'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Subject Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Chart Canvas */}
          <div className="lg:col-span-7 h-64 sm:h-72 relative flex items-center justify-center">
            <canvas ref={pieChartRef} />
          </div>

          {/* Detailed Statistics Side Panel */}
          <div className="lg:col-span-5 space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Attendance Ratio Summary</span>
              <span className="font-mono text-indigo-700">{overall_percentage}%</span>
            </h4>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-slate-700">Present Turnout</span>
                </div>
                <div className="text-right font-bold text-slate-900">
                  {present_classes} <span className="text-[11px] font-normal text-slate-500">({total_classes > 0 ? ((present_classes / total_classes) * 100).toFixed(1) : 0}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="font-medium text-slate-700">Missed Lectures</span>
                </div>
                <div className="text-right font-bold text-slate-900">
                  {absent_classes} <span className="text-[11px] font-normal text-slate-500">({total_classes > 0 ? ((absent_classes / total_classes) * 100).toFixed(1) : 0}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="font-semibold text-indigo-900">Eligibility Status</span>
                <span className="font-bold text-indigo-700">
                  {overall_percentage >= 75 ? 'Exam Eligible (≥75%)' : overall_percentage >= 60 ? 'Warning Risk' : 'Critical Debarment'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              💡 <em>Tip: Switch to "Subject Share" above to see your attended lecture distribution across different courses.</em>
            </p>
          </div>
        </div>
      </div>

      {/* Sequential Next Steps Workflow Bar ("FIR Din page open Hote Jaenge next next") */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-5 rounded-2xl border border-indigo-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Navigation Flow • Next Pages
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            Proceed to Next Available Student Features
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/attendance-report')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Next: Attendance Reports & CSV</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Next: Contact Support</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subject-wise Attendance Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Subject-wise Attendance Status
            </h3>
            <p className="text-xs text-slate-500">
              Official university regulation mandates a minimum of 75% attendance for examination eligibility
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-400">
            {subject_breakdown.length} Subjects Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subject_breakdown.map(sub => {
            const isGood = sub.percentage >= 75;
            const isWarning = sub.percentage >= 60 && sub.percentage < 75;
            const isCritical = sub.percentage < 60;

            return (
              <div 
                key={sub.subject_id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-indigo-700">{sub.subject_code}</div>
                    <h4 className="font-bold text-slate-900 text-sm">{sub.subject_name}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900">{sub.percentage}%</span>
                    <span className="ml-1.5">
                      {isGood && '✅'}
                      {isWarning && '⚠️'}
                      {isCritical && '🔴'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Total: <strong>{sub.total}</strong></span>
                  <span>Present: <strong className="text-emerald-700">{sub.present}</strong></span>
                  <span>Absent: <strong className="text-rose-700">{sub.absent}</strong></span>
                  <span>
                    Status: <strong className={isGood ? 'text-emerald-700' : isWarning ? 'text-amber-700' : 'text-rose-700'}>
                      {sub.status_category}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Chronological Attendance Log (Read-only) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Recent Personal Attendance Log (Read-Only)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Recorded in SQL Attendance Table
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Subject ID</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent_records.map(rec => (
                <tr key={rec.attendance_id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-medium text-slate-800">
                    {rec.attendance_date}
                  </td>
                  <td className="px-4 py-2.5">
                    Subject #{rec.subject_id}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 font-mono text-[10px]">
                    {rec.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
