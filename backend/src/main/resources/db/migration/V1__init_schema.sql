-- =================================================================
-- V1__init_schema.sql: SkillBridge Schema Definition
-- =================================================================

-- 1. Users table (Central identity for STUDENT, MENTOR, ADMIN)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    avatar_url VARCHAR(500),
    phone VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGINT PRIMARY KEY,
    college VARCHAR(150),
    department VARCHAR(100),
    academic_year VARCHAR(50),
    CONSTRAINT fk_student_user FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Mentor Profiles
CREATE TABLE IF NOT EXISTS mentor_profiles (
    id BIGINT PRIMARY KEY,
    title VARCHAR(120),
    company VARCHAR(120),
    experience_years INT NOT NULL DEFAULT 0,
    hourly_rate_inr DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    bio TEXT,
    about TEXT,
    languages VARCHAR(255),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
    work_id_verified BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_mentor_user FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_mentor_verification (verification_status),
    INDEX idx_mentor_company (company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Mentor Skills (Many-to-Many)
CREATE TABLE IF NOT EXISTS mentor_skills (
    mentor_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (mentor_id, skill_id),
    CONSTRAINT fk_ms_mentor FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_ms_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Mentorship Packages
CREATE TABLE IF NOT EXISTS mentorship_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 60,
    price_inr DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    sessions_count INT NOT NULL DEFAULT 1,
    topics JSON,
    deliverables JSON,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_package_mentor FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    INDEX idx_package_mentor (mentor_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Availability Slots
CREATE TABLE IF NOT EXISTS availability_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_slot_mentor FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    INDEX idx_slot_mentor_time (mentor_id, start_time, is_booked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(64) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    mentor_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,
    slot_id BIGINT NOT NULL UNIQUE,
    snapshot_price_inr DECIMAL(10,2) NOT NULL,
    snapshot_duration_minutes INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
    notes TEXT,
    zoom_link VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_booking_mentor FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id),
    CONSTRAINT fk_booking_package FOREIGN KEY (package_id) REFERENCES mentorship_packages(id),
    CONSTRAINT fk_booking_slot FOREIGN KEY (slot_id) REFERENCES availability_slots(id),
    INDEX idx_booking_student (student_id),
    INDEX idx_booking_mentor (mentor_id),
    INDEX idx_booking_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Session Rooms (1-on-1 Encrypted Meeting Sandbox)
CREATE TABLE IF NOT EXISTS session_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    room_code VARCHAR(64) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Payments (Simulated Escrow Sandbox)
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    amount_inr DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SIMULATED_HOLD',
    provider VARCHAR(50) NOT NULL DEFAULT 'SANDBOX_SIMULATOR',
    transaction_ref VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    mentor_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_review_mentor FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id),
    INDEX idx_review_mentor (mentor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
