-- Smart Clinic Management System - Database Migration Script
-- V2__Add_New_Tables.sql

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
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
    transaction_id VARCHAR(100),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
    INDEX idx_payments_status (status),
    INDEX idx_payments_date (payment_date)
);
