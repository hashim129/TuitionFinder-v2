import { Tutor, Student, ChatMessage, Session, TuitionNeed } from '../types';

export const TUTORS: Tutor[] = [
  {
    id: 't1',
    name: 'Engr. Ahmad Raza',
    avatar: 'AR',
    subjects: ['Physics', 'Mathematics'],
    city: 'Lahore',
    area: 'Gulberg',
    experienceYears: 8,
    rating: 4.9,
    totalStudents: 120,
    hourlyRatePKR: 2500, monthlyRatePKR: 20000,
    availability: ['Mon 4-6 PM', 'Wed 4-6 PM', 'Sat 10 AM-1 PM'],
    verified: true,
    cnicVerified: true,
    cnicNumber: '35202-1234567-8',
    description: '8+ years teaching A-Levels, MDCAT, FSc Physics and Math. Proven track record with 95%+ board toppers.',
    qualifications: 'BE Civil Engineering, MSc Physics'
  },
  {
    id: 't2',
    name: 'Dr. Sana Khalid',
    avatar: 'SK',
    subjects: ['Chemistry', 'Biology'],
    city: 'Lahore',
    area: 'DHA',
    experienceYears: 6,
    rating: 4.8,
    totalStudents: 85,
    hourlyRatePKR: 2000, monthlyRatePKR: 16000,
    availability: ['Tue 5-7 PM', 'Thu 5-7 PM', 'Sun 11 AM-2 PM'],
    verified: true,
    cnicVerified: true,
    cnicNumber: '35201-2345678-9',
    description: 'MBBS, teaching MDCAT/ECAT prep with chemistry and biology focus. Specialized in conceptual understanding.',
    qualifications: 'MBBS, MCSP'
  },
  {
    id: 't3',
    name: 'Miss Ayesha Fatima',
    avatar: 'AF',
    subjects: ['English', 'Urdu', 'Pakistan Studies'],
    city: 'Lahore',
    area: 'Wapda Town',
    experienceYears: 4,
    rating: 4.7,
    totalStudents: 60,
    hourlyRatePKR: 1500, monthlyRatePKR: 12000,
    availability: ['Mon 3-5 PM', 'Tue 3-5 PM', 'Sat 11 AM-1 PM'],
    verified: true,
    cnicVerified: true,
    cnicNumber: '35203-3456789-0',
    description: 'MA English Literature. Teaching Matric, O-Levels, A-Levels English and language subjects.',
    qualifications: 'MA English Literature'
  },
  {
    id: 't4',
    name: 'Teacher Bilal Hussain',
    avatar: 'BH',
    subjects: ['Computer Science', 'Mathematics'],
    city: 'Lahore',
    area: 'Model Town',
    experienceYears: 5,
    rating: 4.6,
    totalStudents: 45,
    hourlyRatePKR: 1800, monthlyRatePKR: 14000,
    availability: ['Wed 6-8 PM', 'Fri 6-8 PM', 'Sun 4-6 PM'],
    verified: true,
    cnicVerified: false,
    cnicNumber: '',
    description: 'BS Computer Science. Teaching FSc CS, A-Levels Computer Science, and Python programming.',
    qualifications: 'BS Computer Science'
  },
  {
    id: 't5',
    name: 'Hafiz Muhammad Tariq',
    avatar: 'MT',
    subjects: ['Quran', 'Islamiyat'],
    city: 'Lahore',
    area: 'Johar Town',
    experienceYears: 12,
    rating: 4.9,
    totalStudents: 200,
    hourlyRatePKR: 1000, monthlyRatePKR: 8000,
    availability: ['Daily 8-10 PM'],
    verified: true,
    cnicVerified: true,
    cnicNumber: '35202-4567890-1',
    description: 'Hafiz-e-Quran. Teaching Quran with Tajweed, Nazra, and Islamic studies for all ages.',
    qualifications: 'Hifz-e-Quran, Shariya Degree'
  },
  {
    id: 't6',
    name: 'Dr. Fatima Zahra',
    avatar: 'FZ',
    subjects: ['Mathematics', 'Calculus'],
    city: 'Lahore',
    area: 'Gulberg',
    experienceYears: 10,
    rating: 4.9,
    totalStudents: 150,
    hourlyRatePKR: 3000, monthlyRatePKR: 24000,
    availability: ['Mon 6-8 PM', 'Thu 6-8 PM', 'Sat 2-4 PM'],
    verified: true,
    cnicVerified: true,
    cnicNumber: '35201-5678901-2',
    description: 'PhD Mathematics. Specializing in calculus and advanced mathematics for MDCAT and university level.',
    qualifications: 'PhD Mathematics'
  }
];

export const STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Hamza Tariq',
    avatar: 'HT',
    gradeLevel: 'A-Levels (FSc)',
    subjects: ['Physics', 'Mathematics'],
    city: 'Lahore',
    area: 'Gulberg II',
    budgetPKR: 25000,
    cnicVerified: true,
    cnicNumber: '35202-1112223-3',
    description: 'A-Levels student preparing for MDCAT. Need help in Physics and Math.'
  },
  {
    id: 's2',
    name: 'Zara Khan',
    avatar: 'ZK',
    gradeLevel: 'Matric (9th Grade)',
    subjects: ['English', 'Urdu'],
    city: 'Lahore',
    area: 'Wapda Town',
    budgetPKR: 15000,
    cnicVerified: false,
    cnicNumber: '',
    description: 'Matric student looking for English and Urdu tutor for exam preparation.'
  },
  {
    id: 's3',
    name: 'Ahmad Raza',
    avatar: 'AR',
    gradeLevel: 'Intermediate (FSc)',
    subjects: ['Chemistry', 'Biology'],
    city: 'Lahore',
    area: 'DHA',
    budgetPKR: 20000,
    cnicVerified: true,
    cnicNumber: '35201-2223334-4',
    description: 'FSc pre-medical student. Need chemistry and biology tutor for MDCAT prep.'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'user',
    senderName: 'You',
    text: 'Assalam-o-Alaikum Sir Ahmad, Hamza has his Physics test next Monday. Could we arrange a session?',
    timestamp: '07:15 PM',
    type: 'text'
  },
  {
    id: 'm2',
    senderId: 't1',
    senderName: 'Engr. Ahmad Raza',
    text: 'Walaikum Assalam! Yes, I can help Hamza. What time works best for you this week?',
    timestamp: '07:22 PM',
    type: 'text'
  },
  {
    id: 'm3',
    senderId: 'system',
    senderName: 'System',
    text: 'Booking started - use the offer bar below to set monthly tuition price.',
    timestamp: '07:23 PM',
    type: 'system'
  }
];

export const SAMPLE_SESSIONS: Session[] = [
  {
    id: 'sess1',
    tutorId: 't1',
    tutorName: 'Engr. Ahmad Raza',
    studentName: 'Hamza Tariq',
    subject: 'Physics',
    amountPKR: 25000,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    sessionsCompleted: 12,
    totalSessions: 20,
    status: 'active',
    escrowBalance: 29000,
    tutorPayout: 21250,
    platformFee: 3750,
    qrCode: 'TF-QR-A1B2C3'
  }
];

export const SAMPLE_TUITION_NEEDS: TuitionNeed[] = [
  {
    id: 'need1',
    studentId: 's1',
    studentName: 'Hamza Tariq',
    studentAvatar: 'HT',
    subjects: ['Physics', 'Mathematics'],
    gradeLevel: 'A-Levels (FSc)',
    city: 'Lahore',
    area: 'Gulberg II',
    budgetPKR: 25000,
    durationMinutes: 90,
    sessionsPerCycle: 24,
    preferredWeekdays: ['Mon', 'Wed', 'Fri', 'Sat'],
    description: 'A-Levels student preparing for MDCAT. Need help in Physics and Math.',
    status: 'open',
    createdAt: '2026-10-10',
    responses: 3
  },
  {
    id: 'need2',
    studentId: 's3',
    studentName: 'Ahmad Raza',
    studentAvatar: 'AR',
    subjects: ['Chemistry', 'Biology'],
    gradeLevel: 'Intermediate (FSc)',
    city: 'Lahore',
    area: 'DHA',
    budgetPKR: 20000,
    durationMinutes: 120,
    sessionsPerCycle: 26,
    preferredWeekdays: ['Tue', 'Thu', 'Sat'],
    description: 'FSc pre-medical student. Need chemistry and biology tutor for MDCAT prep.',
    status: 'open',
    createdAt: '2026-10-09',
    responses: 5
  }
];

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Urdu', 'Computer Science', 'Python Programming',
  'Accounting', 'Economics', 'Business Studies',
  'Holy Quran', 'Quran with Tajweed', 'Hifz-e-Quran',
  'Islamiyat', 'Pakistan Studies', 'General Science',
  'MDCAT Preparation', 'MCAT Preparation', 'ECAT Preparation',
  'A-Levels', 'O-Levels', 'CSS Preparation'
];
