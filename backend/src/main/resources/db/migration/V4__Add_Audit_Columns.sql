-- V4__Add_Audit_Columns.sql
-- Add created_at and updated_at columns to entities extending BaseEntity

-- Admins
ALTER TABLE admins
ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT NULL;

-- Doctors
ALTER TABLE doctors
ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT NULL;

-- Patients
ALTER TABLE patients
ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT NULL;
