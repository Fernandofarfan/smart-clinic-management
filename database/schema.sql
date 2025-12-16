-- Smart Clinic Management System - Database Schema
-- MySQL Database Creation Script

-- Create database
CREATE DATABASE IF NOT EXISTS smart_clinic_db;
USE smart_clinic_db;

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

-- Insert sample admins
INSERT INTO admins (username, email, password, role) VALUES
('admin', 'admin@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'ADMIN'),
('superadmin', 'superadmin@smartclinic.com', 'super123', 'SUPER_ADMIN');

-- Insert sample doctors
INSERT INTO doctors (name, email, password, specialty, phone, available_times, bio, years_of_experience, consultation_fee) VALUES
('Dr. John Smith', 'john.smith@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Cardiology', '+1-555-0101', '["09:00-10:00","10:00-11:00","14:00-15:00","15:00-16:00"]', 'Experienced cardiologist with 15 years of practice', 15, 150.00),
('Dr. Sarah Johnson', 'sarah.johnson@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Pediatrics', '+1-555-0102', '["08:00-09:00","09:00-10:00","13:00-14:00","14:00-15:00"]', 'Specialist in child healthcare', 10, 120.00),
('Dr. Michael Chen', 'michael.chen@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Orthopedics', '+1-555-0103', '["10:00-11:00","11:00-12:00","15:00-16:00","16:00-17:00"]', 'Expert in bone and joint treatments', 12, 140.00),
('Dr. Emily Davis', 'emily.davis@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Dermatology', '+1-555-0104', '["09:00-10:00","11:00-12:00","14:00-15:00"]', 'Skin care specialist', 8, 130.00),
('Dr. Robert Wilson', 'robert.wilson@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Neurology', '+1-555-0105', '["08:00-09:00","10:00-11:00","15:00-16:00"]', 'Neurological disorders expert', 20, 180.00);

-- Insert sample patients
INSERT INTO patients (name, email, password, phone, date_of_birth, address, gender, blood_group) VALUES
('Alice Brown', 'alice.brown@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1001', '1990-05-15', '123 Main St, New York, NY', 'Female', 'A+'),
('Bob Martinez', 'bob.martinez@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1002', '1985-08-22', '456 Oak Ave, Los Angeles, CA', 'Male', 'O+'),
('Carol White', 'carol.white@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1003', '1992-03-10', '789 Pine Rd, Chicago, IL', 'Female', 'B+'),
('David Lee', 'david.lee@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1004', '1988-11-30', '321 Elm St, Houston, TX', 'Male', 'AB+'),
('Emma Taylor', 'emma.taylor@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1005', '1995-07-18', '654 Maple Dr, Phoenix, AZ', 'Female', 'A-'),
('Frank Anderson', 'frank.anderson@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1006', '1982-01-25', '987 Cedar Ln, Philadelphia, PA', 'Male', 'O-'),
('Grace Thomas', 'grace.thomas@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1007', '1998-09-05', '147 Birch Ct, San Antonio, TX', 'Female', 'B-');

-- Insert sample appointments
INSERT INTO appointments (doctor_id, patient_id, appointment_time, status, symptoms, notes) VALUES
(1, 1, '2025-12-01 09:00:00', 'SCHEDULED', 'Chest pain, shortness of breath', 'First consultation'),
(1, 2, '2025-12-01 10:00:00', 'SCHEDULED', 'High blood pressure', 'Follow-up visit'),
(2, 3, '2025-12-01 08:00:00', 'COMPLETED', 'Child fever and cough', 'Prescribed medication'),
(2, 4, '2025-12-02 09:00:00', 'SCHEDULED', 'Vaccination appointment', 'Annual checkup'),
(3, 5, '2025-12-02 10:00:00', 'SCHEDULED', 'Knee pain', 'Sports injury'),
(3, 6, '2025-12-03 11:00:00', 'SCHEDULED', 'Back pain', 'Chronic condition'),
(4, 7, '2025-12-03 09:00:00', 'SCHEDULED', 'Skin rash', 'Allergic reaction'),
(5, 1, '2025-12-04 08:00:00', 'SCHEDULED', 'Headaches and dizziness', 'Neurological assessment'),
(1, 3, '2025-11-15 14:00:00', 'COMPLETED', 'Heart palpitations', 'ECG performed'),
(2, 5, '2025-11-20 13:00:00', 'COMPLETED', 'Child wellness checkup', 'All normal');

-- Insert sample prescriptions
INSERT INTO prescriptions (doctor_id, patient_id, appointment_id, medication, dosage, instructions, diagnosis) VALUES
(2, 3, 3, 'Amoxicillin', '500mg three times daily', 'Take with food for 7 days', 'Upper respiratory infection'),
(1, 3, 9, 'Beta-blockers', '25mg once daily', 'Take in the morning', 'Cardiac arrhythmia'),
(2, 5, 10, 'Multivitamins', 'One tablet daily', 'Take with breakfast', 'Routine wellness');

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Stored Procedure 1: GetDailyAppointmentReportByDoctor
DELIMITER //
CREATE PROCEDURE GetDailyAppointmentReportByDoctor(
    IN p_doctor_id BIGINT,
    IN p_date DATE
)
BEGIN
    SELECT 
        d.id AS doctor_id,
        d.name AS doctor_name,
        d.specialty,
        COUNT(a.id) AS total_appointments,
        SUM(CASE WHEN a.status = 'SCHEDULED' THEN 1 ELSE 0 END) AS scheduled_count,
        SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_count,
        SUM(CASE WHEN a.status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_count,
        p_date AS report_date
    FROM doctors d
    LEFT JOIN appointments a ON d.id = a.doctor_id 
        AND DATE(a.appointment_time) = p_date
    WHERE d.id = p_doctor_id
    GROUP BY d.id, d.name, d.specialty;
END //
DELIMITER ;

-- Stored Procedure 2: GetDoctorWithMostPatientsByMonth
DELIMITER //
CREATE PROCEDURE GetDoctorWithMostPatientsByMonth(
    IN p_year INT,
    IN p_month INT
)
BEGIN
    SELECT 
        d.id AS doctor_id,
        d.name AS doctor_name,
        d.specialty,
        COUNT(DISTINCT a.patient_id) AS unique_patients,
        COUNT(a.id) AS total_appointments,
        p_year AS year,
        p_month AS month
    FROM doctors d
    INNER JOIN appointments a ON d.id = a.doctor_id
    WHERE YEAR(a.appointment_time) = p_year 
        AND MONTH(a.appointment_time) = p_month
    GROUP BY d.id, d.name, d.specialty
    ORDER BY unique_patients DESC
    LIMIT 1;
END //
DELIMITER ;

-- Stored Procedure 3: GetDoctorWithMostPatientsByYear
DELIMITER //
CREATE PROCEDURE GetDoctorWithMostPatientsByYear(
    IN p_year INT
)
BEGIN
    SELECT 
        d.id AS doctor_id,
        d.name AS doctor_name,
        d.specialty,
        COUNT(DISTINCT a.patient_id) AS unique_patients,
        COUNT(a.id) AS total_appointments,
        p_year AS year
    FROM doctors d
    INNER JOIN appointments a ON d.id = a.doctor_id
    WHERE YEAR(a.appointment_time) = p_year
    GROUP BY d.id, d.name, d.specialty
    ORDER BY unique_patients DESC
    LIMIT 1;
END //
DELIMITER ;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Show all tables
SHOW TABLES;

-- Show sample data from each table
SELECT * FROM doctors LIMIT 5;
SELECT * FROM patients LIMIT 5;
SELECT * FROM appointments LIMIT 5;
SELECT * FROM prescriptions LIMIT 5;
SELECT * FROM admins LIMIT 5;

-- Test stored procedures
CALL GetDailyAppointmentReportByDoctor(1, '2025-12-01');
CALL GetDoctorWithMostPatientsByMonth(2025, 11);
CALL GetDoctorWithMostPatientsByYear(2025);
