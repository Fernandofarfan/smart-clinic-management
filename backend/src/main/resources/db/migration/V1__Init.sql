-- Smart Clinic Management System - Database Schema
-- V1__Init.sql

-- ============================================
-- TABLE CREATION
-- ============================================

-- 1. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    available_times TEXT,
    bio VARCHAR(500),
    years_of_experience INT,
    consultation_fee DOUBLE,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_doctors_email (email),
    INDEX idx_doctors_specialty (specialty)
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    address VARCHAR(200),
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_patients_email (email)
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    appointment_time DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    notes VARCHAR(500),
    symptoms VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_appointments_doctor_date (doctor_id, appointment_time),
    INDEX idx_appointments_patient_date (patient_id, appointment_time)
);

-- 4. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT,
    medication TEXT NOT NULL,
    dosage TEXT,
    instructions TEXT,
    diagnosis VARCHAR(500),
    prescribed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    valid_until DATETIME,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_prescriptions_doctor (doctor_id),
    INDEX idx_prescriptions_patient (patient_id)
);

-- 5. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'ADMIN',
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample admins (only if table is empty to avoid duplicates on re-runs if not managed by flyway strictly)
INSERT IGNORE INTO admins (id, username, email, password, role) VALUES
(1, 'admin', 'admin@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'ADMIN'),
(2, 'superadmin', 'superadmin@smartclinic.com', 'super123', 'SUPER_ADMIN');
