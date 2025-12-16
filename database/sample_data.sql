-- Sample Data for Smart Clinic Management System
-- Use this to populate the database for demonstration purposes

USE smart_clinic_db;

-- 1. Insert Doctors
INSERT INTO doctors (id, name, email, password, specialty, phone, consultation_fee, is_active, bio, years_of_experience) VALUES 
(1, 'Dr. John Smith', 'john.smith@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Cardiology', '555-0101', 150.00, true, 'Expert in heart diseases', 15),
(2, 'Dr. Sarah Johnson', 'sarah.johnson@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Pediatrics', '555-0102', 120.00, true, 'Caring for children', 10),
(3, 'Dr. Michael Chen', 'michael.chen@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'Orthopedics', '555-0103', 140.00, true, 'Bone specialist', 12)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Patients
INSERT INTO patients (id, name, email, password, phone, date_of_birth, gender, blood_group, is_active) VALUES
(1, 'Alice Brown', 'alice.brown@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '555-1001', '1990-05-15', 'Female', 'A+', true),
(2, 'Bob Martinez', 'bob.martinez@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '555-1002', '1985-08-22', 'Male', 'O+', true),
(3, 'Carol White', 'carol.white@email.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', '555-1003', '1992-03-10', 'Female', 'B-', true)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Appointments
INSERT INTO appointments (doctor_id, patient_id, appointment_time, status, symptoms, notes, created_at, updated_at) VALUES
(1, 1, DATE_ADD(NOW(), INTERVAL 1 day), 'SCHEDULED', 'Chest pain', 'First consultation', NOW(), NOW()),
(1, 2, DATE_ADD(NOW(), INTERVAL 2 day), 'SCHEDULED', 'Routine Checkup', 'Annual visit', NOW(), NOW()),
(2, 3, DATE_SUB(NOW(), INTERVAL 1 day), 'COMPLETED', 'Fever', 'Prescribed antibiotics', NOW(), NOW()),
(3, 1, DATE_ADD(NOW(), INTERVAL 5 day), 'SCHEDULED', 'Knee pain', 'Sports injury', NOW(), NOW());

-- 4. Insert Payments (to verify Revenue stat)
INSERT INTO payments (appointment_id, patient_id, amount, currency, payment_method, payment_status, paid_at, created_at) VALUES
(3, 3, 120.00, 'USD', 'CREDIT_CARD', 'COMPLETED', NOW(), NOW());

-- 5. Insert Doctor Reviews
INSERT INTO doctor_reviews (doctor_id, patient_id, appointment_id, rating, comment, created_at) VALUES
(2, 3, 3, 5, 'Dr. Johnson was great with my child!', NOW());
