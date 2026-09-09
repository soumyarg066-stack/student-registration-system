// =========================================================
// register.js
// Handles validation and submission of the student registration form.
// =========================================================

const API_URL = '/api/students'; // backend endpoint (same origin, so relative path works)

const form = document.getElementById('registerForm');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');

// ---- Helper: show a message box ----
function showAlert(box, message) {
  box.textContent = message;
  box.classList.add('show');
}

function hideAlert(box) {
  box.classList.remove('show');
  box.textContent = '';
}

function hideAllAlerts() {
  hideAlert(successAlert);
  hideAlert(errorAlert);
}

// ---- Helper: show/clear a field-level error ----
function setFieldError(fieldName, message) {
  const el = document.getElementById('err_' + fieldName);
  if (el) el.textContent = message || '';
}

function clearAllFieldErrors() {
  const fields = ['student_id', 'full_name', 'date_of_birth', 'gender', 'email',
    'phone_number', 'department', 'course', 'year', 'address'];
  fields.forEach(f => setFieldError(f, ''));
}

// ---- Validation ----
function validateForm(data) {
  let isValid = true;
  clearAllFieldErrors();

  if (!data.student_id.trim()) {
    setFieldError('student_id', 'Student ID is required.');
    isValid = false;
  }

  if (!data.full_name.trim()) {
    setFieldError('full_name', 'Full name is required.');
    isValid = false;
  }

  if (!data.date_of_birth) {
    setFieldError('date_of_birth', 'Date of birth is required.');
    isValid = false;
  }

  if (!data.gender) {
    setFieldError('gender', 'Please select a gender.');
    isValid = false;
  }

  // Simple email pattern check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    setFieldError('email', 'Email is required.');
    isValid = false;
  } else if (!emailPattern.test(data.email.trim())) {
    setFieldError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  // Simple phone check: digits, spaces, +, - allowed, at least 7 digits
  const phoneDigits = data.phone_number.replace(/\D/g, '');
  if (!data.phone_number.trim()) {
    setFieldError('phone_number', 'Phone number is required.');
    isValid = false;
  } else if (phoneDigits.length < 7) {
    setFieldError('phone_number', 'Please enter a valid phone number.');
    isValid = false;
  }

  if (!data.department.trim()) {
    setFieldError('department', 'Department is required.');
    isValid = false;
  }

  if (!data.course.trim()) {
    setFieldError('course', 'Course is required.');
    isValid = false;
  }

  if (!data.year) {
    setFieldError('year', 'Please select a year.');
    isValid = false;
  }

  if (!data.address.trim()) {
    setFieldError('address', 'Address is required.');
    isValid = false;
  }

  return isValid;
}

// ---- Handle form submission ----
form.addEventListener('submit', async function (event) {
  event.preventDefault();
  hideAllAlerts();

  // Collect form data into an object
  const data = {
    student_id: document.getElementById('student_id').value,
    full_name: document.getElementById('full_name').value,
    date_of_birth: document.getElementById('date_of_birth').value,
    gender: document.getElementById('gender').value,
    email: document.getElementById('email').value,
    phone_number: document.getElementById('phone_number').value,
    department: document.getElementById('department').value,
    course: document.getElementById('course').value,
    year: document.getElementById('year').value,
    address: document.getElementById('address').value
  };

  // Validate on the frontend first
  if (!validateForm(data)) {
    showAlert(errorAlert, 'Please fix the errors below and try again.');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showAlert(successAlert, 'Student registered successfully!');
      form.reset();
    } else {
      // Backend returned an error (e.g. duplicate ID/email, missing fields)
      showAlert(errorAlert, result.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Network or server error:', error);
    showAlert(errorAlert, 'Could not connect to the server. Please make sure the backend is running.');
  }
});

// ---- Handle Clear button ----
document.getElementById('clearBtn').addEventListener('click', function () {
  hideAllAlerts();
  clearAllFieldErrors();
});
