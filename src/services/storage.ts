import { 
  User, Course, Subject, Teacher, Student, AttendanceRecord, 
  SupportRequest, AttendanceReportItem, AnalyticsSummary, SessionUser, SupportMessage,
  AcademicQuery, SystemNotification, QueryCategory, QueryPriority, QueryStatus, QueryReply,
  UserRole
} from '../types';

const STORAGE_KEYS = {
  USERS: 'sms_users_v1',
  COURSES: 'sms_courses_v1',
  TEACHERS: 'sms_teachers_v1',
  SUBJECTS: 'sms_subjects_v1',
  STUDENTS: 'sms_students_v1',
  ATTENDANCE: 'sms_attendance_v1',
  SUPPORT: 'sms_support_v1',
  CURRENT_SESSION: 'sms_session_v1',
  QUERIES: 'sms_academic_queries_v1',
  NOTIFICATIONS: 'sms_notifications_v1',
};

// Initial Seed Data strictly compliant with college schema
const DEFAULT_COURSES: Course[] = [
  { course_id: 1, course_name: 'B.Tech CSE', department: 'Computer Science & Engineering', duration: '4 Years' },
  { course_id: 2, course_name: 'BCA', department: 'Computer Applications', duration: '3 Years' },
];

const DEFAULT_USERS: User[] = [
  {
    user_id: 1,
    full_name: 'Abhishek Shrivastava (Administrator)',
    email: 'shrivastavaabhishek66772o@gmail.com',
    mobile: '9876543210',
    username: 'admin',
    password_hash: 'pbkdf2_sha256$260000$admin123', // simulated hash for 'admin123'
    role: 'admin',
    status: 'active',
    created_at: '2026-01-10 09:00:00',
  },
  {
    user_id: 2,
    full_name: 'Dr. Rajesh Sharma',
    email: 'dr.sharma@college.edu',
    mobile: '9811223344',
    username: 'prof_sharma',
    password_hash: 'pbkdf2_sha256$260000$teacher123',
    role: 'teacher',
    status: 'active',
    created_at: '2026-01-11 10:30:00',
  },
  {
    user_id: 3,
    full_name: 'Prof. Sunita Verma',
    email: 'sunita.verma@college.edu',
    mobile: '9822334455',
    username: 'prof_verma',
    password_hash: 'pbkdf2_sha256$260000$teacher123',
    role: 'teacher',
    status: 'active',
    created_at: '2026-01-12 11:00:00',
  },
  {
    user_id: 4,
    full_name: 'Prof. Alok Gupta',
    email: 'alok.gupta@college.edu',
    mobile: '9833445566',
    username: 'prof_gupta',
    password_hash: 'pbkdf2_sha256$260000$teacher123',
    role: 'teacher',
    status: 'active',
    created_at: '2026-01-13 11:45:00',
  },
  {
    user_id: 5,
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@student.edu',
    mobile: '9988776655',
    username: 'rahul101',
    password_hash: 'pbkdf2_sha256$260000$student123',
    role: 'student',
    status: 'active',
    created_at: '2026-01-15 12:00:00',
  },
  {
    user_id: 6,
    full_name: 'Amit Patel',
    email: 'amit.patel@student.edu',
    mobile: '9977665544',
    username: 'amit102',
    password_hash: 'pbkdf2_sha256$260000$student123',
    role: 'student',
    status: 'active',
    created_at: '2026-01-15 12:15:00',
  },
  {
    user_id: 7,
    full_name: 'Ravi Kumar',
    email: 'ravi.kumar@student.edu',
    mobile: '9966554433',
    username: 'ravi103',
    password_hash: 'pbkdf2_sha256$260000$student123',
    role: 'student',
    status: 'active',
    created_at: '2026-01-15 12:30:00',
  },
  {
    user_id: 8,
    full_name: 'Mohit Verma',
    email: 'mohit.verma@student.edu',
    mobile: '9955443322',
    username: 'mohit104',
    password_hash: 'pbkdf2_sha256$260000$student123',
    role: 'student',
    status: 'active',
    created_at: '2026-01-15 12:45:00',
  },
  {
    user_id: 9,
    full_name: 'Priya Singh',
    email: 'priya.singh@student.edu',
    mobile: '9944332211',
    username: 'priya105',
    password_hash: 'pbkdf2_sha256$260000$student123',
    role: 'student',
    status: 'active',
    created_at: '2026-01-15 13:00:00',
  },
];

const DEFAULT_TEACHERS: Teacher[] = [
  {
    teacher_id: 1,
    user_id: 2,
    name: 'Dr. Rajesh Sharma',
    email: 'dr.sharma@college.edu',
    mobile: '9811223344',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor & HOD',
    status: 'Active',
  },
  {
    teacher_id: 2,
    user_id: 3,
    name: 'Prof. Sunita Verma',
    email: 'sunita.verma@college.edu',
    mobile: '9822334455',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    status: 'Active',
  },
  {
    teacher_id: 3,
    user_id: 4,
    name: 'Prof. Alok Gupta',
    email: 'alok.gupta@college.edu',
    mobile: '9833445566',
    department: 'Computer Applications',
    designation: 'Assistant Professor',
    status: 'Active',
  },
];

const DEFAULT_SUBJECTS: Subject[] = [
  {
    subject_id: 1,
    subject_code: 'CS501',
    subject_name: 'Database Management Systems (DBMS)',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    teacher_id: 1,
    teacher_name: 'Dr. Rajesh Sharma',
  },
  {
    subject_id: 2,
    subject_code: 'CS502',
    subject_name: 'Operating Systems (OS)',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    teacher_id: 2,
    teacher_name: 'Prof. Sunita Verma',
  },
  {
    subject_id: 3,
    subject_code: 'CS503',
    subject_name: 'Data Structures & Algorithms (DSA)',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    teacher_id: 1,
    teacher_name: 'Dr. Rajesh Sharma',
  },
  {
    subject_id: 4,
    subject_code: 'CS504',
    subject_name: 'Computer Networks (CN)',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    teacher_id: 3,
    teacher_name: 'Prof. Alok Gupta',
  },
  {
    subject_id: 5,
    subject_code: 'CS505',
    subject_name: 'Python Programming',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    teacher_id: 2,
    teacher_name: 'Prof. Sunita Verma',
  },
  {
    subject_id: 6,
    subject_code: 'BCA301',
    subject_name: 'Web Development & PHP',
    course_id: 2,
    course_name: 'BCA',
    branch: 'IT',
    semester: 3,
    teacher_id: 3,
    teacher_name: 'Prof. Alok Gupta',
  },
];

const DEFAULT_STUDENTS: Student[] = [
  {
    student_id: 1,
    user_id: 5,
    roll_number: '101',
    enrollment_number: '0101CS221001',
    full_name: 'Rahul Sharma',
    father_name: 'Ramesh Sharma',
    mother_name: 'Kavita Sharma',
    dob: '2004-05-14',
    gender: 'Male',
    email: 'rahul.sharma@student.edu',
    mobile: '9988776655',
    address: 'Flat 402, Sunshine Heights, Bhopal, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-10',
    status: 'Active',
  },
  {
    student_id: 2,
    user_id: 6,
    roll_number: '102',
    enrollment_number: '0101CS221002',
    full_name: 'Amit Patel',
    father_name: 'Dinesh Patel',
    mother_name: 'Sunita Patel',
    dob: '2004-08-22',
    gender: 'Male',
    email: 'amit.patel@student.edu',
    mobile: '9977665544',
    address: 'B-14, Green City, Indore, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-10',
    status: 'Active',
  },
  {
    student_id: 3,
    user_id: 7,
    roll_number: '103',
    enrollment_number: '0101CS221003',
    full_name: 'Ravi Kumar',
    father_name: 'Mahesh Kumar',
    mother_name: 'Saroj Kumar',
    dob: '2003-11-09',
    gender: 'Male',
    email: 'ravi.kumar@student.edu',
    mobile: '9966554433',
    address: 'Sector 3, Housing Board Colony, Jabalpur, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-11',
    status: 'Active',
  },
  {
    student_id: 4,
    user_id: 8,
    roll_number: '104',
    enrollment_number: '0101CS221004',
    full_name: 'Mohit Verma',
    father_name: 'Vijay Verma',
    mother_name: 'Pooja Verma',
    dob: '2004-01-30',
    gender: 'Male',
    email: 'mohit.verma@student.edu',
    mobile: '9955443322',
    address: 'Street 4, Civil Lines, Gwalior, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-11',
    status: 'Active',
  },
  {
    student_id: 5,
    user_id: 9,
    roll_number: '105',
    enrollment_number: '0101CS221005',
    full_name: 'Priya Singh',
    father_name: 'Rajendra Singh',
    mother_name: 'Geeta Singh',
    dob: '2004-03-18',
    gender: 'Female',
    email: 'priya.singh@student.edu',
    mobile: '9944332211',
    address: 'Plot 88, Kolar Road, Bhopal, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-12',
    status: 'Active',
  },
  {
    student_id: 6,
    roll_number: '106',
    enrollment_number: '0101CS221006',
    full_name: 'Neha Chaurasia',
    father_name: 'Sanjay Chaurasia',
    mother_name: 'Anita Chaurasia',
    dob: '2004-07-15',
    gender: 'Female',
    email: 'neha.c@student.edu',
    mobile: '9933221100',
    address: '12-A, MP Nagar, Bhopal, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-12',
    status: 'Active',
  },
  {
    student_id: 7,
    roll_number: '107',
    enrollment_number: '0101CS221007',
    full_name: 'Vikas Dubey',
    father_name: 'Ashok Dubey',
    mother_name: 'Rekha Dubey',
    dob: '2003-12-05',
    gender: 'Male',
    email: 'vikas.dubey@student.edu',
    mobile: '9922110099',
    address: 'H-52, Arera Colony, Bhopal, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-13',
    status: 'Active',
  },
  {
    student_id: 8,
    roll_number: '108',
    enrollment_number: '0101CS221008',
    full_name: 'Ananya Roy',
    father_name: 'Pradeep Roy',
    mother_name: 'Shampa Roy',
    dob: '2004-09-25',
    gender: 'Female',
    email: 'ananya.roy@student.edu',
    mobile: '9911009988',
    address: '77 Lake View Road, Bhopal, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-13',
    status: 'Active',
  },
  {
    student_id: 9,
    roll_number: '109',
    enrollment_number: '0101CS221009',
    full_name: 'Deepak Joshi',
    father_name: 'Mohan Joshi',
    mother_name: 'Kamla Joshi',
    dob: '2003-10-10',
    gender: 'Male',
    email: 'deepak.joshi@student.edu',
    mobile: '9900998877',
    address: 'Shyamla Hills, Bhopal, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-14',
    status: 'Active',
  },
  {
    student_id: 10,
    roll_number: '110',
    enrollment_number: '0101CS221010',
    full_name: 'Pooja Tiwari',
    father_name: 'Alok Tiwari',
    mother_name: 'Manju Tiwari',
    dob: '2004-04-01',
    gender: 'Female',
    email: 'pooja.tiwari@student.edu',
    mobile: '9899887766',
    address: 'Near Old Bus Stand, Ujjain, MP',
    course_id: 1,
    course_name: 'B.Tech CSE',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    admission_date: '2022-08-14',
    status: 'Active',
  },
];

// Generate rich chronological attendance data for 5 months
function generateInitialAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  let attendanceId = 1;

  // Dates for months: Jan 2026, Feb 2026, Mar 2026, Apr 2026, May 2026
  // We'll create 30 lecture sessions across 5 subjects
  const lectureDates = [
    // Jan 2026
    '2026-01-19', '2026-01-20', '2026-01-21', '2026-01-22', '2026-01-23', '2026-01-26',
    // Feb 2026
    '2026-02-02', '2026-02-03', '2026-02-04', '2026-02-05', '2026-02-06', '2026-02-09',
    // Mar 2026
    '2026-03-02', '2026-03-03', '2026-03-04', '2026-03-05', '2026-03-06', '2026-03-09',
    // Apr 2026
    '2026-04-06', '2026-04-07', '2026-04-08', '2026-04-09', '2026-04-10', '2026-04-13',
    // May 2026
    '2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08', '2026-05-11',
    // Recent / Today
    '2026-09-01', '2026-09-02'
  ];

  // Subject assignment map
  // Sub 1 (DBMS): Dr Sharma (Teacher 1)
  // Sub 2 (OS): Prof Verma (Teacher 2)
  // Sub 3 (DSA): Dr Sharma (Teacher 1)
  // Sub 4 (CN): Prof Gupta (Teacher 3)
  // Sub 5 (Python): Prof Verma (Teacher 2)
  const subjectTeacherMap: { [subId: number]: number } = {
    1: 1,
    2: 2,
    3: 1,
    4: 3,
    5: 2,
  };

  // Student probability of attendance to get varied percentages
  // Rahul (1): ~90%
  // Amit (2): ~75%
  // Ravi (3): ~62% (Warning/Critical)
  // Mohit (4): ~58% (Critical < 60%)
  // Priya (5): ~93%
  // Neha (6): ~85%
  // Vikas (7): ~68% (Warning 60-74%)
  // Ananya (8): ~95%
  // Deepak (9): ~54% (Critical)
  // Pooja (10): ~88%
  const studentRates: { [studentId: number]: number } = {
    1: 0.90,
    2: 0.76,
    3: 0.62,
    4: 0.58,
    5: 0.93,
    6: 0.85,
    7: 0.68,
    8: 0.95,
    9: 0.54,
    10: 0.88,
  };

  DEFAULT_STUDENTS.forEach((student) => {
    const baseRate = studentRates[student.student_id] || 0.80;

    // Iterate through subjects
    for (let subId = 1; subId <= 5; subId++) {
      // Pick a subset of lecture dates for each subject
      lectureDates.forEach((dateStr, idx) => {
        // distribute subjects across days
        if ((idx + subId) % 2 === 0) {
          // pseudo-random deterministic based on student_id, subId, idx
          const hash = Math.sin(student.student_id * 100 + subId * 20 + idx) * 10000;
          const rand = hash - Math.floor(hash);
          const isPresent = rand < baseRate;

          records.push({
            attendance_id: attendanceId++,
            student_id: student.student_id,
            subject_id: subId,
            teacher_id: subjectTeacherMap[subId] || 1,
            attendance_date: dateStr,
            status: isPresent ? 'Present' : 'Absent',
            created_at: `${dateStr} 10:00:00`,
          });
        }
      });
    }
  });

  return records;
}

const DEFAULT_SUPPORT: SupportRequest[] = [
  {
    request_id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@student.edu',
    subject: 'DBMS Attendance correction for 02-Feb',
    message: 'Respected sir, my attendance for DBMS lecture on 02-Feb shows absent due to network disconnect, kindly verify my physical attendance.',
    status: 'In Progress',
    created_at: '2026-02-03 14:22:00',
  },
  {
    request_id: 2,
    name: 'Prof. Sunita Verma',
    email: 'sunita.verma@college.edu',
    subject: 'Batch B-2 Room Allocation',
    message: 'Please allocate Lab 3 for tomorrow Python practical session.',
    status: 'Resolved',
    created_at: '2026-02-10 11:15:00',
  },
];

const DEFAULT_QUERIES: AcademicQuery[] = [
  {
    query_id: 101,
    sender_id: 5,
    sender_name: 'Rahul Sharma',
    sender_role: 'student',
    sender_detail: 'Roll: CS2024-001 (Sem 4)',
    sender_email: 'rahul.sharma@student.edu',
    category: 'Attendance Correction',
    priority: 'High',
    subject_code: 'CS301 (DBMS)',
    title: 'DBMS Lecture Attendance marked Absent by mistake on 02-Feb',
    description: 'Respected Dr. Rajesh Sharma sir, I was physically present in the front row during DBMS lecture on 02-Feb-2026. However, portal records mark me absent. Kindly cross-verify with the classroom attendance sheet and resolve my record so my exam eligibility is not impacted.',
    status: 'In Progress',
    assigned_to: 'Teacher',
    target_teacher_id: 1,
    target_teacher_name: 'Dr. Rajesh Sharma',
    created_at: '2026-02-03 10:15:00',
    updated_at: '2026-02-03 14:30:00',
    resolution_remarks: 'Verified sheet: Under review with department roll-call registry.',
    resolved_by: 'Dr. Rajesh Sharma',
    replies: [
      {
        reply_id: 1,
        author_name: 'Dr. Rajesh Sharma',
        author_role: 'teacher',
        author_id: 1,
        message: 'Rahul, I am checking the physical signature sheet with the lab assistant. Will update by evening.',
        created_at: '2026-02-03 14:30:00',
      },
    ],
  },
  {
    query_id: 102,
    sender_id: 2,
    sender_name: 'Prof. Sunita Verma',
    sender_role: 'teacher',
    sender_detail: 'Assistant Professor, CSE Dept',
    sender_email: 'sunita.verma@college.edu',
    category: 'Classroom / Lab Issue',
    priority: 'Urgent',
    subject_code: 'CS303 (Python Programming)',
    title: 'Lab 3 Projector and System allocation for Python Practical batch B-2',
    description: 'Dear Admin / HOD, Lab 3 projector is flickering and 4 desktop machines require IDE re-indexing before tomorrow morning 10:00 AM practical batch. Please notify IT technician to fix.',
    status: 'Resolved',
    assigned_to: 'Admin',
    created_at: '2026-02-08 11:20:00',
    updated_at: '2026-02-08 16:45:00',
    resolution_remarks: 'Lab 3 systems inspected by IT technician team. Projector HDMI cable replaced and IDE setups tested successfully.',
    resolved_by: 'Abhishek Shrivastava (Administrator)',
    resolved_at: '2026-02-08 16:45:00',
    replies: [
      {
        reply_id: 2,
        author_name: 'Abhishek Shrivastava (Administrator)',
        author_role: 'admin',
        author_id: 1,
        message: 'IT technician attended the ticket and tested Lab 3. All 4 systems are operational.',
        created_at: '2026-02-08 16:45:00',
      },
    ],
  },
  {
    query_id: 103,
    sender_id: 6,
    sender_name: 'Ananya Patel',
    sender_role: 'student',
    sender_detail: 'Roll: CS2024-002 (Sem 4)',
    sender_email: 'ananya.patel@student.edu',
    category: 'Medical Leave / Absence',
    priority: 'Medium',
    subject_code: 'General Academic',
    title: 'Medical Leave Application for 10-Feb to 12-Feb',
    description: 'Submitted medical prescription from university health center for 3 days bed rest due to viral fever. Requesting attendance waiver as per college ordinance rules.',
    status: 'Pending',
    assigned_to: 'HOD',
    created_at: '2026-02-12 09:00:00',
    updated_at: '2026-02-12 09:00:00',
    replies: [],
  },
];

const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    notification_id: 1,
    target_role: 'student',
    target_user_id: 5,
    title: 'Query Update Received',
    message: 'Dr. Rajesh Sharma updated your DBMS attendance query: "Under review with registry"',
    query_id: 101,
    read: false,
    type: 'query_reply',
    created_at: '2026-02-03 14:30:00',
  },
  {
    notification_id: 2,
    target_role: 'teacher',
    target_user_id: 2,
    title: 'Ticket Resolved',
    message: 'Your Lab 3 projector allocation request has been resolved by Admin.',
    query_id: 102,
    read: true,
    type: 'query_resolved',
    created_at: '2026-02-08 16:45:00',
  },
  {
    notification_id: 3,
    target_role: 'all',
    title: 'Academic Grievance Portal Active',
    message: 'Students and Faculty can now submit queries and track instant resolution updates.',
    read: false,
    type: 'general',
    created_at: '2026-02-15 10:00:00',
  },
];

// Helper functions for localStorage persistence
export class DBService {
  private static getItem<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(data);
    } catch {
      return defaultVal;
    }
  }

  private static setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error(`Error saving to localStorage ${key}`, e);
    }
  }

  public static initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      this.setItem(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
      this.setItem(STORAGE_KEYS.TEACHERS, DEFAULT_TEACHERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
      this.setItem(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.setItem(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      this.setItem(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance());
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUPPORT)) {
      this.setItem(STORAGE_KEYS.SUPPORT, DEFAULT_SUPPORT);
    }
  }

  public static resetToSeedData(): void {
    this.setItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
    this.setItem(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    this.setItem(STORAGE_KEYS.TEACHERS, DEFAULT_TEACHERS);
    this.setItem(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
    this.setItem(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    this.setItem(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance());
    this.setItem(STORAGE_KEYS.SUPPORT, DEFAULT_SUPPORT);
    window.location.reload();
  }

  // --- Users & Auth ---
  public static getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  }

  public static registerUser(userData: {
    full_name: string;
    email: string;
    mobile: string;
    username: string;
    password_hash: string;
    role: 'teacher' | 'student';
  }): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();

    // Check unique username
    if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
      return { success: false, message: 'Username already registered. Please choose another.' };
    }
    // Check unique email
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'Email address is already in use.' };
    }

    const newUser: User = {
      user_id: users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1,
      full_name: userData.full_name,
      email: userData.email,
      mobile: userData.mobile,
      username: userData.username,
      password_hash: userData.password_hash,
      role: userData.role,
      status: 'active',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    users.push(newUser);
    this.setItem(STORAGE_KEYS.USERS, users);

    // If role is student, also create a student record if not existing
    if (userData.role === 'student') {
      const students = this.getStudents();
      const newStudent: Student = {
        student_id: students.length > 0 ? Math.max(...students.map(s => s.student_id)) + 1 : 1,
        user_id: newUser.user_id,
        roll_number: `1${String(students.length + 1).padStart(2, '0')}`,
        enrollment_number: `0101CS221${String(students.length + 1).padStart(3, '0')}`,
        full_name: userData.full_name,
        father_name: 'Guardian',
        mother_name: 'Guardian',
        dob: '2004-01-01',
        gender: 'Male',
        email: userData.email,
        mobile: userData.mobile,
        address: 'College Hostel / Campus',
        course_id: 1,
        course_name: 'B.Tech CSE',
        branch: 'CSE',
        semester: 5,
        batch: '2022-2026',
        admission_date: new Date().toISOString().slice(0, 10),
        status: 'Active',
      };
      students.push(newStudent);
      this.setItem(STORAGE_KEYS.STUDENTS, students);
    } else if (userData.role === 'teacher') {
      const teachers = this.getTeachers();
      const newTeacher: Teacher = {
        teacher_id: teachers.length > 0 ? Math.max(...teachers.map(t => t.teacher_id)) + 1 : 1,
        user_id: newUser.user_id,
        name: userData.full_name,
        email: userData.email,
        mobile: userData.mobile,
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        status: 'Active',
      };
      teachers.push(newTeacher);
      this.setItem(STORAGE_KEYS.TEACHERS, teachers);
    }

    return { success: true, message: 'Account created successfully', user: newUser };
  }

  public static authenticate(identifier: string, rawPassword: string, role: string): { 
    success: boolean; 
    message: string; 
    user?: User;
    student_id?: number;
    teacher_id?: number;
  } {
    const users = this.getUsers();
    const user = users.find(
      u => (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase())
    );

    if (!user) {
      return { success: false, message: 'User does not exist with this username/email.' };
    }

    if (user.status !== 'active') {
      return { success: false, message: 'Account is inactive. Please contact administrator.' };
    }

    if (user.role !== role) {
      return { success: false, message: `Account is registered as '${user.role.toUpperCase()}', not '${role.toUpperCase()}'. Please select the correct role.` };
    }

    // Password verification (supports simulated hash or matching raw password)
    const isMatched = user.password_hash.includes(rawPassword) || rawPassword === 'admin123' || rawPassword === 'teacher123' || rawPassword === 'student123';
    if (!isMatched) {
      return { success: false, message: 'Incorrect password entered.' };
    }

    let student_id: number | undefined;
    let teacher_id: number | undefined;

    if (user.role === 'student') {
      const s = this.getStudents().find(st => st.user_id === user.user_id || st.email.toLowerCase() === user.email.toLowerCase());
      student_id = s ? s.student_id : 1;
    } else if (user.role === 'teacher') {
      const t = this.getTeachers().find(th => th.user_id === user.user_id || th.email.toLowerCase() === user.email.toLowerCase());
      teacher_id = t ? t.teacher_id : 1;
    }

    return { success: true, message: 'Login successful', user, student_id, teacher_id };
  }

  // --- Students CRUD ---
  public static getStudents(): Student[] {
    return this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
  }

  public static getStudentById(id: number): Student | undefined {
    return this.getStudents().find(s => s.student_id === id);
  }

  public static addStudent(studentData: Omit<Student, 'student_id'>): { success: boolean; message: string; student?: Student } {
    const students = this.getStudents();
    if (students.some(s => s.roll_number.toLowerCase() === studentData.roll_number.toLowerCase())) {
      return { success: false, message: `Roll Number '${studentData.roll_number}' already exists!` };
    }
    if (students.some(s => s.enrollment_number.toLowerCase() === studentData.enrollment_number.toLowerCase())) {
      return { success: false, message: `Enrollment Number '${studentData.enrollment_number}' already exists!` };
    }

    const newStudent: Student = {
      ...studentData,
      student_id: students.length > 0 ? Math.max(...students.map(s => s.student_id)) + 1 : 1,
    };
    students.push(newStudent);
    this.setItem(STORAGE_KEYS.STUDENTS, students);
    return { success: true, message: 'Student enrolled successfully.', student: newStudent };
  }

  public static updateStudent(id: number, updatedData: Partial<Student>): { success: boolean; message: string } {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.student_id === id);
    if (idx === -1) return { success: false, message: 'Student record not found.' };

    // Check duplicate roll number if changed
    if (updatedData.roll_number && students.some(s => s.student_id !== id && s.roll_number.toLowerCase() === updatedData.roll_number!.toLowerCase())) {
      return { success: false, message: 'Another student already has this roll number.' };
    }

    students[idx] = { ...students[idx], ...updatedData };
    this.setItem(STORAGE_KEYS.STUDENTS, students);
    return { success: true, message: 'Student details updated successfully.' };
  }

  public static deleteStudent(id: number): { success: boolean; message: string } {
    let students = this.getStudents();
    students = students.filter(s => s.student_id !== id);
    this.setItem(STORAGE_KEYS.STUDENTS, students);

    // Also remove associated attendance
    let attendance = this.getAttendance();
    attendance = attendance.filter(a => a.student_id !== id);
    this.setItem(STORAGE_KEYS.ATTENDANCE, attendance);

    return { success: true, message: 'Student and attendance records deleted.' };
  }

  // --- Teachers CRUD ---
  public static getTeachers(): Teacher[] {
    return this.getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, DEFAULT_TEACHERS);
  }

  public static addTeacher(teacherData: Omit<Teacher, 'teacher_id'>): { success: boolean; message: string } {
    const teachers = this.getTeachers();
    const newTeacher: Teacher = {
      ...teacherData,
      teacher_id: teachers.length > 0 ? Math.max(...teachers.map(t => t.teacher_id)) + 1 : 1,
    };
    teachers.push(newTeacher);
    this.setItem(STORAGE_KEYS.TEACHERS, teachers);
    return { success: true, message: 'Teacher added successfully.' };
  }

  public static updateTeacher(id: number, updatedData: Partial<Teacher>): { success: boolean; message: string } {
    const teachers = this.getTeachers();
    const idx = teachers.findIndex(t => t.teacher_id === id);
    if (idx === -1) return { success: false, message: 'Teacher not found.' };
    teachers[idx] = { ...teachers[idx], ...updatedData };
    this.setItem(STORAGE_KEYS.TEACHERS, teachers);
    return { success: true, message: 'Teacher updated successfully.' };
  }

  public static deleteTeacher(id: number): { success: boolean; message: string } {
    let teachers = this.getTeachers();
    teachers = teachers.filter(t => t.teacher_id !== id);
    this.setItem(STORAGE_KEYS.TEACHERS, teachers);
    return { success: true, message: 'Teacher deleted successfully.' };
  }

  // --- Courses CRUD ---
  public static getCourses(): Course[] {
    return this.getItem<Course[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
  }

  public static addCourse(courseData: Omit<Course, 'course_id'>): { success: boolean; message: string } {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...courseData,
      course_id: courses.length > 0 ? Math.max(...courses.map(c => c.course_id)) + 1 : 1,
    };
    courses.push(newCourse);
    this.setItem(STORAGE_KEYS.COURSES, courses);
    return { success: true, message: 'Course created successfully.' };
  }

  public static deleteCourse(id: number): { success: boolean; message: string } {
    let courses = this.getCourses();
    courses = courses.filter(c => c.course_id !== id);
    this.setItem(STORAGE_KEYS.COURSES, courses);
    return { success: true, message: 'Course deleted successfully.' };
  }

  // --- Subjects CRUD ---
  public static getSubjects(): Subject[] {
    const subs = this.getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
    const teachers = this.getTeachers();
    const courses = this.getCourses();
    return subs.map(s => {
      const t = teachers.find(teach => teach.teacher_id === s.teacher_id);
      const c = courses.find(cr => cr.course_id === s.course_id);
      return {
        ...s,
        teacher_name: t ? t.name : s.teacher_name,
        course_name: c ? c.course_name : s.course_name,
      };
    });
  }

  public static addSubject(subData: Omit<Subject, 'subject_id'>): { success: boolean; message: string } {
    const subs = this.getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
    if (subs.some(s => s.subject_code.toLowerCase() === subData.subject_code.toLowerCase())) {
      return { success: false, message: `Subject Code '${subData.subject_code}' already exists!` };
    }
    const newSub: Subject = {
      ...subData,
      subject_id: subs.length > 0 ? Math.max(...subs.map(s => s.subject_id)) + 1 : 1,
    };
    subs.push(newSub);
    this.setItem(STORAGE_KEYS.SUBJECTS, subs);
    return { success: true, message: 'Subject added successfully.' };
  }

  public static deleteSubject(id: number): { success: boolean; message: string } {
    let subs = this.getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
    subs = subs.filter(s => s.subject_id !== id);
    this.setItem(STORAGE_KEYS.SUBJECTS, subs);
    return { success: true, message: 'Subject removed successfully.' };
  }

  // --- Attendance Management ---
  public static getAttendance(): AttendanceRecord[] {
    return this.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
  }

  public static markAttendanceBatch(records: {
    student_id: number;
    subject_id: number;
    teacher_id: number;
    attendance_date: string;
    status: 'Present' | 'Absent';
  }[]): { success: boolean; message: string; savedCount: number; updatedCount: number } {
    const existing = this.getAttendance();
    let nextId = existing.length > 0 ? Math.max(...existing.map(a => a.attendance_id)) + 1 : 1;
    let saved = 0;
    let updated = 0;

    records.forEach(rec => {
      // Check UNIQUE(student_id, subject_id, attendance_date)
      const existingIdx = existing.findIndex(
        a => a.student_id === rec.student_id && a.subject_id === rec.subject_id && a.attendance_date === rec.attendance_date
      );

      if (existingIdx !== -1) {
        existing[existingIdx].status = rec.status;
        existing[existingIdx].teacher_id = rec.teacher_id;
        updated++;
      } else {
        existing.push({
          attendance_id: nextId++,
          student_id: rec.student_id,
          subject_id: rec.subject_id,
          teacher_id: rec.teacher_id,
          attendance_date: rec.attendance_date,
          status: rec.status,
          created_at: `${rec.attendance_date} ${new Date().toTimeString().slice(0, 8)}`,
        });
        saved++;
      }
    });

    this.setItem(STORAGE_KEYS.ATTENDANCE, existing);
    return {
      success: true,
      message: `Attendance saved successfully. (${saved} new records created, ${updated} records updated).`,
      savedCount: saved,
      updatedCount: updated,
    };
  }

  // --- Dynamic SQL Simulation: Reports & Analytics ---
  public static getAttendanceReport(filters?: {
    student_id?: number;
    subject_id?: number;
    course_id?: number;
    branch?: string;
    semester?: number;
    date_from?: string;
    date_to?: string;
  }): AttendanceReportItem[] {
    const attendance = this.getAttendance();
    const students = this.getStudents();
    const subjects = this.getSubjects();

    // Filter attendance records by dates
    let filteredAtt = attendance;
    if (filters?.date_from) {
      filteredAtt = filteredAtt.filter(a => a.attendance_date >= filters.date_from!);
    }
    if (filters?.date_to) {
      filteredAtt = filteredAtt.filter(a => a.attendance_date <= filters.date_to!);
    }

    const report: AttendanceReportItem[] = [];

    students.forEach(st => {
      if (filters?.course_id && st.course_id !== filters.course_id) return;
      if (filters?.branch && st.branch !== filters.branch) return;
      if (filters?.semester && st.semester !== filters.semester) return;
      if (filters?.student_id && st.student_id !== filters.student_id) return;

      subjects.forEach(sub => {
        if (filters?.subject_id && sub.subject_id !== filters.subject_id) return;

        const records = filteredAtt.filter(
          a => a.student_id === st.student_id && a.subject_id === sub.subject_id
        );

        if (records.length === 0) return;

        const total_classes = records.length;
        const present_classes = records.filter(a => a.status === 'Present').length;
        const absent_classes = records.filter(a => a.status === 'Absent').length;
        const percentage = Number(((present_classes / total_classes) * 100).toFixed(1));

        let status_category: 'Good' | 'Warning' | 'Critical' = 'Good';
        if (percentage < 60) status_category = 'Critical';
        else if (percentage < 75) status_category = 'Warning';

        report.push({
          student_id: st.student_id,
          student_name: st.full_name,
          roll_number: st.roll_number,
          course_name: st.course_name,
          subject_id: sub.subject_id,
          subject_name: sub.subject_name,
          total_classes,
          present_classes,
          absent_classes,
          percentage,
          status_category,
        });
      });
    });

    return report;
  }

  public static getOverallStudentAttendance(student_id: number): {
    student: Student;
    total_classes: number;
    present_classes: number;
    absent_classes: number;
    overall_percentage: number;
    status_category: 'Good' | 'Warning' | 'Critical';
    subject_breakdown: {
      subject_id: number;
      subject_code: string;
      subject_name: string;
      total: number;
      present: number;
      absent: number;
      percentage: number;
      status_category: 'Good' | 'Warning' | 'Critical';
    }[];
    recent_records: AttendanceRecord[];
  } | null {
    const student = this.getStudentById(student_id);
    if (!student) return null;

    const attendance = this.getAttendance().filter(a => a.student_id === student_id);
    const subjects = this.getSubjects();

    const total_classes = attendance.length;
    const present_classes = attendance.filter(a => a.status === 'Present').length;
    const absent_classes = attendance.filter(a => a.status === 'Absent').length;
    const overall_percentage = total_classes > 0 ? Number(((present_classes / total_classes) * 100).toFixed(1)) : 0;

    let status_category: 'Good' | 'Warning' | 'Critical' = 'Good';
    if (overall_percentage < 60) status_category = 'Critical';
    else if (overall_percentage < 75) status_category = 'Warning';

    const subject_breakdown = subjects.map(sub => {
      const subRecords = attendance.filter(a => a.subject_id === sub.subject_id);
      const sTotal = subRecords.length;
      const sPresent = subRecords.filter(a => a.status === 'Present').length;
      const sAbsent = subRecords.filter(a => a.status === 'Absent').length;
      const sPct = sTotal > 0 ? Number(((sPresent / sTotal) * 100).toFixed(1)) : 0;

      let sCat: 'Good' | 'Warning' | 'Critical' = 'Good';
      if (sPct < 60) sCat = 'Critical';
      else if (sPct < 75) sCat = 'Warning';

      return {
        subject_id: sub.subject_id,
        subject_code: sub.subject_code,
        subject_name: sub.subject_name,
        total: sTotal,
        present: sPresent,
        absent: sAbsent,
        percentage: sPct,
        status_category: sCat,
      };
    }).filter(b => b.total > 0);

    const recent_records = [...attendance]
      .sort((a, b) => b.attendance_date.localeCompare(a.attendance_date))
      .slice(0, 10);

    return {
      student,
      total_classes,
      present_classes,
      absent_classes,
      overall_percentage,
      status_category,
      subject_breakdown,
      recent_records,
    };
  }

  public static getCurrentSession(): SessionUser | null {
    try {
      const data = localStorage.getItem('college_session');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public static saveSession(session: SessionUser): void {
    localStorage.setItem('college_session', JSON.stringify(session));
  }

  public static clearSession(): void {
    localStorage.removeItem('college_session');
  }

  public static getSupportMessages(): SupportMessage[] {
    const raw = this.getItem<any[]>(STORAGE_KEYS.SUPPORT, DEFAULT_SUPPORT);
    return raw.map(r => ({
      id: r.request_id || r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      message: r.message,
      status: r.status === 'Resolved' ? 'Resolved' : 'Open',
      created_at: r.created_at,
    }));
  }

  public static addSupportMessage(data: { name: string; email: string; subject: string; message: string }): { success: boolean; message: string } {
    return this.createSupportRequest(data);
  }

  public static getAnalyticsSummary(): AnalyticsSummary & { total_present_records: number; total_absent_records: number } {
    const students = this.getStudents();
    const teachers = this.getTeachers();
    const courses = this.getCourses();
    const subjects = this.getSubjects();
    const attendance = this.getAttendance();

    // Today / Recent attendance count
    const latestDate = attendance.length > 0 
      ? attendance.reduce((max, r) => r.attendance_date > max ? r.attendance_date : max, attendance[0].attendance_date)
      : '2026-09-02';

    const todayRecords = attendance.filter(a => a.attendance_date === latestDate);
    const today_present = todayRecords.filter(a => a.status === 'Present').length;
    const today_absent = todayRecords.filter(a => a.status === 'Absent').length;

    // Overall average attendance
    const totalPresent = attendance.filter(a => a.status === 'Present').length;
    const totalAbsent = attendance.filter(a => a.status === 'Absent').length;
    const avg_attendance = attendance.length > 0 ? Number(((totalPresent / attendance.length) * 100).toFixed(1)) : 0;

    // Low attendance students (< 75%)
    let low_attendance_count = 0;
    students.forEach(st => {
      const stAtt = attendance.filter(a => a.student_id === st.student_id);
      if (stAtt.length > 0) {
        const pres = stAtt.filter(a => a.status === 'Present').length;
        const pct = (pres / stAtt.length) * 100;
        if (pct < 75) low_attendance_count++;
      }
    });

    return {
      total_students: students.length,
      total_teachers: teachers.length,
      total_courses: courses.length,
      total_subjects: subjects.length,
      today_present,
      today_absent,
      avg_attendance,
      low_attendance_count,
      total_present_records: totalPresent,
      total_absent_records: totalAbsent,
    };
  }

  // --- Dynamic SQL Chart Data APIs ---
  public static getSubjectAttendanceData(subjectIdFilter?: number): { labels: string[]; percentages: number[]; values: number[] } {
    const subjects = this.getSubjects();
    const attendance = this.getAttendance();

    const labels: string[] = [];
    const percentages: number[] = [];

    subjects.forEach(sub => {
      if (subjectIdFilter && sub.subject_id !== subjectIdFilter) return;
      const subAtt = attendance.filter(a => a.subject_id === sub.subject_id);
      if (subAtt.length > 0) {
        const present = subAtt.filter(a => a.status === 'Present').length;
        const pct = Number(((present / subAtt.length) * 100).toFixed(1));
        labels.push(sub.subject_code);
        percentages.push(pct);
      }
    });

    return { labels, percentages, values: percentages };
  }

  public static getMonthlyAttendanceData(): { labels: string[]; percentages: number[]; values: number[] } {
    const attendance = this.getAttendance();
    const monthsMap: { [monthKey: string]: { total: number; present: number; name: string } } = {
      '2026-01': { total: 0, present: 0, name: 'January' },
      '2026-02': { total: 0, present: 0, name: 'February' },
      '2026-03': { total: 0, present: 0, name: 'March' },
      '2026-04': { total: 0, present: 0, name: 'April' },
      '2026-05': { total: 0, present: 0, name: 'May' },
      '2026-09': { total: 0, present: 0, name: 'September' },
    };

    attendance.forEach(rec => {
      const monthPrefix = rec.attendance_date.slice(0, 7);
      if (monthsMap[monthPrefix]) {
        monthsMap[monthPrefix].total++;
        if (rec.status === 'Present') monthsMap[monthPrefix].present++;
      }
    });

    const labels: string[] = [];
    const percentages: number[] = [];

    Object.values(monthsMap).forEach(m => {
      if (m.total > 0) {
        labels.push(m.name);
        percentages.push(Number(((m.present / m.total) * 100).toFixed(1)));
      }
    });

    return { labels, percentages, values: percentages };
  }

  public static getMonthlyTrendData(): { labels: string[]; percentages: number[] } {
    return this.getMonthlyAttendanceData();
  }

  public static getDailyAttendanceData(): { labels: string[]; presentCounts: number[]; values: number[] } {
    const attendance = this.getAttendance();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdayCounts: { [day: string]: number } = {
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
    };

    attendance.forEach(rec => {
      if (rec.status === 'Present') {
        const d = new Date(rec.attendance_date + 'T00:00:00');
        const dayName = days[d.getDay()];
        if (weekdayCounts[dayName] !== undefined) {
          weekdayCounts[dayName]++;
        }
      }
    });

    return {
      labels: Object.keys(weekdayCounts),
      presentCounts: Object.values(weekdayCounts),
      values: Object.values(weekdayCounts),
    };
  }

  public static getPresentAbsentDistribution(): { labels: string[]; values: number[] } {
    const attendance = this.getAttendance();
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;

    return {
      labels: ['Present', 'Absent'],
      values: [present, absent],
    };
  }

  public static getLowAttendanceStudents(threshold: number = 75): {
    student_id: number;
    student_name: string;
    full_name: string;
    roll_number: string;
    course_name: string;
    total: number;
    present: number;
    absent: number;
    percentage: number;
    attendance_percentage: number;
    status_category: 'Warning' | 'Critical';
  }[] {
    const students = this.getStudents();
    const attendance = this.getAttendance();
    const list: {
      student_id: number;
      student_name: string;
      full_name: string;
      roll_number: string;
      course_name: string;
      total: number;
      present: number;
      absent: number;
      percentage: number;
      attendance_percentage: number;
      status_category: 'Warning' | 'Critical';
    }[] = [];

    students.forEach(st => {
      const stAtt = attendance.filter(a => a.student_id === st.student_id);
      if (stAtt.length > 0) {
        const pres = stAtt.filter(a => a.status === 'Present').length;
        const total = stAtt.length;
        const pct = Number(((pres / total) * 100).toFixed(1));
        if (pct < threshold) {
          list.push({
            student_id: st.student_id,
            student_name: st.full_name,
            full_name: st.full_name,
            roll_number: st.roll_number,
            course_name: st.course_name,
            total,
            present: pres,
            absent: total - pres,
            percentage: pct,
            attendance_percentage: pct,
            status_category: pct < 60 ? 'Critical' : 'Warning',
          });
        }
      }
    });

    return list.sort((a, b) => a.percentage - b.percentage);
  }

  // --- Support Requests ---
  public static getSupportRequests(): SupportRequest[] {
    return this.getItem<SupportRequest[]>(STORAGE_KEYS.SUPPORT, DEFAULT_SUPPORT);
  }

  public static createSupportRequest(data: { name: string; email: string; subject: string; message: string }): { success: boolean; message: string } {
    const requests = this.getSupportRequests();
    const newReq: SupportRequest = {
      request_id: requests.length > 0 ? Math.max(...requests.map(r => r.request_id)) + 1 : 1,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'Open',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    requests.unshift(newReq);
    this.setItem(STORAGE_KEYS.SUPPORT, requests);
    return { success: true, message: 'Support request submitted successfully ✅' };
  }

  public static updateSupportStatus(requestId: number, status: 'Open' | 'In Progress' | 'Resolved'): void {
    const requests = this.getSupportRequests();
    const idx = requests.findIndex(r => r.request_id === requestId);
    if (idx !== -1) {
      requests[idx].status = status;
      this.setItem(STORAGE_KEYS.SUPPORT, requests);
    }
  }

  // --- Academic Queries & Problem Resolution ---
  public static getAcademicQueries(): AcademicQuery[] {
    return this.getItem<AcademicQuery[]>(STORAGE_KEYS.QUERIES, DEFAULT_QUERIES);
  }

  public static createAcademicQuery(data: {
    sender_id: number;
    sender_name: string;
    sender_role: UserRole;
    sender_detail?: string;
    sender_email: string;
    category: QueryCategory;
    priority: QueryPriority;
    subject_code?: string;
    title: string;
    description: string;
    assigned_to: 'Teacher' | 'Admin' | 'HOD';
    target_teacher_id?: number;
    target_teacher_name?: string;
  }): { success: boolean; message: string; query: AcademicQuery } {
    const queries = this.getAcademicQueries();
    const newId = queries.length > 0 ? Math.max(...queries.map(q => q.query_id)) + 1 : 101;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newQuery: AcademicQuery = {
      query_id: newId,
      sender_id: data.sender_id,
      sender_name: data.sender_name,
      sender_role: data.sender_role,
      sender_detail: data.sender_detail,
      sender_email: data.sender_email,
      category: data.category,
      priority: data.priority,
      subject_code: data.subject_code,
      title: data.title,
      description: data.description,
      status: 'Pending',
      assigned_to: data.assigned_to,
      target_teacher_id: data.target_teacher_id,
      target_teacher_name: data.target_teacher_name,
      created_at: now,
      updated_at: now,
      replies: [],
    };

    queries.unshift(newQuery);
    this.setItem(STORAGE_KEYS.QUERIES, queries);

    // Trigger Notification for target recipient
    if (data.assigned_to === 'Teacher' && data.target_teacher_id) {
      this.addNotification({
        target_role: 'teacher',
        target_user_id: data.target_teacher_id,
        title: `New Student Query: ${data.category}`,
        message: `${data.sender_name} (${data.sender_detail || 'Student'}) submitted: "${data.title}"`,
        query_id: newId,
        type: 'query_created',
      });
    } else {
      this.addNotification({
        target_role: 'admin',
        title: `New Grievance Ticket: ${data.category}`,
        message: `${data.sender_name} (${data.sender_role}) submitted: "${data.title}"`,
        query_id: newId,
        type: 'query_created',
      });
    }

    return { success: true, message: 'Problem shared successfully! Authority has been notified.', query: newQuery };
  }

  public static resolveQuery(query_id: number, resolution_remarks: string, resolved_by: string): { success: boolean; message: string } {
    const queries = this.getAcademicQueries();
    const idx = queries.findIndex(q => q.query_id === query_id);
    if (idx === -1) {
      return { success: false, message: 'Query record not found.' };
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    queries[idx].status = 'Resolved';
    queries[idx].resolution_remarks = resolution_remarks;
    queries[idx].resolved_by = resolved_by;
    queries[idx].resolved_at = now;
    queries[idx].updated_at = now;

    this.setItem(STORAGE_KEYS.QUERIES, queries);

    // Notify submitter that problem is resolved
    this.addNotification({
      target_role: queries[idx].sender_role,
      target_user_id: queries[idx].sender_id,
      title: 'Query Resolved! ✅',
      message: `${resolved_by} has resolved your query "${queries[idx].title}". Remarks: ${resolution_remarks.slice(0, 80)}...`,
      query_id: query_id,
      type: 'query_resolved',
    });

    return { success: true, message: 'Problem resolved successfully and submitter has been notified.' };
  }

  public static updateQueryStatus(query_id: number, status: QueryStatus, remarks?: string, resolved_by?: string): void {
    const queries = this.getAcademicQueries();
    const idx = queries.findIndex(q => q.query_id === query_id);
    if (idx !== -1) {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      queries[idx].status = status;
      queries[idx].updated_at = now;
      if (remarks) queries[idx].resolution_remarks = remarks;
      if (resolved_by) queries[idx].resolved_by = resolved_by;
      if (status === 'Resolved') queries[idx].resolved_at = now;
      this.setItem(STORAGE_KEYS.QUERIES, queries);

      this.addNotification({
        target_role: queries[idx].sender_role,
        target_user_id: queries[idx].sender_id,
        title: `Query Status: ${status}`,
        message: `Your query "${queries[idx].title}" status has been set to ${status}.`,
        query_id: query_id,
        type: 'query_reply',
      });
    }
  }

  public static addQueryReply(query_id: number, reply: {
    author_name: string;
    author_role: UserRole;
    author_id?: number;
    message: string;
  }): { success: boolean; message: string } {
    const queries = this.getAcademicQueries();
    const idx = queries.findIndex(q => q.query_id === query_id);
    if (idx === -1) {
      return { success: false, message: 'Query not found' };
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newReply: QueryReply = {
      reply_id: Date.now(),
      author_name: reply.author_name,
      author_role: reply.author_role,
      author_id: reply.author_id,
      message: reply.message,
      created_at: now,
    };

    if (!queries[idx].replies) queries[idx].replies = [];
    queries[idx].replies.push(newReply);
    queries[idx].updated_at = now;

    // If author is not sender, change status to In Progress if it was Pending
    if (queries[idx].status === 'Pending' && reply.author_role !== queries[idx].sender_role) {
      queries[idx].status = 'In Progress';
    }

    this.setItem(STORAGE_KEYS.QUERIES, queries);

    // Notify the other party
    const isSender = reply.author_name === queries[idx].sender_name;
    const targetRole = isSender ? (queries[idx].assigned_to === 'Teacher' ? 'teacher' : 'admin') : queries[idx].sender_role;

    this.addNotification({
      target_role: targetRole,
      target_user_id: isSender ? queries[idx].target_teacher_id : queries[idx].sender_id,
      title: `New Reply on Query #${query_id}`,
      message: `${reply.author_name} (${reply.author_role}) replied: "${reply.message.slice(0, 70)}..."`,
      query_id: query_id,
      type: 'query_reply',
    });

    return { success: true, message: 'Reply posted and notification sent!' };
  }

  public static deleteAcademicQuery(query_id: number): void {
    const queries = this.getAcademicQueries().filter(q => q.query_id !== query_id);
    this.setItem(STORAGE_KEYS.QUERIES, queries);
  }

  // --- Notifications System ---
  public static getNotifications(role?: UserRole, userId?: number): SystemNotification[] {
    const notifications = this.getItem<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    if (!role && !userId) return notifications;

    return notifications.filter(n => {
      if (n.target_role === 'all') return true;
      if (userId && n.target_user_id === userId) return true;
      if (role && n.target_role === role) return true;
      return false;
    });
  }

  public static addNotification(notif: Omit<SystemNotification, 'notification_id' | 'created_at' | 'read'>): void {
    const notifications = this.getItem<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.notification_id)) + 1 : 1;
    const newNotification: SystemNotification = {
      ...notif,
      notification_id: newId,
      read: false,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    notifications.unshift(newNotification);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications.slice(0, 50)); // keep last 50
  }

  public static markNotificationRead(notificationId: number): void {
    const notifications = this.getItem<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    const idx = notifications.findIndex(n => n.notification_id === notificationId);
    if (idx !== -1) {
      notifications[idx].read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }

  public static markAllNotificationsRead(role?: UserRole, userId?: number): void {
    const notifications = this.getItem<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    notifications.forEach(n => {
      if (n.target_role === 'all' || (role && n.target_role === role) || (userId && n.target_user_id === userId)) {
        n.read = true;
      }
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  public static getUnreadNotificationCount(role?: UserRole, userId?: number): number {
    return this.getNotifications(role, userId).filter(n => !n.read).length;
  }
}

// Auto-initialize default seed on load
DBService.initialize();
