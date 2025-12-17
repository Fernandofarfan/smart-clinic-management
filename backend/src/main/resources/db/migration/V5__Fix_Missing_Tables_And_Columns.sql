-- V5__Fix_Missing_Tables_And_Columns.sql

DROP PROCEDURE IF EXISTS AddColumnIfNotExists;
DELIMITER $$
CREATE PROCEDURE AddColumnIfNotExists(
    IN tableName VARCHAR(255),
    IN colName VARCHAR(255),
    IN colType VARCHAR(255)
)
BEGIN
    DECLARE colCount INT;
    SELECT COUNT(*) INTO colCount FROM information_schema.columns 
    WHERE table_schema = DATABASE() AND table_name = tableName AND column_name = colName;
    
    IF colCount = 0 THEN
        SET @s = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', colName, ' ', colType);
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$
DELIMITER ;

-- 1. Fix Notifications
CALL AddColumnIfNotExists('notifications', 'updated_at', 'DATETIME');

-- 2. Fix Payments
CALL AddColumnIfNotExists('payments', 'created_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP');
CALL AddColumnIfNotExists('payments', 'updated_at', 'DATETIME');

-- 3. Fix Prescriptions
CALL AddColumnIfNotExists('prescriptions', 'created_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP');
CALL AddColumnIfNotExists('prescriptions', 'updated_at', 'DATETIME');

DROP PROCEDURE AddColumnIfNotExists;

-- 4. Create Medical Records (IF NOT EXISTS is standard)
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT,
    diagnosis TEXT,
    treatment_plan TEXT,
    notes TEXT,
    attachments JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_medical_records_patient (patient_id),
    INDEX idx_medical_records_doctor (doctor_id)
);
