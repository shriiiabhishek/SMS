import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentManagement } from './components/StudentManagement';
import { TeacherManagement } from './components/TeacherManagement';
import { CourseSubjectManagement } from './components/CourseSubjectManagement';
import { AttendanceMarking } from './components/AttendanceMarking';
import { AttendanceReports } from './components/AttendanceReports';
import { DataAnalytics } from './components/DataAnalytics';
import { ContactSupport } from './components/ContactSupport';
import { QueryHelpdesk } from './components/QueryHelpdesk';
import { DBService } from './services/storage';
import { SessionUser, Student, Teacher, Course, Subject, AnalyticsSummary } from './types';

export default function App() {
  // Navigation & Session - Default starts at /login as requested
  const [currentPath, setCurrentPath] = useState<string>('/login');
  const [session, setSession] = useState<SessionUser | null>(() => DBService.getCurrentSession());
  const [targetStudentId, setTargetStudentId] = useState<number | undefined>(undefined);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  // Core Data
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>(() => DBService.getAnalyticsSummary());

  // Refresh DB state
  const refreshData = () => {
    setStudents(DBService.getStudents());
    setTeachers(DBService.getTeachers());
    setCourses(DBService.getCourses());
    setSubjects(DBService.getSubjects());
    setSummary(DBService.getAnalyticsSummary());
    setUnreadNotifications(DBService.getUnreadNotificationCount(session?.role, session?.user_id));
  };

  useEffect(() => {
    refreshData();
  }, [session]);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (newSession: SessionUser) => {
    DBService.saveSession(newSession);
    setSession(newSession);
    refreshData();
  };

  const handleLogout = () => {
    DBService.clearSession();
    setSession(null);
    navigate('/login');
  };

  const handleViewStudentAttendance = (studentId: number) => {
    setTargetStudentId(studentId);
    navigate('/student/dashboard');
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentPath) {
      case '/':
        return <LandingPage navigate={navigate} onQuickLogin={role => {
          if (role === 'admin') navigate('/admin/dashboard');
          else if (role === 'teacher') navigate('/teacher/dashboard');
          else navigate('/student/dashboard');
        }} />;

      case '/login':
        return <LoginPage navigate={navigate} onLoginSuccess={handleLoginSuccess} />;

      case '/register':
        return <RegisterPage navigate={navigate} courses={courses} />;

      case '/queries':
      case '/helpdesk':
        return (
          <QueryHelpdesk
            session={session}
            teachers={teachers}
            subjects={subjects}
            navigate={navigate}
          />
        );

      case '/admin/dashboard':
        return (
          <AdminDashboard
            summary={summary}
            session={session || { user_id: 1, username: 'admin', full_name: 'Administrator', role: 'admin', logged_in: true, email: 'admin@college.edu' }}
            onNavigateTab={tab => {
              if (tab === 'students') navigate('/students');
              else if (tab === 'teachers') navigate('/teachers');
              else if (tab === 'courses') navigate('/courses');
              else if (tab === 'subjects') navigate('/subjects');
              else if (tab === 'attendance') navigate('/attendance');
              else if (tab === 'reports') navigate('/attendance-report');
              else if (tab === 'analytics') navigate('/analytics');
              else if (tab === 'low-attendance') navigate('/analytics');
              else if (tab === 'queries') navigate('/queries');
            }}
          />
        );

      case '/teacher/dashboard':
        return (
          <TeacherDashboard
            session={session || { user_id: 2, username: 'prof_sharma', full_name: 'Dr. Rajesh Sharma', role: 'teacher', logged_in: true, email: 'sharma@college.edu', teacher_id: 1 }}
            subjects={subjects}
            courses={courses}
            students={students}
            onNavigateTab={tab => {
              if (tab === 'attendance') navigate('/attendance');
              else if (tab === 'reports') navigate('/attendance-report');
              else if (tab === 'analytics') navigate('/analytics');
              else if (tab === 'queries') navigate('/queries');
            }}
          />
        );

      case '/student/dashboard':
        return (
          <StudentDashboard
            session={session || { user_id: 3, username: 'rahul101', full_name: 'Rahul Sharma', role: 'student', logged_in: true, email: 'rahul.sharma@college.edu', student_id: 1 }}
            studentId={targetStudentId || session?.student_id || 1}
            navigate={navigate}
          />
        );

      case '/students':
        return (
          <StudentManagement
            students={students}
            courses={courses}
            onRefresh={refreshData}
            onViewStudentAttendance={handleViewStudentAttendance}
          />
        );

      case '/teachers':
        return (
          <TeacherManagement
            teachers={teachers}
            subjects={subjects}
            onRefresh={refreshData}
          />
        );

      case '/courses':
      case '/subjects':
        return (
          <CourseSubjectManagement
            courses={courses}
            subjects={subjects}
            teachers={teachers}
            onRefresh={refreshData}
          />
        );

      case '/attendance':
        return (
          <AttendanceMarking
            session={session || { user_id: 1, username: 'admin', full_name: 'Administrator', role: 'admin', logged_in: true, email: 'admin@college.edu' }}
            courses={courses}
            subjects={subjects}
            students={students}
            onAttendanceSaved={refreshData}
            navigate={navigate}
          />
        );

      case '/attendance-report':
        return (
          <AttendanceReports
            courses={courses}
            subjects={subjects}
            students={students}
          />
        );

      case '/analytics':
      case '/data-analytics':
        return (
          <DataAnalytics
            courses={courses}
            subjects={subjects}
            teachers={teachers}
            students={students}
          />
        );

      case '/contact':
        return <ContactSupport session={session} />;

      default:
        return <LoginPage navigate={navigate} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Global Navigation Bar */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        session={session}
        onLogout={handleLogout}
        unreadQueriesCount={unreadNotifications}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
