-- =================================================================
-- V2__seed_demo_data.sql: SkillBridge Verified Demo Seed Data
-- Passwords set to 'demoPass123!' (BCrypt: $2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi)
-- =================================================================

-- 1. Insert Users
INSERT INTO users (id, email, password_hash, name, role, avatar_url, phone, is_active, created_at)
VALUES
  -- Student: Rohan Verma (ID 1)
  (1, 'rohan.verma@college.edu', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Rohan Verma', 'STUDENT', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400', '+91 98765 43210', TRUE, NOW()),
  -- Mentor: Aarav Sharma (ID 2)
  (2, 'aarav.sharma@google.com', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Aarav Sharma', 'MENTOR', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', '+91 98111 22334', TRUE, NOW()),
  -- Mentor: Pooja Iyer (ID 3)
  (3, 'pooja.iyer@microsoft.com', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Pooja Iyer', 'MENTOR', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', '+91 98222 33445', TRUE, NOW()),
  -- Mentor: Devendra Kulkarni (ID 4)
  (4, 'devendra.kulkarni@amazon.com', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Devendra Kulkarni', 'MENTOR', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', '+91 98333 44556', TRUE, NOW()),
  -- Admin: Dr. Sunita Rao (ID 5)
  (5, 'admin@skillbridge.edu', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Dr. Sunita Rao', 'ADMIN', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', '+91 98444 55667', TRUE, NOW()),
  -- Student Alias for student@skillbridge.in (ID 6)
  (6, 'student@skillbridge.in', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Shiva K.', 'STUDENT', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400', '+91 98555 66778', TRUE, NOW()),
  -- Pending Mentor 1: Rohan Deshmukh (ID 7)
  (7, 'rohan.d@google.com', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Rohan Deshmukh', 'MENTOR', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', '+91 98666 77889', TRUE, NOW()),
  -- Pending Mentor 2: Sneha Venkatesh (ID 8)
  (8, 'sneha.v@amazon.com', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Sneha Venkatesh', 'MENTOR', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', '+91 98777 88990', TRUE, NOW()),
  -- Pending Mentor 3: Vikram Sethi (ID 9)
  (9, 'vikram.s@flipkart.com', '$2a$10$PVeT5F47Zi09hu.TLW2jXe6HbiAAVE76SGCh/sJvJD9uIDmBOa7bi', 'Vikram Sethi', 'MENTOR', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400', '+91 98888 99001', TRUE, NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Student Profiles
INSERT INTO student_profiles (id, college, department, academic_year)
VALUES
  (1, 'National Institute of Technology', 'Computer Science & Engineering', 'Final Year (2026)'),
  (6, 'IIT Hyderabad', 'Computer Science & Engineering', 'Final Year (2026)')
ON DUPLICATE KEY UPDATE college=VALUES(college);

-- 3. Insert Mentor Profiles
INSERT INTO mentor_profiles (id, title, company, experience_years, hourly_rate_inr, rating, review_count, bio, about, languages, verification_status, work_id_verified)
VALUES
  (2, 'Senior Staff Software Engineer', 'Google', 8, 1999.00, 4.95, 84,
   'Ex-Amazon, now at Google building scalable distributed systems for Google Cloud Storage. Passionate about empowering engineering college students.',
   'I have spent the last 8+ years designing low-latency distributed databases and caching infrastructure handling 100M+ operations per minute. My mentorship focuses on practical whiteboard design rounds, scalable Java concurrency, and realistic off-campus interview simulations.',
   'English, Hindi', 'APPROVED', TRUE),

  (3, 'Lead Frontend Architect', 'Microsoft', 7, 1799.00, 4.98, 96,
   'Leading modern web platform teams at Microsoft. Specializes in advanced React architectures, performance profiling, TypeScript, and micro-frontends.',
   'I guide students through mastering deep frontend mechanics—virtual DOM reconciliations, layout reflow elimination, state machine architectures, and building production-grade accessible component libraries.',
   'English, Tamil', 'APPROVED', TRUE),

  (4, 'Principal Backend Engineer', 'Amazon', 10, 2199.00, 4.91, 112,
   '10+ years architecting enterprise Java/Spring ecosystems handling millions of QPS. Member of Java Community Process and mentor to 200+ engineers.',
   'I bridge the gap between textbook classroom coding and production-hardened cloud backends. We break down real incidents, design fault-tolerant pipelines, and build resume projects that stand out to technical interviewers.',
   'English, Marathi, Hindi', 'APPROVED', TRUE),

  (7, 'Staff Site Reliability Engineer', 'Google India', 9, 2499.00, 5.00, 0,
   'Staff SRE leading Kubernetes cluster resilience and high-throughput multi-region traffic failovers at Google.',
   'Focused on production debugging, distributed tracing, Linux kernel performance tuning, and incident post-mortems.',
   'English, Marathi', 'PENDING', TRUE),

  (8, 'Senior Solutions Architect', 'Amazon Web Services', 7, 1999.00, 5.00, 0,
   'Senior Solutions Architect at AWS helping fintech unicorns build event-driven serverless architectures.',
   'Specialized in DynamoDB single-table design, AWS Lambda concurrency scaling, and high-availability cloud patterns.',
   'English, Kannada', 'PENDING', TRUE),

  (9, 'Lead SDE-3 Backend', 'Flipkart', 6, 1799.00, 5.00, 0,
   'Lead Backend Engineer at Flipkart managing flash sale ordering engines handling 150K transactions per second.',
   'I teach practical high-concurrency Spring Boot patterns, Redis distributed locks, and Kafka partition balancing.',
   'English, Hindi', 'PENDING', FALSE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 4. Insert Skills
INSERT INTO skills (id, name)
VALUES
  (1, 'System Design'),
  (2, 'Java'),
  (3, 'Spring Boot'),
  (4, 'Distributed Systems'),
  (5, 'Cloud Architecture'),
  (6, 'Kafka'),
  (7, 'React'),
  (8, 'TypeScript'),
  (9, 'Next.js'),
  (10, 'Frontend Performance'),
  (11, 'Design Systems'),
  (12, 'GraphQL'),
  (13, 'AWS'),
  (14, 'Microservices'),
  (15, 'PostgreSQL'),
  (16, 'High Concurrency'),
  (17, 'Docker'),
  (18, 'Kubernetes'),
  (19, 'Go'),
  (20, 'DSA')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. Associate Mentor Skills
INSERT IGNORE INTO mentor_skills (mentor_id, skill_id)
VALUES
  -- Aarav Sharma
  (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
  -- Pooja Iyer
  (3, 7), (3, 8), (3, 9), (3, 10), (3, 11), (3, 12),
  -- Devendra Kulkarni
  (4, 2), (4, 3), (4, 13), (4, 14), (4, 15), (4, 16),
  -- Pending Mentors
  (7, 18), (7, 19), (7, 4),
  (8, 13), (8, 14), (8, 5),
  (9, 2), (9, 3), (9, 6), (9, 16);

-- 6. Insert Mentorship Packages
INSERT INTO mentorship_packages (id, mentor_id, title, description, duration_minutes, price_inr, sessions_count, topics, deliverables, is_active)
VALUES
  (1, 2, 'Mock System Design Round + Architecture Critique',
   'A 90-minute real-time distributed architecture whiteboard round with written scorecard and structural feedback.',
   90, 2499.00, 1,
   '["Scalability", "Microservices", "Database Sharding", "Message Queues"]',
   '["Custom Whiteboard Canvas", "Detailed Evaluation Rubric", "Recording Access"]', TRUE),

  (2, 2, 'Full-Stack Java Placement Accelerator',
   'Comprehensive 4-week structured deep dive covering high-performance Spring Boot and clean architectural paradigms.',
   60, 7999.00, 4,
   '["Spring Boot 3", "Hibernate Optimizations", "Docker", "CI/CD Pipelines"]',
   '["4 Private Live Sessions", "Codebase GitHub PR Reviews", "Direct Slack Access"]', TRUE),

  (3, 3, 'Frontend Portfolio & Production Code Audit',
   'Thorough line-by-line review of your personal portfolio, GitHub repositories, and live deployed React applications.',
   60, 1799.00, 1,
   '["Clean Code", "TypeScript Safety", "Bundle Size Optimization", "Accessibility"]',
   '["Written Code Health Report", "Actionable PR Suggestions", "Mock Frontend Interview"]', TRUE),

  (4, 4, 'Backend Scalability & High-Volume Interview Drill',
   'Intense drill simulating AWS & tier-1 backend engineering technical interviews.',
   75, 2199.00, 1,
   '["Concurrency", "Database Indexing", "CAP Theorem", "Fault Tolerance"]',
   '["Live Session Notes", "Curated Interview Question Bank", "Placement Strategy Roadmap"]', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 7. Insert Availability Slots (Upcoming week evening slots)
INSERT INTO availability_slots (id, mentor_id, start_time, end_time, is_booked)
VALUES
  -- Aarav slots
  (1, 2, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) + INTERVAL 19 HOUR, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) + INTERVAL 20 HOUR + INTERVAL 30 MINUTE, TRUE),
  (2, 2, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY) + INTERVAL 19 HOUR, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY) + INTERVAL 20 HOUR + INTERVAL 30 MINUTE, FALSE),
  (3, 2, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY) + INTERVAL 20 HOUR, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY) + INTERVAL 21 HOUR + INTERVAL 30 MINUTE, FALSE),
  (4, 2, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY) + INTERVAL 17 HOUR, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY) + INTERVAL 18 HOUR + INTERVAL 30 MINUTE, FALSE),

  -- Pooja slots
  (5, 3, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) + INTERVAL 20 HOUR + INTERVAL 30 MINUTE, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) + INTERVAL 21 HOUR + INTERVAL 30 MINUTE, FALSE),
  (6, 3, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY) + INTERVAL 18 HOUR, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY) + INTERVAL 19 HOUR, FALSE),

  -- Devendra slots
  (7, 4, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY) + INTERVAL 18 HOUR, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY) + INTERVAL 19 HOUR + INTERVAL 15 MINUTE, FALSE),
  (8, 4, DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY) + INTERVAL 18 HOUR, DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY) + INTERVAL 19 HOUR + INTERVAL 15 MINUTE, FALSE)
ON DUPLICATE KEY UPDATE is_booked=VALUES(is_booked);

-- 8. Seed Initial Booking (Rohan booked Aarav slot 1)
INSERT INTO bookings (id, booking_code, student_id, mentor_id, package_id, slot_id, snapshot_price_inr, snapshot_duration_minutes, status, notes, zoom_link, created_at)
VALUES
  (1, 'bk-1001', 1, 2, 1, 1, 2499.00, 90, 'UPCOMING',
   'Focus on distributed cache invalidation and database sharding trade-offs',
   '/session/bk-1001', NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 9. Seed Session Room
INSERT INTO session_rooms (id, booking_id, room_code, is_active, created_at)
VALUES
  (1, 1, 'room-bk-1001-live', TRUE, NOW())
ON DUPLICATE KEY UPDATE room_code=VALUES(room_code);

-- 10. Seed Simulated Payment
INSERT INTO payments (id, booking_id, amount_inr, status, provider, transaction_ref, created_at)
VALUES
  (1, 1, 2499.00, 'SIMULATED_HOLD', 'SANDBOX_SIMULATOR', 'sim_tx_99882211', NOW())
ON DUPLICATE KEY UPDATE amount_inr=VALUES(amount_inr);

-- 11. Seed Student Reviews for Aarav & Pooja
INSERT INTO reviews (id, booking_id, student_id, mentor_id, rating, comment, created_at)
VALUES
  (1, 1, 1, 2, 5,
   'The mock system design round was exceptionally realistic. Aarav pointed out bottlenecks in my sharding approach that textbook courses never mention.',
   NOW() - INTERVAL 5 DAY)
ON DUPLICATE KEY UPDATE rating=VALUES(rating);
