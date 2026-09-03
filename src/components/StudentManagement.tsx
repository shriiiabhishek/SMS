import React, { useState, useMemo } from 'react';
import { 
  Users, UserPlus, Search, Filter, Edit, Trash2, 
  Eye, CheckCircle2, AlertCircle, X, ChevronRight, Download, CalendarCheck
} from 'lucide-react';
import { Student, Course } from '../types';
import { DBService } from '../services/storage';

interface StudentManagementProps {
  students: Student[];
  courses: Course[];
  onRefresh: () => void;
  onViewStudentAttendance: (studentId: number) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  courses,
  onRefresh,
  onViewStudentAttendance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Student | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form State
  const initialFormState: Omit<Student, 'student_id'> = {
    roll_number: '',
    enrollment_number: '',
    full_name: '',
    father_name: '',
    mother_name: '',
    dob: '2004-01-01',
    gender: 'Male',
    email: '',
    mobile: '',
    address: '',
    course_id: courses[0]?.course_id || 1,
    course_name: courses[0]?.course_name || 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: new Date().toISOString().slice(0, 10),
    status: 'Active',
  };

  const [formData, setFormData] = useState<Omit<Student, 'student_id'>>(initialFormState);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(st => {
      const matchSearch = 
        st.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCourse = !courseFilter || st.course_name === courseFilter;
      const matchSemester = !semesterFilter || st.semester.toString() === semesterFilter;
      const matchStatus = !statusFilter || st.status === statusFilter;

      return matchSearch && matchCourse && matchSemester && matchStatus;
    });
  }, [students, searchTerm, courseFilter, semesterFilter, statusFilter]);

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      roll_number: student.roll_number,
      enrollment_number: student.enrollment_number,
      full_name: student.full_name,
      father_name: student.father_name,
      mother_name: student.mother_name,
      dob: student.dob,
      gender: student.gender,
      email: student.email,
      mobile: student.mobile,
      address: student.address,
      course_id: student.course_id,
      course_name: student.course_name,
      branch: student.branch,
      semester: student.semester,
      batch: student.batch,
      admission_date: student.admission_date,
      status: student.status,
    });
    setFormError('');
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.roll_number.trim() || !formData.enrollment_number.trim() || !formData.full_name.trim()) {
      setFormError('Roll Number, Enrollment Number, and Full Name are mandatory.');
      return;
    }

    if (editingStudent) {
      const res = DBService.updateStudent(editingStudent.student_id, formData);
      if (!res.success) {
        setFormError(res.message);
        return;
      }
      setSuccessToast(`Student ${formData.full_name} updated successfully.`);
      setEditingStudent(null);
    } else {
      const res = DBService.addStudent(formData);
      if (!res.success) {
        setFormError(res.message);
        return;
      }
      setSuccessToast(`Student ${formData.full_name} enrolled successfully.`);
      setIsAddModalOpen(false);
    }

    onRefresh();
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDelete = (id: number) => {
    const res = DBService.deleteStudent(id);
    setDeleteConfirmationId(null);
    if (res.success) {
      setSuccessToast('Student deleted successfully from database.');
      onRefresh();
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Add Student Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Student Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Database records for student admissions, roll numbers, and academic profiles
          </p>
        </div>

        <button
          id="add-student-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="student-search-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Roll No or Name..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.course_id} value={c.course_name}>{c.course_name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={semesterFilter}
              onChange={e => setSemesterFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s.toString()}>Semester {s}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Enrollment No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Course / Branch</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.student_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                      {student.roll_number}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {student.enrollment_number}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {student.full_name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{student.course_name}</span>
                      <span className="text-slate-400"> ({student.branch})</span>
                    </td>
                    <td className="px-4 py-3">
                      Sem {student.semester}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {student.batch}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        student.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {/* View Profile */}
                      <button
                        onClick={() => setViewingProfile(student)}
                        title="View Full Student Profile"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* View Attendance */}
                      <button
                        onClick={() => onViewStudentAttendance(student.student_id)}
                        title="View Attendance Record"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(student)}
                        title="Edit Student Details"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteConfirmationId(student.student_id)}
                        title="Delete Student"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Edit Student Details' : 'Add New Student Record'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingStudent(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.roll_number}
                    onChange={e => setFormData({ ...formData, roll_number: e.target.value })}
                    placeholder="e.g. 111"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enrollment Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.enrollment_number}
                    onChange={e => setFormData({ ...formData, enrollment_number: e.target.value })}
                    placeholder="e.g. 0101CS221011"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Rohit Kumar"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={formData.father_name}
                    onChange={e => setFormData({ ...formData, father_name: e.target.value })}
                    placeholder="Father Name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.mother_name}
                    onChange={e => setFormData({ ...formData, mother_name: e.target.value })}
                    placeholder="Mother Name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={formData.course_name}
                    onChange={e => {
                      const selected = courses.find(c => c.course_name === e.target.value);
                      setFormData({
                        ...formData,
                        course_name: e.target.value,
                        course_id: selected?.course_id || 1,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.course_id} value={c.course_name}>{c.course_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={e => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="e.g. 2022-2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Date</label>
                  <input
                    type="date"
                    value={formData.admission_date}
                    onChange={e => setFormData({ ...formData, admission_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, State, PIN"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingStudent(null); }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  {editingStudent ? 'Update Student Record' : 'Save Student to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                  {viewingProfile.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingProfile.full_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Roll: {viewingProfile.roll_number} | {viewingProfile.enrollment_number}</p>
                </div>
              </div>
              <button onClick={() => setViewingProfile(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div><span className="text-slate-400">Course:</span> <strong className="text-slate-800">{viewingProfile.course_name}</strong></div>
              <div><span className="text-slate-400">Branch:</span> <strong className="text-slate-800">{viewingProfile.branch}</strong></div>
              <div><span className="text-slate-400">Semester:</span> <strong className="text-slate-800">Sem {viewingProfile.semester}</strong></div>
              <div><span className="text-slate-400">Batch:</span> <strong className="text-slate-800">{viewingProfile.batch}</strong></div>
              <div><span className="text-slate-400">Gender:</span> <strong className="text-slate-800">{viewingProfile.gender}</strong></div>
              <div><span className="text-slate-400">DOB:</span> <strong className="text-slate-800">{viewingProfile.dob}</strong></div>
              <div><span className="text-slate-400">Father Name:</span> <strong className="text-slate-800">{viewingProfile.father_name || 'N/A'}</strong></div>
              <div><span className="text-slate-400">Mother Name:</span> <strong className="text-slate-800">{viewingProfile.mother_name || 'N/A'}</strong></div>
              <div><span className="text-slate-400">Email:</span> <strong className="text-slate-800">{viewingProfile.email || 'N/A'}</strong></div>
              <div><span className="text-slate-400">Mobile:</span> <strong className="text-slate-800">{viewingProfile.mobile || 'N/A'}</strong></div>
              <div className="col-span-2"><span className="text-slate-400">Address:</span> <strong className="text-slate-800">{viewingProfile.address || 'N/A'}</strong></div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const id = viewingProfile.student_id;
                  setViewingProfile(null);
                  onViewStudentAttendance(id);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>View Attendance Breakdown</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Student Record?</h3>
            <p className="text-xs text-slate-500">
              This action will permanently delete this student record and all associated attendance entries from the SQL database.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmationId)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
