export type UserRole = 'admin' | 'teacher' | 'student';
export type UserStatus = 'active' | 'inactive';

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  mobile: string;
  username: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface SessionUser {
  user_id: number;
  username: string;
  full_name: string;
  role: UserRole;
  logged_in: boolean;
  email: string;
  student_id?: number;
  teacher_id?: number;
}

export interface Course {
  course_id: number;
  course_name: string;
  department: string;
  duration: string;
}

export interface Subject {
  subject_id: number;
  subject_code: string;
  subject_name: string;
  course_id: number;
  course_name?: string;
  branch: string;
  semester: number;
  teacher_id: number;
  teacher_name?: string;
}

export interface Teacher {
  teacher_id: number;
  user_id?: number;
  name: string;
  email: string;
  mobile: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive';
}

export interface Student {
  student_id: number;
  user_id?: number;
  roll_number: string;
  enrollment_number: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  mobile: string;
  address: string;
  course_id: number;
  course_name: string;
  branch: string;
  semester: number;
  batch: string;
  admission_date: string;
  status: 'Active' | 'Inactive';
}

export interface AttendanceRecord {
  attendance_id: number;
  student_id: number;
  subject_id: number;
  teacher_id: number;
  attendance_date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent';
  created_at: string;
}

export interface AttendanceReportItem {
  student_id: number;
  student_name: string;
  roll_number: string;
  course_name: string;
  subject_id: number;
  subject_name: string;
  total_classes: number;
  present_classes: number;
  absent_classes: number;
  percentage: number;
  status_category: 'Good' | 'Warning' | 'Critical';
}

export interface SupportRequest {
  request_id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  created_at: string;
}

export interface AnalyticsSummary {
  total_students: number;
  total_teachers: number;
  total_courses: number;
  total_subjects: number;
  today_present: number;
  today_absent: number;
  avg_attendance: number;
  low_attendance_count: number;
}

export interface SupportMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  created_at: string;
}

export type QueryCategory = 
  | 'Attendance Correction'
  | 'Subject / Syllabus Doubt'
  | 'Medical Leave / Absence'
  | 'Classroom / Lab Issue'
  | 'Exam & Marks Dispute'
  | 'Timetable Clash'
  | 'General Grievance';

export type QueryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type QueryStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface QueryReply {
  reply_id: number;
  author_name: string;
  author_role: UserRole;
  author_id?: number;
  message: string;
  created_at: string;
}

export interface AcademicQuery {
  query_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: UserRole; // 'student' | 'teacher' | 'admin'
  sender_detail?: string; // Roll No or Designation
  sender_email: string;
  category: QueryCategory;
  priority: QueryPriority;
  subject_code?: string;
  title: string;
  description: string;
  status: QueryStatus;
  assigned_to: 'Teacher' | 'Admin' | 'HOD';
  target_teacher_id?: number;
  target_teacher_name?: string;
  created_at: string;
  updated_at: string;
  resolution_remarks?: string;
  resolved_by?: string;
  resolved_at?: string;
  replies: QueryReply[];
}

export interface SystemNotification {
  notification_id: number;
  target_role?: UserRole | 'all';
  target_user_id?: number;
  title: string;
  message: string;
  query_id?: number;
  read: boolean;
  type: 'query_created' | 'query_resolved' | 'query_reply' | 'general';
  created_at: string;
}
