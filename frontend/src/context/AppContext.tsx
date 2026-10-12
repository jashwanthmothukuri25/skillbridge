import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Mentor, Booking } from '../types';
import { authService } from '../services/authService';
import { mentorService } from '../services/mentorService';
import { bookingService } from '../services/bookingService';
import { getToken } from '../services/api';

interface AppContextType {
  user: User | null;
  mentors: Mentor[];
  bookings: Booking[];
  login: (role: UserRole, email: string, password?: string) => Promise<void>;
  logout: () => void;
  signUpStudent: (studentData: {
    name: string;
    email: string;
    password?: string;
    college: string;
    department: string;
    year: string;
    phone?: string;
  }) => Promise<void>;
  signUpMentor: (mentorData: {
    name: string;
    email: string;
    password?: string;
    title: string;
    company: string;
    experienceYears: number;
    skills: string[];
    hourlyRateInr: number;
  }) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id'>) => string;
  cancelBooking: (bookingId: string) => void;
  refreshData: () => Promise<void>;
}

const initialMentors: Mentor[] = [
  {
    id: 'm-1',
    name: 'Aarav Sharma',
    title: 'Senior Staff Software Engineer',
    company: 'Google',
    experienceYears: 8,
    rating: 4.95,
    reviewCount: 84,
    hourlyRateInr: 1999,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'Ex-Amazon, now at Google building scalable distributed systems for Google Cloud Storage. Passionate about empowering tier-2 and tier-3 college students with real industry engineering standards.',
    about: 'I have spent the last 8+ years designing low-latency distributed databases and caching infrastructure handling 100M+ operations per minute. My mentorship focuses on practical whiteboard design rounds, scalable Java concurrency, and realistic off-campus interview simulations.',
    skills: ['System Design', 'Java', 'Distributed Systems', 'Cloud Architecture', 'Spring Boot', 'Kafka'],
    languages: ['English', 'Hindi'],
    nextAvailableSlot: 'Tomorrow, 7:00 PM',
    packages: [
      {
        id: 'pkg-101',
        mentorId: 'm-1',
        title: 'Mock System Design Round + Architecture Critique',
        description: 'A 90-minute real-time distributed architecture whiteboard round with written scorecard and structural feedback.',
        durationMinutes: 90,
        priceInr: 2499,
        sessionsCount: 1,
        topics: ['Scalability', 'Microservices', 'Database Sharding', 'Message Queues'],
        deliverables: ['Custom Whiteboard Canvas', 'Detailed Evaluation Rubric', 'Recording Access']
      },
      {
        id: 'pkg-102',
        mentorId: 'm-1',
        title: 'Full-Stack Java Placement Accelerator',
        description: 'Comprehensive 4-week structured deep dive covering high-performance Spring Boot and clean architectural paradigms.',
        durationMinutes: 60,
        priceInr: 7999,
        sessionsCount: 4,
        topics: ['Spring Boot 3', 'Hibernate Optimizations', 'Docker', 'CI/CD Pipelines'],
        deliverables: ['4 Private Live Sessions', 'Codebase GitHub PR Reviews', 'Direct Slack Access']
      }
    ]
  },
  {
    id: 'm-2',
    name: 'Pooja Iyer',
    title: 'Lead Frontend Architect',
    company: 'Microsoft',
    experienceYears: 7,
    rating: 4.98,
    reviewCount: 96,
    hourlyRateInr: 1799,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    bio: 'Leading modern web platform teams at Microsoft. Specializes in advanced React architectures, performance profiling, TypeScript, and micro-frontends.',
    about: 'I guide students through mastering deep frontend mechanics—virtual DOM reconciliations, layout reflow elimination, state machine architectures, and building production-grade accessible component libraries.',
    skills: ['React', 'TypeScript', 'Next.js', 'Frontend Performance', 'Design Systems', 'GraphQL'],
    languages: ['English', 'Tamil'],
    nextAvailableSlot: 'Today, 8:30 PM',
    packages: [
      {
        id: 'pkg-201',
        mentorId: 'm-2',
        title: 'Frontend Portfolio & Production Code Audit',
        description: 'Thorough line-by-line review of your personal portfolio, GitHub repositories, and live deployed React applications.',
        durationMinutes: 60,
        priceInr: 1799,
        sessionsCount: 1,
        topics: ['Clean Code', 'TypeScript Safety', 'Bundle Size Optimization', 'Accessibility (a11y)'],
        deliverables: ['Written Code Health Report', 'Actionable PR Suggestions', 'Mock Frontend Interview']
      }
    ]
  },
  {
    id: 'm-3',
    name: 'Devendra Kulkarni',
    title: 'Principal Backend Engineer',
    company: 'Amazon',
    experienceYears: 10,
    rating: 4.91,
    reviewCount: 112,
    hourlyRateInr: 2199,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: '10+ years architecting enterprise Java/Spring ecosystems handling millions of QPS. Member of Java Community Process and mentor to 200+ engineers.',
    about: 'I bridge the gap between textbook classroom coding and production-hardened cloud backends. We break down real incidents, design fault-tolerant pipelines, and build resume projects that stand out to technical interviewers.',
    skills: ['Java', 'Spring Boot', 'AWS', 'Microservices', 'PostgreSQL', 'High Concurrency'],
    languages: ['English', 'Marathi', 'Hindi'],
    nextAvailableSlot: 'Friday, 6:00 PM',
    packages: [
      {
        id: 'pkg-301',
        mentorId: 'm-3',
        title: 'Backend Scalability & High-Volume Interview Drill',
        description: 'Intense drill simulating AWS & tier-1 backend engineering technical interviews.',
        durationMinutes: 75,
        priceInr: 2199,
        sessionsCount: 1,
        topics: ['Concurrency', 'Database Indexing', 'CAP Theorem', 'Fault Tolerance'],
        deliverables: ['Live Session Notes', 'Curated Interview Question Bank', 'Placement Strategy Roadmap']
      }
    ]
  }
];

const initialBookings: Booking[] = [
  {
    id: 'bk-1001',
    studentId: 'std-demo-1',
    studentName: 'Rohan Verma',
    mentorId: 'm-1',
    mentorName: 'Aarav Sharma',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    packageId: 'pkg-101',
    packageTitle: 'Mock System Design Round + Architecture Critique',
    date: 'Tomorrow',
    timeSlot: '7:00 PM - 8:30 PM',
    durationMinutes: 90,
    amountInr: 2499,
    status: 'upcoming',
    zoomLink: '/session/live-demo-1001'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('skillbridge_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default logged-in demo state for immediate exploration
    return {
      id: 'std-demo-1',
      name: 'Rohan Verma',
      email: 'rohan.verma@college.edu',
      role: 'student',
      college: 'National Institute of Technology',
      department: 'Computer Science & Engineering',
      year: 'Final Year (2026)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'
    };
  });

  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('skillbridge_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialBookings;
      }
    }
    return initialBookings;
  });

  const refreshData = async () => {
    try {
      const liveMentors = await mentorService.getMentors();
      if (liveMentors && liveMentors.length > 0) {
        setMentors(liveMentors);
      }
    } catch {
      // offline fallback
    }

    if (getToken()) {
      try {
        const liveBookings = await bookingService.getMyBookings();
        if (liveBookings && liveBookings.length > 0) {
          setBookings(liveBookings);
        }
      } catch {
        // offline fallback
      }
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('skillbridge_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('skillbridge_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('skillbridge_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const login = async (role: UserRole, email: string, password?: string): Promise<void> => {
    const pwd = password || 'demoPass123!';
    try {
      const res = await authService.login(email, pwd);
      setUser(res.user);
      try {
        const liveBookings = await bookingService.getMyBookings();
        setBookings(liveBookings);
      } catch {
        // keep existing bookings
      }
      return;
    } catch (err) {
      console.warn('Backend login fallback:', err);
      if (role === 'admin') {
        setUser({
          id: 'adm-demo-1',
          name: 'Dr. Sunita Rao',
          email: email || 'admin@skillbridge.edu',
          role: 'admin',
          title: 'Platform Dean & System Administrator',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
        });
      } else if (role === 'mentor') {
        setUser({
          id: 'm-1',
          name: 'Aarav Sharma',
          email: email || 'aarav.sharma@google.com',
          role: 'mentor',
          company: 'Google',
          title: 'Senior Staff Software Engineer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
        });
      } else {
        setUser({
          id: 'std-demo-1',
          name: 'Rohan Verma',
          email: email || 'rohan.verma@college.edu',
          role: 'student',
          college: 'National Institute of Technology',
          department: 'Computer Science & Engineering',
          year: 'Final Year (2026)',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'
        });
      }
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const signUpStudent = async (studentData: {
    name: string;
    email: string;
    password?: string;
    college: string;
    department: string;
    year: string;
    phone?: string;
  }): Promise<void> => {
    try {
      const res = await authService.registerStudent(studentData);
      setUser(res.user);
    } catch (err) {
      console.warn('Backend registration failed, using fallback:', err);
      const newUser: User = {
        id: `std-${Date.now()}`,
        name: studentData.name,
        email: studentData.email,
        role: 'student',
        college: studentData.college,
        department: studentData.department,
        year: studentData.year,
        phone: studentData.phone,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studentData.name)}`
      };
      setUser(newUser);
    }
  };

  const signUpMentor = async (mentorData: {
    name: string;
    email: string;
    password?: string;
    title: string;
    company: string;
    experienceYears: number;
    skills: string[];
    hourlyRateInr: number;
  }): Promise<void> => {
    try {
      const res = await authService.registerMentor(mentorData);
      setUser(res.user);
    } catch (err) {
      console.warn('Backend registration failed, using fallback:', err);
      const newUser: User = {
        id: `mnt-${Date.now()}`,
        name: mentorData.name,
        email: mentorData.email,
        role: 'mentor',
        title: mentorData.title,
        company: mentorData.company,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mentorData.name)}`
      };
      setUser(newUser);
    }
  };

  const addBooking = (bookingData: Omit<Booking, 'id'>): string => {
    const tempId = `bk-${Date.now()}`;
    const newBooking: Booking = {
      ...bookingData,
      id: tempId,
      zoomLink: `/session/live-${tempId}`
    };
    setBookings((prev) => [newBooking, ...prev]);

    if (getToken()) {
      bookingService.createBooking({
        packageId: bookingData.packageId,
        notes: ''
      }).then((persisted) => {
        setBookings((prev) =>
          prev.map((b) => (b.id === tempId ? { ...persisted, id: String(persisted.id) } : b))
        );
      }).catch((err) => {
        console.warn('Booking persist notice:', err);
      });
    }

    return tempId;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    if (getToken()) {
      bookingService.cancelBooking(bookingId).catch((err) => {
        console.warn('Cancel booking persist notice:', err);
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        mentors,
        bookings,
        login,
        logout,
        signUpStudent,
        signUpMentor,
        addBooking,
        cancelBooking,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
