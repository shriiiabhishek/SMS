import React, { useState } from 'react';
import { 
  BookOpen, Layers, Plus, Trash2, CheckCircle2, AlertCircle, X, GraduationCap 
} from 'lucide-react';
import { Course, Subject, Teacher } from '../types';
import { DBService } from '../services/storage';

interface CourseSubjectManagementProps {
  courses: Course[];
  subjects: Subject[];
  teachers: Teacher[];
  onRefresh: () => void;
}

export const CourseSubjectManagement: React.FC<CourseSubjectManagementProps> = ({
  courses,
  subjects,
  teachers,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'subjects'>('subjects');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  // Course Form Modal
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    course_name: '',
    department: 'Computer Science & Engineering',
    duration: '4 Years',
  });

  // Subject Form Modal
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    subject_code: '',
    subject_name: '',
    course_id: courses[0]?.course_id || 1,
    branch: 'CSE',
    semester: 5,
    teacher_id: teachers[0]?.teacher_id || 1,
  });

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.course_name.trim()) {
      setError('Course Name is required.');
      return;
    }
    const res = DBService.addCourse(courseForm);
    if (res.success) {
      setToast('Course created successfully.');
      setIsAddCourseOpen(false);
      setCourseForm({ course_name: '', department: 'Computer Science & Engineering', duration: '4 Years' });
      onRefresh();
      setTimeout(() => setToast(''), 4000);
    }
  };

  const handleDeleteCourse = (id: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      DBService.deleteCourse(id);
      setToast('Course removed.');
      onRefresh();
      setTimeout(() => setToast(''), 4000);
    }
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.subject_code.trim() || !subjectForm.subject_name.trim()) {
      setError('Subject Code and Subject Name are required.');
      return;
    }
    const selectedCourse = courses.find(c => c.course_id === Number(subjectForm.course_id));
    const selectedTeacher = teachers.find(t => t.teacher_id === Number(subjectForm.teacher_id));

    const res = DBService.addSubject({
      subject_code: subjectForm.subject_code.trim(),
      subject_name: subjectForm.subject_name.trim(),
      course_id: Number(subjectForm.course_id),
      course_name: selectedCourse?.course_name,
      branch: subjectForm.branch,
      semester: Number(subjectForm.semester),
      teacher_id: Number(subjectForm.teacher_id),
      teacher_name: selectedTeacher?.name,
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    setToast('Subject registered successfully.');
    setIsAddSubjectOpen(false);
    setSubjectForm({
      subject_code: '',
      subject_name: '',
      course_id: courses[0]?.course_id || 1,
      branch: 'CSE',
      semester: 5,
      teacher_id: teachers[0]?.teacher_id || 1,
    });
    onRefresh();
    setTimeout(() => setToast(''), 4000);
  };

  const handleDeleteSubject = (id: number) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      DBService.deleteSubject(id);
      setToast('Subject deleted.');
      onRefresh();
      setTimeout(() => setToast(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'subjects' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Subjects ({subjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'courses' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses ({courses.length})</span>
          </button>
        </div>

        {activeTab === 'subjects' ? (
          <button
            onClick={() => { setError(''); setIsAddSubjectOpen(true); }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subject</span>
          </button>
        ) : (
          <button
            onClick={() => { setError(''); setIsAddCourseOpen(true); }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </button>
        )}
      </div>

      {/* Subjects View */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Subject Code</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Course / Branch</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Assigned Teacher</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subjects.map(sub => (
                  <tr key={sub.subject_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">{sub.subject_code}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{sub.subject_name}</td>
                    <td className="px-4 py-3">{sub.course_name} ({sub.branch})</td>
                    <td className="px-4 py-3">Semester {sub.semester}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{sub.teacher_name || 'Not assigned'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteSubject(sub.subject_id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Courses View */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => (
            <div key={course.course_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">ID #{course.course_id}</span>
                  <button
                    onClick={() => handleDeleteCourse(course.course_id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-2">{course.course_name}</h3>
                <p className="text-xs text-slate-500 mt-1"><span className="font-medium">Department:</span> {course.department}</p>
                <p className="text-xs text-slate-500"><span className="font-medium">Duration:</span> {course.duration}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-indigo-600 font-semibold">
                Associated Subjects: {subjects.filter(s => s.course_id === course.course_id).length}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Academic Subject</h3>
              <button onClick={() => setIsAddSubjectOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={subjectForm.subject_code}
                  onChange={e => setSubjectForm({ ...subjectForm, subject_code: e.target.value })}
                  placeholder="e.g. CS507"
                  className="w-full px-3 py-2 rounded-lg border font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={subjectForm.subject_name}
                  onChange={e => setSubjectForm({ ...subjectForm, subject_name: e.target.value })}
                  placeholder="e.g. Artificial Intelligence & ML"
                  className="w-full px-3 py-2 rounded-lg border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={subjectForm.course_id}
                    onChange={e => setSubjectForm({ ...subjectForm, course_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={subjectForm.semester}
                    onChange={e => setSubjectForm({ ...subjectForm, semester: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                  <input
                    type="text"
                    value={subjectForm.branch}
                    onChange={e => setSubjectForm({ ...subjectForm, branch: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Faculty</label>
                  <select
                    value={subjectForm.teacher_id}
                    onChange={e => setSubjectForm({ ...subjectForm, teacher_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border bg-white"
                  >
                    {teachers.map(t => (
                      <option key={t.teacher_id} value={t.teacher_id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsAddSubjectOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Academic Course</h3>
              <button onClick={() => setIsAddCourseOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  value={courseForm.course_name}
                  onChange={e => setCourseForm({ ...courseForm, course_name: e.target.value })}
                  placeholder="e.g. MCA or B.Tech AI & DS"
                  className="w-full px-3 py-2 rounded-lg border"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={courseForm.department}
                  onChange={e => setCourseForm({ ...courseForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={courseForm.duration}
                  onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                  placeholder="e.g. 4 Years / 3 Years"
                  className="w-full px-3 py-2 rounded-lg border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsAddCourseOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
