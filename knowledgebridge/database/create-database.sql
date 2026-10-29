-- Run this script in MySQL Workbench as a user allowed to create databases.
CREATE DATABASE IF NOT EXISTS knowledgebridge
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Optional: create a dedicated local application user instead of using root.
-- Uncomment the following statements and choose your own password.
-- CREATE USER IF NOT EXISTS 'kbuser'@'localhost' IDENTIFIED BY 'change-this-password';
-- GRANT ALL PRIVILEGES ON knowledgebridge.* TO 'kbuser'@'localhost';
-- FLUSH PRIVILEGES;
