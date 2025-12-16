-- Smart Clinic Management System - Database Migration Script
-- Version 2.0 - Adding new tables for enhanced functionality

USE smart_clinic_db;

-- ============================================
-- NEW TABLES FOR ENHANCED FEATURES
-- ============================================

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_type VARCHAR(20) NOT NULL,  -- 'DOCTOR', 'PATIENT', 'ADMIN'
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'APPOINTMENT', 'PRESCRIPTION', 'SYSTEM', 'REMINDER'
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_user (user_type, user_id, is_read),
    INDEX idx_notifications_created (created_at)
);

-- 7. Doctor Reviews Table
CREATE TABLE IF NOT EXISTS doctor_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    doctor_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    UNIQUE(appointment_id),  -- One review per appointment
    INDEX idx_reviews_doctor (doctor_id),
    INDEX idx_reviews_rating (doctor_id, rating)
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),  -- 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'INSURANCE'
    payment_status VARCHAR(20) DEFAULT 'PENDING',  -- 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
    transaction_id VARCHAR(255),
    notes TEXT,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_payments_status (payment_status),
    INDEX idx_payments_patient (patient_id)
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_type VARCHAR(20),  -- 'DOCTOR', 'PATIENT', 'ADMIN'
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,  -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
    entity_type VARCHAR(50),  -- 'DOCTOR', 'PATIENT', 'APPOINTMENT', 'PRESCRIPTION'
    entity_id BIGINT,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (user_type, user_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
);

-- 10. Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT,
    diagnosis TEXT,
    treatment_plan TEXT,
    notes TEXT,
    attachments JSON,  -- Array of file URLs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_medical_records_patient (patient_id),
    INDEX idx_medical_records_doctor (doctor_id)
);

-- 11. Medical History Table
CREATE TABLE IF NOT EXISTS medical_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    condition_name VARCHAR(200) NOT NULL,
    diagnosed_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',  -- 'ACTIVE', 'RESOLVED', 'CHRONIC'
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_medical_history_patient (patient_id),
    INDEX idx_medical_history_status (status)
);

-- 12. Allergies Table
CREATE TABLE IF NOT EXISTS allergies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    allergen VARCHAR(200) NOT NULL,
    severity VARCHAR(20),  -- 'MILD', 'MODERATE', 'SEVERE'
    reaction TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_allergies_patient (patient_id)
);

-- ============================================
-- ADD NEW COLUMNS TO EXISTING TABLES
-- ============================================

-- Add profile picture and additional fields to doctors
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS license_number VARCHAR(100);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS total_reviews INT DEFAULT 0;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Add profile picture to patients
ALTER TABLE patients ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(20);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Add status tracking to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR(500);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'UNPAID';

-- ============================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(appointment_time);

-- ============================================
-- SAMPLE DATA FOR NEW TABLES
-- ============================================

-- Sample notifications
INSERT INTO notifications (user_type, user_id, title, message, type) VALUES
('PATIENT', 1, 'Appointment Reminder', 'Your appointment with Dr. John Smith is tomorrow at 09:00 AM', 'REMINDER'),
('DOCTOR', 1, 'New Appointment', 'New appointment booked by Alice Brown for Dec 1, 2025', 'APPOINTMENT'),
('PATIENT', 2, 'Prescription Ready', 'Your prescription is ready for pickup', 'PRESCRIPTION');

-- Sample reviews
INSERT INTO doctor_reviews (doctor_id, patient_id, appointment_id, rating, comment) VALUES
(2, 3, 3, 5, 'Excellent doctor! Very patient and thorough with the examination.'),
(1, 3, 9, 4, 'Good experience, wait time was a bit long but the consultation was worth it.');

-- Sample payments
INSERT INTO payments (appointment_id, patient_id, amount, payment_method, payment_status, paid_at) VALUES
(3, 3, 120.00, 'CREDIT_CARD', 'COMPLETED', '2025-11-20 13:30:00'),
(9, 3, 150.00, 'INSURANCE', 'COMPLETED', '2025-11-15 14:30:00');

-- Sample medical history
INSERT INTO medical_history (patient_id, condition_name, diagnosed_date, status, notes) VALUES
(1, 'Hypertension', '2020-03-15', 'CHRONIC', 'Controlled with medication'),
(3, 'Seasonal Allergies', '2018-05-20', 'ACTIVE', 'Allergic to pollen'),
(5, 'Appendicitis', '2019-08-10', 'RESOLVED', 'Appendectomy performed');

-- Sample allergies
INSERT INTO allergies (patient_id, allergen, severity, reaction) VALUES
(1, 'Penicillin', 'SEVERE', 'Anaphylaxis'),
(3, 'Pollen', 'MODERATE', 'Sneezing, runny nose'),
(5, 'Peanuts', 'MILD', 'Skin rash');

-- ============================================
-- NEW STORED PROCEDURES
-- ============================================

-- Get Doctor Average Rating
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetDoctorAverageRating(
    IN p_doctor_id BIGINT
)
BEGIN
    SELECT 
        d.id,
        d.name,
        d.specialty,
        COALESCE(AVG(dr.rating), 0) AS average_rating,
        COUNT(dr.id) AS total_reviews
    FROM doctors d
    LEFT JOIN doctor_reviews dr ON d.id = dr.doctor_id
    WHERE d.id = p_doctor_id
    GROUP BY d.id, d.name, d.specialty;
END //
DELIMITER ;

-- Get Patient Medical Summary
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetPatientMedicalSummary(
    IN p_patient_id BIGINT
)
BEGIN
    SELECT 
        p.id,
        p.name,
        p.date_of_birth,
        p.blood_group,
        COUNT(DISTINCT a.id) AS total_appointments,
        COUNT(DISTINCT pr.id) AS total_prescriptions,
        COUNT(DISTINCT mh.id) AS total_conditions,
        COUNT(DISTINCT al.id) AS total_allergies
    FROM patients p
    LEFT JOIN appointments a ON p.id = a.patient_id
    LEFT JOIN prescriptions pr ON p.id = pr.patient_id
    LEFT JOIN medical_history mh ON p.id = mh.patient_id
    LEFT JOIN allergies al ON p.id = al.patient_id
    WHERE p.id = p_patient_id
    GROUP BY p.id, p.name, p.date_of_birth, p.blood_group;
END //
DELIMITER ;

-- Get Monthly Revenue Report
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetMonthlyRevenueReport(
    IN p_year INT,
    IN p_month INT
)
BEGIN
    SELECT 
        DATE(a.appointment_time) AS appointment_date,
        COUNT(DISTINCT a.id) AS total_appointments,
        COUNT(DISTINCT CASE WHEN p.payment_status = 'COMPLETED' THEN p.id END) AS paid_appointments,
        COALESCE(SUM(CASE WHEN p.payment_status = 'COMPLETED' THEN p.amount ELSE 0 END), 0) AS total_revenue,
        COALESCE(AVG(CASE WHEN p.payment_status = 'COMPLETED' THEN p.amount END), 0) AS average_payment
    FROM appointments a
    LEFT JOIN payments p ON a.id = p.appointment_id
    WHERE YEAR(a.appointment_time) = p_year 
        AND MONTH(a.appointment_time) = p_month
    GROUP BY DATE(a.appointment_time)
    ORDER BY appointment_date;
END //
DELIMITER ;

-- ============================================
-- VERIFICATION
-- ============================================

SHOW TABLES;

-- Verify new tables have data
SELECT COUNT(*) AS notifications_count FROM notifications;
SELECT COUNT(*) AS reviews_count FROM doctor_reviews;
SELECT COUNT(*) AS payments_count FROM payments;
SELECT COUNT(*) AS medical_history_count FROM medical_history;
SELECT COUNT(*) AS allergies_count FROM allergies;
