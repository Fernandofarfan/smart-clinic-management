-- Create test admin user (Password: admin)
-- Using BCrypt hash for 'admin': $2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm
-- Using ON DUPLICATE KEY UPDATE to ensure it works even if admin already exists
INSERT INTO admins (username, email, password, role)
VALUES ('admin', 'admin@smartclinic.com', '$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm', 'ADMIN')
ON DUPLICATE KEY UPDATE password = VALUES(password), email = VALUES(email);

-- Commented out Doctor insert to avoid schema conflicts for now.
-- Focused on establishing Admin access first.
-- INSERT INTO doctors ...
