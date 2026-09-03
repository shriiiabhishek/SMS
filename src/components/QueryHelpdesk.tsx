import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, PlusCircle, CheckCircle2, Clock, AlertTriangle, 
  Search, Filter, Send, User, ChevronRight, Sparkles, Bell, 
  FileText, ShieldCheck, Check, ArrowRight, X, AlertCircle, RefreshCw,
  BookOpen, HelpCircle, Layers, Tag
} from 'lucide-react';
import { DBService } from '../services/storage';
import { 
  SessionUser, AcademicQuery, QueryCategory, QueryPriority, 
  QueryStatus, Teacher, Subject, SystemNotification 
} from '../types';

interface QueryHelpdeskProps {
  session: SessionUser | null;
  teachers: Teacher[];
  subjects: Subject[];
  navigate: (path: string) => void;
}

export const QueryHelpdesk: React.FC<QueryHelpdeskProps> = ({
  session,
  teachers,
  subjects,
  navigate,
}) => {
  const [queries, setQueries] = useState<AcademicQuery[]>(() => DBService.getAcademicQueries());
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => 
    DBService.getNotifications(session?.role, session?.user_id)
  );
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Tab and Filters
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved' | 'my' | 'assigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Modal / Form States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [resolvingQuery, setResolvingQuery] = useState<AcademicQuery | null>(null);
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState<QueryStatus>('Resolved');
  const [replyTextMap, setReplyTextMap] = useState<Record<number, string>>({});
  const [activeQueryId, setActiveQueryId] = useState<number | null>(null);

  // New Query Form State
  const [formCategory, setFormCategory] = useState<QueryCategory>('Attendance Correction');
  const [formPriority, setFormPriority] = useState<QueryPriority>('Medium');
  const [formSubject, setFormSubject] = useState<string>(subjects[0]?.subject_code || 'General Academic');
  const [formAssignedTo, setFormAssignedTo] = useState<'Teacher' | 'Admin' | 'HOD'>('Teacher');
  const [formTargetTeacherId, setFormTargetTeacherId] = useState<number>(teachers[0]?.teacher_id || 1);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  const refreshData = () => {
    setQueries(DBService.getAcademicQueries());
    setNotifications(DBService.getNotifications(session?.role, session?.user_id));
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Statistics
  const stats = useMemo(() => {
    const total = queries.length;
    const pending = queries.filter(q => q.status === 'Pending').length;
    const inProgress = queries.filter(q => q.status === 'In Progress').length;
    const resolved = queries.filter(q => q.status === 'Resolved').length;
    const myQueries = queries.filter(q => q.sender_id === session?.user_id).length;
    return { total, pending, inProgress, resolved, myQueries };
  }, [queries, session]);

  // Filtered queries
  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      // Tab filter
      if (activeTab === 'pending' && q.status === 'Resolved') return false;
      if (activeTab === 'resolved' && q.status !== 'Resolved') return false;
      if (activeTab === 'my' && q.sender_id !== session?.user_id) return false;
      if (activeTab === 'assigned') {
        if (session?.role === 'teacher' && q.target_teacher_id !== session.teacher_id) return false;
        if (session?.role === 'admin' && q.assigned_to !== 'Admin' && q.assigned_to !== 'HOD') return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;

      // Priority filter
      if (selectedPriority !== 'all' && q.priority !== selectedPriority) return false;

      // Search
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(queryLower);
        const matchesDesc = q.description.toLowerCase().includes(queryLower);
        const matchesSender = q.sender_name.toLowerCase().includes(queryLower);
        const matchesDetail = (q.sender_detail || '').toLowerCase().includes(queryLower);
        const matchesSubject = (q.subject_code || '').toLowerCase().includes(queryLower);
        if (!matchesTitle && !matchesDesc && !matchesSender && !matchesDetail && !matchesSubject) {
          return false;
        }
      }

      return true;
    });
  }, [queries, activeTab, selectedCategory, selectedPriority, searchQuery, session]);

  // Handle Create Query
  const handleCreateQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    const senderRole = session?.role || 'student';
    const targetTeacher = teachers.find(t => t.teacher_id === Number(formTargetTeacherId));

    let senderDetail = 'Student';
    if (session?.role === 'student') {
      senderDetail = `Student ID #${session.student_id || session.user_id}`;
    } else if (session?.role === 'teacher') {
      senderDetail = `Faculty Member`;
    } else if (session?.role === 'admin') {
      senderDetail = 'Administrator';
    }

    const result = DBService.createAcademicQuery({
      sender_id: session?.user_id || 99,
      sender_name: session?.full_name || 'Anonymous User',
      sender_role: senderRole,
      sender_detail: senderDetail,
      sender_email: session?.email || 'user@college.edu',
      category: formCategory,
      priority: formPriority,
      subject_code: formSubject,
      title: formTitle.trim(),
      description: formDescription.trim(),
      assigned_to: formAssignedTo,
      target_teacher_id: formAssignedTo === 'Teacher' ? Number(formTargetTeacherId) : undefined,
      target_teacher_name: formAssignedTo === 'Teacher' ? targetTeacher?.name : undefined,
    });

    if (result.success) {
      setSubmitSuccessMsg('Problem shared successfully! Recipient has received real-time notification.');
      setFormTitle('');
      setFormDescription('');
      refreshData();
      setTimeout(() => {
        setSubmitSuccessMsg('');
        setIsShareModalOpen(false);
      }, 1500);
    }
  };

  // Handle Resolve
  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingQuery) return;

    const resolverName = session?.full_name || 'Academic Authority';

    if (resolutionStatus === 'Resolved') {
      DBService.resolveQuery(
        resolvingQuery.query_id,
        resolutionRemarks.trim() || 'Issue addressed and resolved as per college academic protocol.',
        resolverName
      );
    } else {
      DBService.updateQueryStatus(
        resolvingQuery.query_id,
        resolutionStatus,
        resolutionRemarks.trim(),
        resolverName
      );
    }

    setResolvingQuery(null);
    setResolutionRemarks('');
    refreshData();
  };

  // Handle Reply
  const handlePostReply = (queryId: number) => {
    const text = replyTextMap[queryId];
    if (!text || !text.trim()) return;

    DBService.addQueryReply(queryId, {
      author_name: session?.full_name || 'User',
      author_role: session?.role || 'student',
      author_id: session?.user_id,
      message: text.trim(),
    });

    setReplyTextMap(prev => ({ ...prev, [queryId]: '' }));
    refreshData();
  };

  const getPriorityBadge = (priority: QueryPriority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">Urgent</span>;
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      case 'Low':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  const getStatusBadge = (status: QueryStatus) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const isUserResolver = session?.role === 'admin' || session?.role === 'teacher';

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student & Teacher Problem Resolution Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Academic Queries & Grievances
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-form-text">
              Direct communication portal for students and faculty. Report attendance discrepancies, syllabus doubts, lab issues or leave requests with instant notifications and fast resolution tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Notification Bell Button */}
            <div className="relative">
              <button
                type="button"
                id="open-notifications-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer relative"
                title="View Notifications"
              >
                <Bell className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold font-display hidden sm:inline">Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 text-slate-800 animate-scale-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 font-display font-bold text-sm text-slate-900">
                      <Bell className="w-4 h-4 text-amber-500" />
                      <span>Notification Feed</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        DBService.markAllNotificationsRead(session?.role, session?.user_id);
                        refreshData();
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Mark All Read
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.notification_id}
                          onClick={() => {
                            DBService.markNotificationRead(n.notification_id);
                            refreshData();
                            if (n.query_id) setActiveQueryId(n.query_id);
                          }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                            !n.read ? 'bg-indigo-50/70 hover:bg-indigo-100/70 font-semibold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span className="font-bold text-indigo-700">{n.title}</span>
                            <span className="text-[10px]">{n.created_at.slice(5, 16)}</span>
                          </div>
                          <p className="text-xs text-slate-700 font-form-text">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Share Problem Button */}
            <button
              type="button"
              id="open-share-problem-modal-btn"
              onClick={() => setIsShareModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] font-display"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Problem / Query</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display">Total Queries</div>
            <div className="text-2xl font-black text-white font-display mt-0.5">{stats.total}</div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/30">
            <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider font-display">Pending Review</div>
            <div className="text-2xl font-black text-rose-400 font-display mt-0.5">{stats.pending}</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/30">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-display">In Progress</div>
            <div className="text-2xl font-black text-amber-400 font-display mt-0.5">{stats.inProgress}</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/30">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider font-display">Resolved</div>
            <div className="text-2xl font-black text-emerald-400 font-display mt-0.5">{stats.resolved}</div>
          </div>
        </div>
      </div>

      {/* Control Tabs & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              id="tab-queries-all"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${
                activeTab === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Problems ({stats.total})
            </button>
            <button
              type="button"
              id="tab-queries-pending"
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${
                activeTab === 'pending'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active / Pending ({stats.pending + stats.inProgress})
            </button>
            <button
              type="button"
              id="tab-queries-resolved"
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${
                activeTab === 'resolved'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({stats.resolved})
            </button>
            <button
              type="button"
              id="tab-queries-my"
              onClick={() => setActiveTab('my')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${
                activeTab === 'my'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Shared Problems
            </button>
            {isUserResolver && (
              <button
                type="button"
                id="tab-queries-assigned"
                onClick={() => setActiveTab('assigned')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${
                  activeTab === 'assigned'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                Needs My Action ⚡
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshData}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh queries"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic, roll no, faculty..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-form-text"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-700 font-form-text"
          >
            <option value="all">All Problem Categories</option>
            <option value="Attendance Correction">Attendance Correction</option>
            <option value="Subject / Syllabus Doubt">Subject / Syllabus Doubt</option>
            <option value="Medical Leave / Absence">Medical Leave / Absence</option>
            <option value="Classroom / Lab Issue">Classroom / Lab Issue</option>
            <option value="Exam & Marks Dispute">Exam & Marks Dispute</option>
            <option value="Timetable Clash">Timetable Clash</option>
            <option value="General Grievance">General Grievance</option>
          </select>

          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-700 font-form-text"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Query Cards List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 font-display">No queries found matching the criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-form-text">
              Need assistance or want to clarify attendance? Click "Share Problem / Query" to create a new ticket.
            </p>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer font-display"
            >
              Share New Problem
            </button>
          </div>
        ) : (
          filteredQueries.map(q => {
            const isExpanded = activeQueryId === q.query_id;
            return (
              <div
                key={q.query_id}
                className={`bg-white rounded-2xl border transition-all shadow-xs ${
                  isExpanded ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Bar: Badges and Actions */}
                  <div className="flex flex-wrap items-start justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(q.status)}
                      {getPriorityBadge(q.priority)}
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 font-display">
                        {q.category}
                      </span>
                      {q.subject_code && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                          {q.subject_code}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-form-text">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{q.created_at}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                      {q.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-form-text whitespace-pre-line">
                      {q.description}
                    </p>
                  </div>

                  {/* Meta Details: Submitter and Target */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600 font-form-text">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Posted by: <strong className="text-slate-800">{q.sender_name}</strong> ({q.sender_detail || q.sender_role})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>
                        Assigned To: <strong className="text-indigo-900">{q.assigned_to}</strong> {q.target_teacher_name ? `(${q.target_teacher_name})` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Resolution Box if Resolved */}
                  {q.resolution_remarks && (
                    <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 space-y-1.5 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-800 font-display">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Official Resolution Remarks:</span>
                        </span>
                        {q.resolved_at && <span className="text-[10px] text-emerald-700 font-normal">{q.resolved_at}</span>}
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-900 font-form-text leading-relaxed">
                        {q.resolution_remarks}
                      </p>
                      {q.resolved_by && (
                        <div className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200/60">
                          Resolved by: <strong>{q.resolved_by}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons: Resolve, Reply & View Details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveQueryId(isExpanded ? null : q.query_id)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer font-display"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>
                        {isExpanded ? 'Hide Discussion' : `Discussion / Replies (${q.replies?.length || 0})`}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Resolve Action Button for Authorized Users */}
                      {isUserResolver && q.status !== 'Resolved' && (
                        <button
                          type="button"
                          id={`resolve-query-btn-${q.query_id}`}
                          onClick={() => {
                            setResolvingQuery(q);
                            setResolutionRemarks(q.resolution_remarks || '');
                            setResolutionStatus('Resolved');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer font-display"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve Issue</span>
                        </button>
                      )}

                      {isUserResolver && q.status === 'Resolved' && (
                        <button
                          type="button"
                          onClick={() => {
                            setResolvingQuery(q);
                            setResolutionRemarks(q.resolution_remarks || '');
                            setResolutionStatus('In Progress');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs cursor-pointer"
                        >
                          Edit Resolution
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Threaded Discussion */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <div className="text-xs font-bold text-slate-700 font-display flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Threaded Messages & Status Updates</span>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {(!q.replies || q.replies.length === 0) ? (
                          <div className="text-xs text-slate-400 italic py-2">
                            No follow-up messages yet. Post a clarification below.
                          </div>
                        ) : (
                          q.replies.map(rep => (
                            <div 
                              key={rep.reply_id}
                              className={`p-3 rounded-xl text-xs space-y-1 ${
                                rep.author_role === 'student' 
                                  ? 'bg-slate-50 border border-slate-200/80 ml-0 mr-6' 
                                  : 'bg-indigo-50/70 border border-indigo-100 ml-6 mr-0'
                              }`}
                            >
                              <div className="flex items-center justify-between font-display">
                                <span className="font-bold text-slate-900">
                                  {rep.author_name} ({rep.author_role})
                                </span>
                                <span className="text-[10px] text-slate-500">{rep.created_at}</span>
                              </div>
                              <p className="text-slate-700 font-form-text">{rep.message}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Reply Box */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyTextMap[q.query_id] || ''}
                          onChange={e => setReplyTextMap({ ...replyTextMap, [q.query_id]: e.target.value })}
                          placeholder="Write clarification or follow-up note..."
                          onKeyDown={e => {
                            if (e.key === 'Enter') handlePostReply(q.query_id);
                          }}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-form-text"
                        />
                        <button
                          type="button"
                          onClick={() => handlePostReply(q.query_id)}
                          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer font-display"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Share Problem / New Query */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">Share Problem / Query</h3>
                  <p className="text-xs text-slate-500 font-form-text">Direct submission to teachers or administration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccessMsg ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 font-display">Problem Shared Successfully!</h4>
                <p className="text-xs text-emerald-700 font-form-text">{submitSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateQuery} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                      Problem Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value as QueryCategory)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-form-text"
                    >
                      <option value="Attendance Correction">Attendance Correction (Roll Call)</option>
                      <option value="Subject / Syllabus Doubt">Subject / Syllabus Doubt</option>
                      <option value="Medical Leave / Absence">Medical Leave / Absence Request</option>
                      <option value="Classroom / Lab Issue">Classroom / Lab Issue</option>
                      <option value="Exam & Marks Dispute">Exam & Marks Dispute</option>
                      <option value="Timetable Clash">Timetable Clash</option>
                      <option value="General Grievance">General Grievance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                      Priority Level
                    </label>
                    <select
                      value={formPriority}
                      onChange={e => setFormPriority(e.target.value as QueryPriority)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-form-text"
                    >
                      <option value="Low">Low (General Inquiry)</option>
                      <option value="Medium">Medium (Regular Academic)</option>
                      <option value="High">High (Attendance / Eligibility Risk)</option>
                      <option value="Urgent">Urgent (Immediate Lab / Exam Issue)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                      Route Problem To
                    </label>
                    <select
                      value={formAssignedTo}
                      onChange={e => setFormAssignedTo(e.target.value as 'Teacher' | 'Admin' | 'HOD')}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-form-text"
                    >
                      <option value="Teacher">Subject Teacher / Faculty</option>
                      <option value="HOD">Head of Department (HOD)</option>
                      <option value="Admin">Administrator Office</option>
                    </select>
                  </div>

                  {formAssignedTo === 'Teacher' ? (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                        Select Teacher
                      </label>
                      <select
                        value={formTargetTeacherId}
                        onChange={e => setFormTargetTeacherId(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-form-text"
                      >
                        {teachers.map(t => (
                          <option key={t.teacher_id} value={t.teacher_id}>
                            {t.name} ({t.department.slice(0, 18)}...)
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                        Related Subject (Optional)
                      </label>
                      <select
                        value={formSubject}
                        onChange={e => setFormSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-form-text"
                      >
                        <option value="General Academic">General Academic</option>
                        {subjects.map(s => (
                          <option key={s.subject_id} value={`${s.subject_code} (${s.subject_name})`}>
                            {s.subject_code} - {s.subject_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                    Problem Summary / Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Absent marked for DBMS on 02-Feb by mistake"
                    required
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 font-form-text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                    Detailed Problem Statement & Proof
                  </label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    placeholder="Please explain the issue clearly. For attendance corrections, specify the date, lecture period, and classroom details..."
                    required
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 font-form-text"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                  <Bell className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Submitting this form immediately fires an in-app notification to the chosen recipient, who can review and post official resolution remarks.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold font-display"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs tracking-wide shadow-md shadow-indigo-200 flex items-center gap-1.5 cursor-pointer font-display"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Notify</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Problem Resolution by Teacher/Admin */}
      {resolvingQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">Resolve Academic Problem</h3>
                  <p className="text-xs text-slate-500">Query #{resolvingQuery.query_id}: {resolvingQuery.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResolvingQuery(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-800">
                Submitted by: {resolvingQuery.sender_name} ({resolvingQuery.sender_detail})
              </div>
              <p className="text-slate-600 font-form-text">{resolvingQuery.description}</p>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                  Update Query Status
                </label>
                <select
                  value={resolutionStatus}
                  onChange={e => setResolutionStatus(e.target.value as QueryStatus)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-form-text font-bold text-slate-800"
                >
                  <option value="Resolved">✅ Mark as Resolved (Issue Solved)</option>
                  <option value="In Progress">⏳ Mark In Progress (Checking Physical Register)</option>
                  <option value="Pending">🔴 Leave as Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-display">
                  Official Resolution Remarks / Action Taken
                </label>
                <textarea
                  rows={4}
                  value={resolutionRemarks}
                  onChange={e => setResolutionRemarks(e.target.value)}
                  placeholder="e.g. Verified physical attendance register for 02-Feb: Attendance corrected to Present in database records."
                  required
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-form-text"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>The submitter will receive an instant notification with your official resolution note.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResolvingQuery(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold font-display"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wide shadow-md shadow-emerald-200 flex items-center gap-1.5 cursor-pointer font-display"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Submit Resolution & Notify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
