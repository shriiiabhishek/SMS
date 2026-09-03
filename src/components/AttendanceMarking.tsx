import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, CheckCircle2, XCircle, AlertCircle, 
  Users, Save, ArrowRight, CheckCheck, RefreshCw, Calendar, BookOpen
} from 'lucide-react';
import { Course, Subject, Teacher, Student, SessionUser, AttendanceRecord } from '../types';
import { DBService } from '../services/storage';

interface AttendanceMarkingProps {
  session: SessionUser;
  courses: Course[];
  subjects: Subject[];
  students: Student[];
  onAttendanceSaved: () => void;
  navigate: (path: string) => void;
}

export const AttendanceMarking: React.FC<AttendanceMarkingProps> = ({
  session,
  courses,
  subjects,
  students,
  onAttendanceSaved,
  navigate,
}) => {
  // If teacher, filter subjects assigned to this teacher
  const availableSubjects = session.role === 'teacher' && session.teacher_id
    ? subjects.filter(s => s.teacher_id === session.teacher_id)
    : subjects;

  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(availableSubjects[0]?.subject_id || 1);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(courses[0]?.course_id || 1);
  const [selectedBranch, setSelectedBranch] = useState<string>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [selectedBatch, setSelectedBatch] = useState<string>('2022-2026');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Loaded students list
  const [loadedStudents, setLoadedStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<{ [studentId: number]: 'Present' | 'Absent' }>({});
  const [existingRecordsNotice, setExistingRecordsNotice] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // When subject changes, auto-align course, branch, semester
  useEffect(() => {
    const sub = subjects.find(s => s.subject_id === Number(selectedSubjectId));
    if (sub) {
      setSelectedCourseId(sub.course_id);
      setSelectedBranch(sub.branch);
      setSelectedSemester(sub.semester);
    }
  }, [selectedSubjectId, subjects]);

  const handleLoadStudents = () => {
    setToastMessage(null);
    setExistingRecordsNotice('');

    // Filter students matching criteria
    const filtered = students.filter(st => {
      const matchCourse = st.course_id === Number(selectedCourseId);
      const matchBranch = !selectedBranch || st.branch.toLowerCase() === selectedBranch.toLowerCase();
      const matchSem = st.semester === Number(selectedSemester);
      const matchBatch = !selectedBatch || st.batch === selectedBatch;
      const matchActive = st.status === 'Active';
      return matchCourse && matchBranch && matchSem && matchBatch && matchActive;
    });

    setLoadedStudents(filtered);
    setHasLoaded(true);

    if (filtered.length === 0) {
      setToastMessage({ text: 'No active students found matching these class parameters.', type: 'error' });
      setAttendanceMap({});
      return;
    }

    // Check existing attendance in DB for this date and subject
    const allAttendance = DBService.getAttendance();
    const existing = allAttendance.filter(
      a => a.subject_id === Number(selectedSubjectId) && a.attendance_date === attendanceDate
    );

    const initialMap: { [id: number]: 'Present' | 'Absent' } = {};

    if (existing.length > 0) {
      setExistingRecordsNotice(
        `Notice: ${existing.length} student attendance entries already exist for ${attendanceDate} in this subject. Loading existing records (saving will update them).`
      );
      filtered.forEach(st => {
        const found = existing.find(e => e.student_id === st.student_id);
        initialMap[st.student_id] = found ? found.status : 'Present';
      });
    } else {
      // Default all to Present
      filtered.forEach(st => {
        initialMap[st.student_id] = 'Present';
      });
    }

    setAttendanceMap(initialMap);
  };

  const setAllStatus = (status: 'Present' | 'Absent') => {
    const nextMap: { [id: number]: 'Present' | 'Absent' } = {};
    loadedStudents.forEach(st => {
      nextMap[st.student_id] = status;
    });
    setAttendanceMap(nextMap);
  };

  const toggleStudentStatus = (studentId: number, status: 'Present' | 'Absent') => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = () => {
    if (loadedStudents.length === 0) {
      setToastMessage({ text: 'Please load students first before saving.', type: 'error' });
      return;
    }

    // Find teacher ID
    const currentSubject = subjects.find(s => s.subject_id === Number(selectedSubjectId));
    const teacherId = session.teacher_id || currentSubject?.teacher_id || 1;

    const recordsToSave = loadedStudents.map(st => ({
      student_id: st.student_id,
      subject_id: Number(selectedSubjectId),
      teacher_id: teacherId,
      attendance_date: attendanceDate,
      status: attendanceMap[st.student_id] || 'Present',
    }));

    const res = DBService.markAttendanceBatch(recordsToSave);

    if (res.success) {
      setToastMessage({ text: res.message, type: 'success' });
      onAttendanceSaved();
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }
  };

  const presentCount = Object.values(attendanceMap).filter(s => s === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter(s => s === 'Absent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <span>Attendance Module</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Teacher roll-call register with duplicate detection and dynamic SQL persistence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/attendance-report')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <span>View Attendance Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-2xs ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' 
            : 'bg-red-50 border border-red-300 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Existing records duplicate alert */}
      {existingRecordsNotice && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{existingRecordsNotice}</span>
        </div>
      )}

      {/* Class Selection Parameters Form as specified in requirement 15 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Select Lecture & Class Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Subject */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
            >
              {availableSubjects.map(sub => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_code} - {sub.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Course *</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
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
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Attendance Date *</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={e => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
        </div>

        {/* Load Students Button */}
        <div className="flex justify-end pt-2">
          <button
            id="load-students-btn"
            onClick={handleLoadStudents}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>[ LOAD STUDENTS ]</span>
          </button>
        </div>
      </div>

      {/* Attendance Sheet */}
      {hasLoaded && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Student Attendance Sheet ({loadedStudents.length} Students)
              </h3>
              <p className="text-xs text-slate-500">
                Date: <strong className="text-slate-800">{attendanceDate}</strong> | Subject ID: <strong className="text-slate-800">{selectedSubjectId}</strong>
              </p>
            </div>

            {/* Quick Action Counters & Mark All */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold">
                Present: {presentCount}
              </div>
              <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-semibold">
                Absent: {absentCount}
              </div>

              <button
                id="mark-all-present-btn"
                onClick={() => setAllStatus('Present')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>[ MARK ALL PRESENT ]</span>
              </button>
            </div>
          </div>

          {/* Student Table with Radio Buttons */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3 w-24">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3 text-center w-36">Present (P)</th>
                  <th className="px-4 py-3 text-center w-36">Absent (A)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadedStudents.map(st => {
                  const status = attendanceMap[st.student_id] || 'Present';
                  const isPresent = status === 'Present';

                  return (
                    <tr 
                      key={st.student_id} 
                      className={`transition-colors ${isPresent ? 'hover:bg-emerald-50/40' : 'bg-rose-50/30 hover:bg-rose-50/60'}`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                        {st.roll_number}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {st.full_name}
                      </td>

                      {/* Present Radio */}
                      <td className="px-4 py-3 text-center">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name={`att_${st.student_id}`}
                            checked={isPresent}
                            onChange={() => toggleStudentStatus(st.student_id, 'Present')}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                          />
                          <span className={`text-xs font-semibold ${isPresent ? 'text-emerald-700' : 'text-slate-400'}`}>
                            Present
                          </span>
                        </label>
                      </td>

                      {/* Absent Radio */}
                      <td className="px-4 py-3 text-center">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name={`att_${st.student_id}`}
                            checked={!isPresent}
                            onChange={() => toggleStudentStatus(st.student_id, 'Absent')}
                            className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300"
                          />
                          <span className={`text-xs font-semibold ${!isPresent ? 'text-rose-700' : 'text-slate-400'}`}>
                            Absent
                          </span>
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Save Attendance Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              id="save-attendance-btn"
              onClick={handleSaveAttendance}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>[ SAVE ATTENDANCE ]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
