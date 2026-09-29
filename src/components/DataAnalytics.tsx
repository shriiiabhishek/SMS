import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Chart, 
  registerables 
} from 'chart.js';
import { 
  BarChart3, TrendingUp, AlertTriangle, 
  Filter, RotateCcw, Calendar, CheckCircle2, XCircle, Users 
} from 'lucide-react';
import { DBService } from '../services/storage';
import { Course, Subject, Teacher, Student } from '../types';

// Register all Chart.js controllers, scales, elements
Chart.register(...registerables);

interface DataAnalyticsProps {
  courses: Course[];
  subjects: Subject[];
  teachers: Teacher[];
  students: Student[];
}

export const DataAnalytics: React.FC<DataAnalyticsProps> = ({
  courses,
  subjects,
  teachers,
  students,
}) => {
  // Filter States
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));

  // Applied Filters
  const [appliedFilters, setAppliedFilters] = useState<{
    course_name?: string;
    branch?: string;
    semester?: number;
    batch?: string;
    subject_id?: number;
    teacher_id?: number;
    date_from?: string;
    date_to?: string;
  }>({
    date_from: '2026-01-01',
    date_to: new Date().toISOString().slice(0, 10),
  });

  // Canvas Refs
  const pulseChartRef = useRef<HTMLCanvasElement | null>(null);
  const subjectBarChartRef = useRef<HTMLCanvasElement | null>(null);
  const monthlyLineChartRef = useRef<HTMLCanvasElement | null>(null);
  const dailyBarChartRef = useRef<HTMLCanvasElement | null>(null);
  const lowAttendanceBarChartRef = useRef<HTMLCanvasElement | null>(null);

  // Chart Instances
  const pulseInstance = useRef<Chart | null>(null);
  const subjectBarInstance = useRef<Chart | null>(null);
  const monthlyLineInstance = useRef<Chart | null>(null);
  const dailyBarInstance = useRef<Chart | null>(null);
  const lowAttendanceBarInstance = useRef<Chart | null>(null);

  // Compute Data based on filters
  const analyticsSummary = useMemo(() => {
    return DBService.getAnalyticsSummary();
  }, [appliedFilters]);

  const subjectData = useMemo(() => {
    return DBService.getSubjectAttendanceData(appliedFilters.course_name ? Number(selectedCourse) : undefined);
  }, [appliedFilters, selectedCourse]);

  const monthlyData = useMemo(() => {
    return DBService.getMonthlyTrendData();
  }, [appliedFilters]);

  const dailyData = useMemo(() => {
    return DBService.getDailyAttendanceData();
  }, [appliedFilters]);

  const lowAttendanceStudents = useMemo(() => {
    return DBService.getLowAttendanceStudents(75);
  }, [appliedFilters]);

  // Apply Filter Handler
  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      course_name: selectedCourse ? courses.find(c => c.course_id === Number(selectedCourse))?.course_name : undefined,
      branch: selectedBranch || undefined,
      semester: selectedSemester ? Number(selectedSemester) : undefined,
      batch: selectedBatch || undefined,
      subject_id: selectedSubject ? Number(selectedSubject) : undefined,
      teacher_id: selectedTeacher ? Number(selectedTeacher) : undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    });
  };

  const handleResetFilter = () => {
    setSelectedCourse('');
    setSelectedBranch('');
    setSelectedSemester('');
    setSelectedBatch('');
    setSelectedSubject('');
    setSelectedTeacher('');
    setDateFrom('2026-01-01');
    setDateTo(new Date().toISOString().slice(0, 10));
    setAppliedFilters({
      date_from: '2026-01-01',
      date_to: new Date().toISOString().slice(0, 10),
    });
  };

  // Render / Update Chart.js instances
  useEffect(() => {
    // 1. Pulse Trend: Attendance momentum over time
    if (pulseChartRef.current) {
      if (pulseInstance.current) pulseInstance.current.destroy();

      const trendLabels = monthlyData.labels;
      const trendValues = monthlyData.percentages;

      pulseInstance.current = new Chart(pulseChartRef.current, {
        type: 'line',
        data: {
          labels: trendLabels,
          datasets: [
            {
              label: 'Attendance Pulse',
              data: trendValues,
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
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 40,
              max: 100,
              ticks: { callback: value => `${value}%` },
              grid: { color: '#eef2ff' },
            },
            x: {
              grid: { display: false },
            },
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
    }

    // 2. Bar Chart: Subject-wise Attendance (%)
    if (subjectBarChartRef.current) {
      if (subjectBarInstance.current) subjectBarInstance.current.destroy();

      subjectBarInstance.current = new Chart(subjectBarChartRef.current, {
        type: 'bar',
        data: {
          labels: subjectData.labels,
          datasets: [
            {
              label: 'Attendance %',
              data: subjectData.percentages,
              backgroundColor: '#6366f1',
              borderRadius: 6,
              hoverBackgroundColor: '#4f46e5',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: value => `${value}%`,
              },
              grid: { color: '#f1f5f9' },
            },
            x: {
              grid: { display: false },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    // 3. Line Chart: Monthly Attendance Trend
    if (monthlyLineChartRef.current) {
      if (monthlyLineInstance.current) monthlyLineInstance.current.destroy();

      monthlyLineInstance.current = new Chart(monthlyLineChartRef.current, {
        type: 'line',
        data: {
          labels: monthlyData.labels,
          datasets: [
            {
              label: 'Monthly Average %',
              data: monthlyData.percentages,
              borderColor: '#0284c7',
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: '#0284c7',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 40,
              max: 100,
              ticks: { callback: v => `${v}%` },
              grid: { color: '#f1f5f9' },
            },
            x: {
              grid: { display: false },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    // 4. Bar Chart: Daily Attendance (Monday to Friday)
    if (dailyBarChartRef.current) {
      if (dailyBarInstance.current) dailyBarInstance.current.destroy();

      dailyBarInstance.current = new Chart(dailyBarChartRef.current, {
        type: 'bar',
        data: {
          labels: dailyData.labels,
          datasets: [
            {
              label: 'Students Present',
              data: dailyData.presentCounts,
              backgroundColor: '#0d9488',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9' },
            },
            x: {
              grid: { display: false },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    // 5. Bar Chart: Low Attendance (<75%)
    if (lowAttendanceBarChartRef.current) {
      if (lowAttendanceBarInstance.current) lowAttendanceBarInstance.current.destroy();

      const labels = lowAttendanceStudents.map(s => s.full_name);
      const data = lowAttendanceStudents.map(s => s.attendance_percentage);

      lowAttendanceBarInstance.current = new Chart(lowAttendanceBarChartRef.current, {
        type: 'bar',
        data: {
          labels: labels.length > 0 ? labels : ['No records below 75%'],
          datasets: [
            {
              label: 'Attendance %',
              data: data.length > 0 ? data : [0],
              backgroundColor: '#f59e0b',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { callback: v => `${v}%` },
              grid: { color: '#f1f5f9' },
            },
            x: {
              grid: { display: false },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    return () => {
      if (pulseInstance.current) pulseInstance.current.destroy();
      if (subjectBarInstance.current) subjectBarInstance.current.destroy();
      if (monthlyLineInstance.current) monthlyLineInstance.current.destroy();
      if (dailyBarInstance.current) dailyBarInstance.current.destroy();
      if (lowAttendanceBarInstance.current) lowAttendanceBarInstance.current.destroy();
    };
  }, [analyticsSummary, subjectData, monthlyData, dailyData, lowAttendanceStudents]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Data Analytics Studio</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            SQL statistical aggregations rendered via Chart.js
          </p>
        </div>
      </div>

      {/* 5 Analytics Cards (Requirement 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Total Students</span>
          <div className="text-2xl font-black text-slate-900">{analyticsSummary.total_students}</div>
          <p className="text-[10px] text-slate-400">Total registered</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-indigo-700">Average Attendance</span>
          <div className="text-2xl font-black text-indigo-600">{analyticsSummary.avg_attendance}%</div>
          <p className="text-[10px] text-slate-400">Aggregated cohort</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-emerald-700">Present Today</span>
          <div className="text-2xl font-black text-emerald-600">{analyticsSummary.today_present}</div>
          <p className="text-[10px] text-emerald-600 font-medium">Lectures attended</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-rose-700">Absent Today</span>
          <div className="text-2xl font-black text-rose-600">{analyticsSummary.today_absent}</div>
          <p className="text-[10px] text-rose-600 font-medium">Absences recorded</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-amber-800">Low Attendance (&lt;75%)</span>
          <div className="text-2xl font-black text-amber-700">{analyticsSummary.low_attendance_count}</div>
          <p className="text-[10px] text-amber-700 font-semibold">At risk of debarment</p>
        </div>
      </div>

      {/* Analytics Filter Form (Requirement 27) */}
      <form onSubmit={handleApplyFilter} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Analytics Filters
          </span>
          <span className="text-[11px] text-slate-400">
            Slice and dice attendance across institutional dimensions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Course */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Course</label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Branch</label>
            <input
              type="text"
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              placeholder="e.g. CSE"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">All Sem</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Batch</label>
            <input
              type="text"
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              placeholder="2022-2026"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
            />
          </div>

          {/* Subject */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_code} - {s.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
            />
          </div>
        </div>

        {/* Buttons: [ APPLY FILTER ] & [ RESET ] */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetFilter}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>[ RESET ]</span>
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>[ APPLY FILTER ]</span>
          </button>
        </div>
      </form>

      {/* Row 1: Pulse Trend & Subject Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Academic Pulse</span>
            </h3>
            <span className="text-[11px] text-slate-400">Momentum</span>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <canvas ref={pulseChartRef} />
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span>Current Avg: <strong>{analyticsSummary.avg_attendance}%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Present: <strong>{analyticsSummary.total_present_records}</strong></span>
            </div>
          </div>
        </div>

        {/* Bar Graph: Subject-wise Attendance (Requirement 23) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Subject-wise Attendance Distribution (%)</span>
            </h3>
            <span className="text-[11px] text-slate-400">0% to 100% Scale</span>
          </div>

          <div className="h-64 relative">
            <canvas ref={subjectBarChartRef} />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Bar graph showing lecture compliance across individual curricula
          </p>
        </div>
      </div>

      {/* Row 2: Monthly Line Graph & Daily Bar Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Graph: Monthly Attendance Trend (Requirement 24) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>Monthly Attendance Trend</span>
            </h3>
            <span className="text-[11px] text-slate-400">Jan – May</span>
          </div>

          <div className="h-64 relative">
            <canvas ref={monthlyLineChartRef} />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Chronological performance line graph showing month-on-month participation
          </p>
        </div>

        {/* Daily Attendance Graph: Monday to Friday (Requirement 25) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Daily Attendance (Mon – Fri)</span>
            </h3>
            <span className="text-[11px] text-slate-400">Weekly Headcount</span>
          </div>

          <div className="h-64 relative">
            <canvas ref={dailyBarChartRef} />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Total students present recorded per day of the week
          </p>
        </div>
      </div>

      {/* Row 3: Low Attendance Students Analytics (<75%) (Requirement 26) */}
      <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Low Attendance Analytics (&lt;75% Risk Cohort)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Students identified below the mandatory 75% attendance threshold
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
            {lowAttendanceStudents.length} Students Flagged
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Roll No</th>
                  <th className="px-3 py-2.5">Student Name</th>
                  <th className="px-3 py-2.5">Course</th>
                  <th className="px-3 py-2.5 text-center">Attendance %</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowAttendanceStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                      Great news! All active students maintain 75% or above.
                    </td>
                  </tr>
                ) : (
                  lowAttendanceStudents.map(st => (
                    <tr key={st.student_id} className="hover:bg-amber-50/40">
                      <td className="px-3 py-2.5 font-mono font-bold text-indigo-700">
                        {st.roll_number}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-900">
                        {st.full_name}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {st.course_name}
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-amber-700 font-mono">
                        {st.attendance_percentage}%
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.status_category === 'Critical' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {st.status_category === 'Critical' ? 'Critical' : 'Warning'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bar Chart for Students below 75% */}
          <div className="h-64 relative bg-slate-50/50 p-3 rounded-xl border border-slate-200">
            <canvas ref={lowAttendanceBarChartRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
