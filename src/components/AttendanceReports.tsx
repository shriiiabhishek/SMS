import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, RotateCcw, Printer, Download, 
  CheckCircle2, AlertTriangle, XCircle, Filter, Calendar 
} from 'lucide-react';
import { Course, Subject, Student, AttendanceReportItem } from '../types';
import { DBService } from '../services/storage';

interface AttendanceReportsProps {
  courses: Course[];
  subjects: Subject[];
  students: Student[];
}

export const AttendanceReports: React.FC<AttendanceReportsProps> = ({
  courses,
  subjects,
  students,
}) => {
  const [studentIdFilter, setStudentIdFilter] = useState<string>('');
  const [courseIdFilter, setCourseIdFilter] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('');
  const [semesterFilter, setSemesterFilter] = useState<string>('');
  const [subjectIdFilter, setSubjectIdFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('2026-01-01');
  const [dateTo, setDateTo] = useState<string>(new Date().toISOString().slice(0, 10));

  // Trigger search
  const [appliedFilters, setAppliedFilters] = useState<{
    student_id?: number;
    course_id?: number;
    branch?: string;
    semester?: number;
    subject_id?: number;
    date_from?: string;
    date_to?: string;
  }>({
    date_from: '2026-01-01',
    date_to: new Date().toISOString().slice(0, 10),
  });

  const reportItems: AttendanceReportItem[] = useMemo(() => {
    return DBService.getAttendanceReport(appliedFilters);
  }, [appliedFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      student_id: studentIdFilter ? Number(studentIdFilter) : undefined,
      course_id: courseIdFilter ? Number(courseIdFilter) : undefined,
      branch: branchFilter || undefined,
      semester: semesterFilter ? Number(semesterFilter) : undefined,
      subject_id: subjectIdFilter ? Number(subjectIdFilter) : undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    });
  };

  const handleReset = () => {
    setStudentIdFilter('');
    setCourseIdFilter('');
    setBranchFilter('');
    setSemesterFilter('');
    setSubjectIdFilter('');
    setDateFrom('2026-01-01');
    setDateTo(new Date().toISOString().slice(0, 10));
    setAppliedFilters({
      date_from: '2026-01-01',
      date_to: new Date().toISOString().slice(0, 10),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (reportItems.length === 0) return;

    const headers = ['Student Name', 'Roll Number', 'Course', 'Subject', 'Total Classes', 'Present', 'Absent', 'Percentage', 'Status'];
    const rows = reportItems.map(item => [
      `"${item.student_name}"`,
      `"${item.roll_number}"`,
      `"${item.course_name}"`,
      `"${item.subject_name}"`,
      item.total_classes,
      item.present_classes,
      item.absent_classes,
      `"${item.percentage}%"`,
      `"${item.status_category}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (category: 'Good' | 'Warning' | 'Critical') => {
    switch (category) {
      case 'Good':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Good (≥75%)</span>
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Warning (60–74%)</span>
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Critical (&lt;60%)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Attendance Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional attendance records computed via SQL aggregations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>[ PRINT ]</span>
          </button>
          <button
            id="download-csv-btn"
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>[ DOWNLOAD CSV ]</span>
          </button>
        </div>
      </div>

      {/* Filter Form Card */}
      <form onSubmit={handleSearch} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 no-print text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Filter Attendance Criteria
          </span>
          <span className="text-[11px] text-slate-400">
            {reportItems.length} records generated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Student Filter */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Student</label>
            <select
              value={studentIdFilter}
              onChange={e => setStudentIdFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">All Students</option>
              {students.map(st => (
                <option key={st.student_id} value={st.student_id}>
                  {st.roll_number} - {st.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Subject</label>
            <select
              value={subjectIdFilter}
              onChange={e => setSubjectIdFilter(e.target.value)}
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

          {/* Course Filter */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Course</label>
            <select
              value={courseIdFilter}
              onChange={e => setCourseIdFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
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

        {/* Buttons: [ SEARCH ] & [ RESET ] */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>[ RESET ]</span>
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>[ SEARCH ]</span>
          </button>
        </div>
      </form>

      {/* Printable Institutional Header (shown only when printing) */}
      <div className="hidden print-only mb-6 text-center">
        <h1 className="text-2xl font-bold">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</h1>
        <h2 className="text-lg font-semibold">Official Academic Attendance Roster</h2>
        <p className="text-xs">Generated on {new Date().toLocaleDateString()} | Date Range: {dateFrom} to {dateTo}</p>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 print-table">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3 text-center">Total Classes</th>
                <th className="px-4 py-3 text-center text-emerald-700">Present</th>
                <th className="px-4 py-3 text-center text-rose-700">Absent</th>
                <th className="px-4 py-3 text-center">Percentage</th>
                <th className="px-4 py-3 text-center">Academic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No attendance records match the selected parameters.
                  </td>
                </tr>
              ) : (
                reportItems.map((item, idx) => (
                  <tr key={`${item.student_id}_${item.subject_id}_${idx}`} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                      {item.roll_number}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.student_name}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item.subject_name}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800">
                      {item.total_classes}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600">
                      {item.present_classes}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-rose-600">
                      {item.absent_classes}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(item.status_category)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
