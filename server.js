// =========================================================
// Student Registration System - Backend Server
// Node.js + Express.js + MySQL (mysql2)
// =========================================================

// ---- Load environment variables from .env ----
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // promise-based version, easier to use with async/await
const path = require('path');

const app = express();

// ---- Middleware ----
app.use(cors());                 // allow frontend to call backend from a different port/origin
app.use(express.json());         // parse incoming JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // serve frontend files (html/css/js)

// ---- MySQL Connection Pool ----
// A pool is used instead of a single connection so multiple requests
// can be handled at the same time without conflicts.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ---- Test the database connection when the server starts ----
async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Successfully connected to MySQL database:', process.env.DB_NAME);
        connection.release();
    } catch (error) {
        console.error('❌ Failed to connect to MySQL database.');
        console.error('   Make sure XAMPP MySQL is running and your .env settings are correct.');
        console.error('   Error details:', error.message);
    }
}
testDatabaseConnection();

// =========================================================
// ROUTES
// =========================================================

// ---- GET all students ----
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching students:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch students from the database.' });
    }
});

// ---- GET a single student by ID ----
app.get('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching student:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch student.' });
    }
});

// ---- POST - Register a new student ----
app.post('/api/students', async (req, res) => {
    try {
        const {
            student_id, full_name, date_of_birth, gender,
            email, phone_number, department, course, year, address
        } = req.body;

        // ---- Basic server-side validation ----
        if (!student_id || !full_name || !date_of_birth || !gender || !email ||
            !phone_number || !department || !course || !year || !address) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // ---- Check if student ID or email already exists ----
        const [existing] = await pool.query(
            'SELECT student_id FROM students WHERE student_id = ? OR email = ?',
            [student_id, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'A student with this ID or Email already exists.' });
        }

        // ---- Insert new student ----
        await pool.query(
            `INSERT INTO students
                (student_id, full_name, date_of_birth, gender, email, phone_number, department, course, year, address)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [student_id, full_name, date_of_birth, gender, email, phone_number, department, course, year, address]
        );

        res.status(201).json({ success: true, message: 'Student registered successfully!' });
    } catch (error) {
        console.error('Error registering student:', error.message);
        res.status(500).json({ success: false, message: 'Failed to register student. Please try again.' });
    }
});

// ---- PUT - Update an existing student ----
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            full_name, date_of_birth, gender,
            email, phone_number, department, course, year, address
        } = req.body;

        if (!full_name || !date_of_birth || !gender || !email ||
            !phone_number || !department || !course || !year || !address) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const [result] = await pool.query(
            `UPDATE students SET
                full_name = ?, date_of_birth = ?, gender = ?, email = ?,
                phone_number = ?, department = ?, course = ?, year = ?, address = ?
             WHERE student_id = ?`,
            [full_name, date_of_birth, gender, email, phone_number, department, course, year, address, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        res.json({ success: true, message: 'Student updated successfully!' });
    } catch (error) {
        console.error('Error updating student:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update student.' });
    }
});

// ---- DELETE a student ----
app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        res.json({ success: true, message: 'Student deleted successfully!' });
    } catch (error) {
        console.error('Error deleting student:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete student.' });
    }
});

// ---- Fallback route for the homepage ----
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =========================================================
// START SERVER
// =========================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
