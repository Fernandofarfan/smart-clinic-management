-- SQL Test Queries for Smart Clinic Management System
-- These queries will generate the outputs required for submission

-- ============================================
-- Q19: SHOW TABLES (3 points)
-- ============================================
USE smart_clinic_db;
SHOW TABLES;

-- Expected output: List of all 5 tables
-- admins, appointments, doctors, patients, prescriptions

-- ============================================
-- Q20: SELECT 5 Patient Records (3 points)
-- ============================================
SELECT * FROM patients LIMIT 5;

-- Expected output: 5 patient records with all fields

-- ============================================
-- Q21: GetDailyAppointmentReportByDoctor (3 points)
-- ============================================
-- Call stored procedure for a specific doctor and date
CALL GetDailyAppointmentReportByDoctor(1, '2025-12-01');

-- Expected output: Daily appointment statistics for Doctor ID 1 on Dec 1, 2025

-- ============================================
-- Q22: GetDoctorWithMostPatientsByMonth (3 points)
-- ============================================
-- Call stored procedure for November 2025
CALL GetDoctorWithMostPatientsByMonth(2025, 11);

-- Expected output: Doctor with most unique patients in November 2025

-- ============================================
-- Q23: GetDoctorWithMostPatientsByYear (3 points)
-- ============================================
-- Call stored procedure for year 2025
CALL GetDoctorWithMostPatientsByYear(2025);

-- Expected output: Doctor with most unique patients in 2025

-- ============================================
-- Additional Verification Queries
-- ============================================

-- Verify doctors table
SELECT COUNT(*) as total_doctors FROM doctors;

-- Verify patients table
SELECT COUNT(*) as total_patients FROM patients;

-- Verify appointments table
SELECT COUNT(*) as total_appointments FROM appointments;

-- Verify prescriptions table
SELECT COUNT(*) as total_prescriptions FROM prescriptions;

-- Verify admins table
SELECT COUNT(*) as total_admins FROM admins;
