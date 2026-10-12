    
import { Mentor, MentorPackage } from '../types';

export const mockPackages: MentorPackage[] = [
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
  },
  {
    id: 'pkg-201',
    mentorId: 'm-2',
    title: 'Frontend Portfolio & Production Code Audit',
    description: 'Thorough line-by-line review of your personal portfolio, GitHub repositories, and live deployed React applications.',
    durationMinutes: 60,
    priceInr: 1799,
    sessionsCount: 1,
    topics: ['Clean Code', 'TypeScript Safety', 'Bundle Size Optimization', 'Accessibility'],
    deliverables: ['Written Code Health Report', 'Actionable PR Suggestions', 'Mock Frontend Interview']
  },
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
];

export const mockMentors: Mentor[] = [
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
    bio: 'Ex-Amazon, now at Google building scalable distributed systems for Google Cloud Storage. Passionate about empowering engineering college students.',
    about: 'I have spent the last 8+ years designing low-latency distributed databases and caching infrastructure handling 100M+ operations per minute.',
    skills: ['System Design', 'Java', 'Distributed Systems', 'Cloud Architecture', 'Spring Boot', 'Kafka'],
    languages: ['English', 'Hindi'],
    nextAvailableSlot: 'Tomorrow, 7:00 PM',
    packages: [mockPackages[0], mockPackages[1]]
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
    bio: 'Leading modern web platform teams at Microsoft. Specializes in advanced React architectures, performance profiling, and TypeScript.',
    about: 'I guide students through mastering deep frontend mechanics—virtual DOM reconciliations, layout reflow elimination, and production component libraries.',
    skills: ['React', 'TypeScript', 'Next.js', 'Frontend Performance', 'Design Systems', 'GraphQL'],
    languages: ['English', 'Tamil'],
    nextAvailableSlot: 'Today, 8:30 PM',
    packages: [mockPackages[2]]
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
    bio: '10+ years architecting enterprise Java/Spring ecosystems handling millions of QPS. Member of Java Community Process.',
    about: 'I bridge the gap between textbook classroom coding and production-hardened cloud backends. We break down real incidents and design fault-tolerant pipelines.',
    skills: ['Java', 'Spring Boot', 'AWS', 'Microservices', 'PostgreSQL', 'High Concurrency'],
    languages: ['English', 'Marathi', 'Hindi'],
    nextAvailableSlot: 'Friday, 6:00 PM',
    packages: [mockPackages[3]]
  }
];
