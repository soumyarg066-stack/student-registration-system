-- =========================================================
-- Student Registration System - Database Setup
-- =========================================================
-- How to use this file:
-- 1. Open phpMyAdmin (via XAMPP).
-- 2. Click "Import" (or run this as an SQL query).
-- 3. Select this file (database.sql) and click "Go".
-- This will create the database, table, and (optionally)
-- some sample data automatically.
-- =========================================================

-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS student_registration;

-- Select the database to use
USE student_registration;

-- Drop the table first if you want a completely fresh start
-- (Uncomment the line below if you need to reset the table)
-- DROP TABLE IF EXISTS students;

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
    student_id     VARCHAR(20)   NOT NULL PRIMARY KEY,
    full_name      VARCHAR(100)  NOT NULL,
    date_of_birth  DATE          NOT NULL,
    gender         ENUM('Male', 'Female', 'Other') NOT NULL,
    email          VARCHAR(100)  NOT NULL UNIQUE,
    phone_number   VARCHAR(20)   NOT NULL,
    department     VARCHAR(100)  NOT NULL,
    course         VARCHAR(100)  NOT NULL,
    year           VARCHAR(20)   NOT NULL,
    address        VARCHAR(255)  NOT NULL,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- (Optional) Insert a couple of sample students so you can test
-- the "View Students" page immediately after setup.
INSERT INTO students
    (student_id, full_name, date_of_birth, gender, email, phone_number, department, course, year, address)
VALUES
    ('STU001', 'John Smith', '2002-05-14', 'Male', 'john.smith@example.com', '0771234567', 'Computer Science', 'BSc Software Engineering', '2', '123 Main Street, Colombo'),
    ('STU002', 'Emily Johnson', '2003-09-22', 'Female', 'emily.johnson@example.com', '0777654321', 'Business', 'BBA Marketing', '1', '45 Lake Road, Kandy')
ON DUPLICATE KEY UPDATE student_id = student_id;
