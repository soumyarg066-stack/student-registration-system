# Student Registration System

A simple Student Registration System built with:

- **Frontend:** HTML, CSS, JavaScript (plain, no frameworks)
- **Backend:** Node.js + Express.js
- **Database:** MySQL (via XAMPP)

It lets you register students, view all registered students in a table,
edit their details, and delete them.

---

## 📁 Project Structure

```
student-registration-system/
│
├── public/
│   ├── index.html          -> Home page
│   ├── register.html       -> Student registration form
│   ├── students.html       -> View / edit / delete students
│   ├── css/
│   │   └── style.css       -> All styling
│   └── js/
│       ├── register.js     -> Registration form logic
│       └── students.js     -> Table + edit + delete logic
│
├── server.js                -> Express backend + REST API
├── package.json              -> Node dependencies
├── .env                       -> Database credentials (not committed to git)
├── .gitignore
├── database.sql               -> SQL file to create the database & table
└── README.md
```

---

## ✅ Prerequisites

1. **Node.js** installed on your computer.
2. **XAMPP** installed (for MySQL + phpMyAdmin).
3. **VS Code** (or any code editor).

---

## 🚀 Step-by-Step Setup Instructions

### 1. Install Node.js
Download and install it from https://nodejs.org (choose the LTS version).
To confirm it installed correctly, open a terminal and run:
```
node -v
npm -v
```
Both commands should print a version number.

### 2. Open the project in VS Code
Open VS Code → File → Open Folder → select the `student-registration-system` folder.

### 3. Start XAMPP
Open the XAMPP Control Panel application.

### 4. Start Apache and MySQL
In the XAMPP Control Panel, click **Start** next to both:
- Apache
- MySQL

Wait until both show a green "Running" status.

### 5. Open phpMyAdmin
In XAMPP, click the **Admin** button next to MySQL (or go to
`http://localhost/phpmyadmin` in your browser).

### 6. Import `database.sql`
1. In phpMyAdmin, click the **Import** tab at the top.
2. Click **Choose File** and select `database.sql` from this project.
3. Scroll down and click **Go**.
4. This will automatically create the `student_registration` database and
   the `students` table (with two sample students so you have something
   to view right away).

> Alternatively, you can create the database manually:
> - Click **New** in phpMyAdmin's sidebar, name it `student_registration`, click Create.
> - Select it, go to the **SQL** tab, paste the contents of `database.sql`, and click Go.

### 7. Open the project terminal
In VS Code: **Terminal → New Terminal** (make sure it opens inside the
`student-registration-system` folder).

### 8. Install dependencies
Run:
```
npm install
```
This downloads Express, mysql2, cors, and dotenv into a `node_modules` folder.

### 9. Check your `.env` file
Open `.env` and make sure the values match your XAMPP MySQL setup.
The defaults below work for a standard XAMPP installation:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=student_registration
PORT=3000
```
(By default, XAMPP's MySQL `root` user has **no password**, so
`DB_PASSWORD` is left empty. If you set a password in MySQL, add it here.)

### 10. Start the server
Run:
```
node server.js
```
You should see something like:
```
✅ Successfully connected to MySQL database: student_registration
🚀 Server is running at http://localhost:3000
```

### 11. Open the website
Open your browser and go to:
```
http://localhost:3000
```
This loads the Home page. From there you can go to **Register Student**
or **View Students**.

---

## 🔍 How to Check the MySQL Connection Is Working

- Look at the terminal after running `node server.js`.
  - If you see `✅ Successfully connected to MySQL database: student_registration`,
    the connection is working.
  - If you see `❌ Failed to connect to MySQL database`, check that:
    1. XAMPP's MySQL service is running (green in XAMPP Control Panel).
    2. The `student_registration` database exists in phpMyAdmin.
    3. The values in `.env` match your MySQL setup (host, user, password).
- You can also test it directly by visiting:
  ```
  http://localhost:3000/api/students
  ```
  in your browser. If the connection works, you'll see a JSON response
  with a list of students (including the two sample students from
  `database.sql`). If something is wrong, you'll see an error message.

---

## 🧪 Testing the Features

1. Go to **Register Student**, fill in the form, and click **Register**.
   - Try leaving a field empty or entering an invalid email to see the
     validation messages.
2. Go to **View Students** to see your new student in the table.
3. Click **Edit** on a row to update that student's details.
4. Click **Delete** on a row to remove a student (you'll be asked to confirm first).

---

## 🛠️ Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `❌ Failed to connect to MySQL database` | MySQL not running in XAMPP | Start MySQL in the XAMPP Control Panel |
| "Could not connect to the server" in the browser | `node server.js` isn't running | Run `node server.js` in the terminal |
| Port 3000 already in use | Another program is using port 3000 | Change `PORT` in `.env` to e.g. `3001` and restart the server |
| Table shows "No students registered yet" | Database table is empty | Register a student, or re-import `database.sql` |
| "A student with this ID or Email already exists" | Duplicate Student ID or Email | Use a different Student ID or Email |

---

## 📌 Notes

- This project intentionally has **no login/authentication** to keep it simple.
- Database credentials are stored in `.env` and never hard-coded in the
  JavaScript files.
- The backend uses a **MySQL connection pool** (via `mysql2/promise`) so it
  can handle multiple requests efficiently.
