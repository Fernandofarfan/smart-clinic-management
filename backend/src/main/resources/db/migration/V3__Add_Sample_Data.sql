-- Smart Clinic Management System - Database Migration Script
-- V3__Add_Sample_Data.sql

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample doctors
INSERT IGNORE INTO doctors (id, name, email, password, specialty, phone, available_times, bio, years_of_experience, consultation_fee) VALUES
(1, 'Dr. John Smith', 'john.smith@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Cardiology', '+1-555-0101', '["09:00-10:00","10:00-11:00","14:00-15:00","15:00-16:00"]', 'Experienced cardiologist with 15 years of practice', 15, 150.00),
(2, 'Dr. Sarah Johnson', 'sarah.johnson@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Pediatrics', '+1-555-0102', '["08:00-09:00","09:00-10:00","13:00-14:00","14:00-15:00"]', 'Specialist in child healthcare', 10, 120.00),
(3, 'Dr. Michael Chen', 'michael.chen@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Orthopedics', '+1-555-0103', '["10:00-11:00","11:00-12:00","15:00-16:00","16:00-17:00"]', 'Expert in bone and joint treatments', 12, 140.00),
(4, 'Dr. Emily Davis', 'emily.davis@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Dermatology', '+1-555-0104', '["09:00-10:00","11:00-12:00","14:00-15:00"]', 'Skin care specialist', 8, 130.00),
(5, 'Dr. Robert Wilson', 'robert.wilson@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Neurology', '+1-555-0105', '["08:00-09:00","10:00-11:00","15:00-16:00"]', 'Neurological disorders expert', 20, 180.00);

-- Insert sample patients
INSERT IGNORE INTO patients (id, name, email, password, phone, date_of_birth, address, gender, blood_group) VALUES
(1, 'Alice Brown', 'alice.brown@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1001', '1990-05-15', '123 Main St, New York, NY', 'Female', 'A+'),
(2, 'Bob Martinez', 'bob.martinez@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1002', '1985-08-22', '456 Oak Ave, Los Angeles, CA', 'Male', 'O+'),
(3, 'Carol White', 'carol.white@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1003', '1992-03-10', '789 Pine Rd, Chicago, IL', 'Female', 'B+'),
(4, 'David Lee', 'david.lee@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1004', '1988-11-30', '321 Elm St, Houston, TX', 'Male', 'AB+'),
(5, 'Emma Taylor', 'emma.taylor@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1005', '1995-07-18', '654 Maple Dr, Phoenix, AZ', 'Female', 'A-'),
(6, 'Frank Anderson', 'frank.anderson@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1006', '1982-01-25', '987 Cedar Ln, Philadelphia, PA', 'Male', 'O-'),
(7, 'Grace Thomas', 'grace.thomas@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '+1-555-1007', '1998-09-05', '147 Birch Ct, San Antonio, TX', 'Female', 'B-');

-- Insert sample appointments
INSERT IGNORE INTO appointments (id, doctor_id, patient_id, appointment_time, status, symptoms, notes) VALUES
(1, 1, 1, '2025-12-01 09:00:00', 'SCHEDULED', 'Chest pain, shortness of breath', 'First consultation'),
(2, 1, 2, '2025-12-01 10:00:00', 'SCHEDULED', 'High blood pressure', 'Follow-up visit'),
(3, 2, 3, '2025-12-01 08:00:00', 'COMPLETED', 'Child fever and cough', 'Prescribed medication'),
(4, 2, 4, '2025-12-02 09:00:00', 'SCHEDULED', 'Vaccination appointment', 'Annual checkup'),
(5, 3, 5, '2025-12-02 10:00:00', 'SCHEDULED', 'Knee pain', 'Sports injury'),
(6, 3, 6, '2025-12-03 11:00:00', 'SCHEDULED', 'Back pain', 'Chronic condition'),
(7, 4, 7, '2025-12-03 09:00:00', 'SCHEDULED', 'Skin rash', 'Allergic reaction'),
(8, 5, 1, '2025-12-04 08:00:00', 'SCHEDULED', 'Headaches and dizziness', 'Neurological assessment'),
(9, 1, 3, '2025-11-15 14:00:00', 'COMPLETED', 'Heart palpitations', 'ECG performed'),
(10, 2, 5, '2025-11-20 13:00:00', 'COMPLETED', 'Child wellness checkup', 'All normal');

-- Insert sample prescriptions
INSERT IGNORE INTO prescriptions (id, doctor_id, patient_id, appointment_id, medication, dosage, instructions, diagnosis) VALUES
(1, 2, 3, 3, 'Amoxicillin', '500mg three times daily', 'Take with food for 7 days', 'Upper respiratory infection'),
(2, 1, 3, 9, 'Beta-blockers', '25mg once daily', 'Take in the morning', 'Cardiac arrhythmia'),
(3, 2, 5, 10, 'Multivitamins', 'One tablet daily', 'Take with breakfast', 'Routine wellness');
