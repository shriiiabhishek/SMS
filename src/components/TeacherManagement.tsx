import React, { useState } from 'react';
import { 
  UserCheck, UserPlus, Edit, Trash2, CheckCircle2, AlertCircle, X, Search 
} from 'lucide-react';
import { Teacher, Subject } from '../types';
import { DBService } from '../services/storage';

interface TeacherManagementProps {
  teachers: Teacher[];
  subjects: Subject[];
  onRefresh: () => void;
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({
  teachers,
  subjects,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState<Omit<Teacher, 'teacher_id'>>({
    name: '',
    email: '',
    mobile: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    status: 'Active',
  });

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      status: 'Active',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({
      name: t.name,
      email: t.email,
      mobile: t.mobile,
      department: t.department,
      designation: t.designation,
      status: t.status,
    });
    setFormError('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Name and Email are required.');
      return;
    }

    if (editingTeacher) {
      const res = DBService.updateTeacher(editingTeacher.teacher_id, formData);
      if (!res.success) {
        setFormError(res.message);
        return;
      }
      setToast(`Faculty ${formData.name} updated successfully.`);
      setEditingTeacher(null);
    } else {
      const res = DBService.addTeacher(formData);
      if (!res.success) {
        setFormError(res.message);
        return;
      }
      setToast(`Faculty ${formData.name} added successfully.`);
      setIsAddModalOpen(false);
    }

    onRefresh();
    setTimeout(() => setToast(''), 4000);
  };

  const handleDelete = (id: number) => {
    const res = DBService.deleteTeacher(id);
    setDeleteConfirmId(null);
    if (res.success) {
      setToast('Faculty deleted successfully.');
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <span>Teacher Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty directory, designations, and assigned academic subjects
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search faculty by name, department..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Teacher Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredTeachers.map(teacher => {
          const assignedSubjects = subjects.filter(s => s.teacher_id === teacher.teacher_id);

          return (
            <div key={teacher.teacher_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                      {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{teacher.name}</h3>
                      <span className="text-[11px] text-amber-700 font-medium">{teacher.designation}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    teacher.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {teacher.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  <p><span className="text-slate-400">Department:</span> {teacher.department}</p>
                  <p><span className="text-slate-400">Email:</span> {teacher.email}</p>
                  <p><span className="text-slate-400">Mobile:</span> {teacher.mobile || 'N/A'}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">
                    Assigned Subjects ({assignedSubjects.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assignedSubjects.length > 0 ? (
                      assignedSubjects.map(sub => (
                        <span key={sub.subject_id} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium">
                          {sub.subject_code} - {sub.subject_name.split('(')[0]}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">None assigned yet</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(teacher)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(teacher.teacher_id)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingTeacher) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingTeacher ? 'Edit Teacher Details' : 'Add New Faculty Member'}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditingTeacher(null); }} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
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

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingTeacher(null); }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  {editingTeacher ? 'Update Teacher' : 'Save Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Faculty Member?</h3>
            <p className="text-xs text-slate-500">
              Confirm removal of faculty record from the institutional database.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 border rounded-lg text-xs">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
