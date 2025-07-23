-- MySQL Database Setup for Digital Banking System
-- Run this script to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS digital_banking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional - you can use root user)
-- CREATE USER 'banking_user'@'localhost' IDENTIFIED BY 'banking_password';
-- GRANT ALL PRIVILEGES ON digital_banking.* TO 'banking_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Use the database
USE digital_banking;

-- Note: Tables will be created automatically by Hibernate when the application starts
-- The following tables will be created:
-- - users
-- - accounts  
-- - transactions

-- You can verify the tables after running the application with:
-- SHOW TABLES; 