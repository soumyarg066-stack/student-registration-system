// =========================================================
// students.js
// Fetches all students from the backend, renders the table,
// and handles Edit / Delete actions.
// =========================================================

const API_URL = '/api/students';

const tableBody = document.getElementById('studentsTableBody');
const emptyState = document.getElementById('emptyState');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');

const editModalOverlay = document.getElementById('editModalOverlay');
const editForm = document.getElementById('editForm');
const editErrorAlert = document.getElementById('editErrorAlert');

// ---- Helpers for showing messages ----
function showAlert(box, message) {
  box.textContent = message;
  box.classList.add('show');
}

function hideAlert(box) {
  box.classList.remove('show');
  box.textContent = '';
}

// ---- Format a MySQL date (YYYY-MM-DDTHH:mm:ss.sssZ) to YYYY-MM-DD ----
function formatDateForDisplay(dateString) {
  if (!dateString) return '';
  return dateString.substring(0, 10);
}

// ---- Load and render all students ----
async function loadStudents() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok || !result.success) {
      showAlert(errorAlert, result.message || 'Failed to load students.');
      return;
    }

    renderTable(result.data);
  } catch (error) {
    console.error('Network or server error:', error);
    showAlert(errorAlert, 'Could not connect to the server. Please make sure the backend is running.');
  }
}

// ---- Build table rows from student data ----
function renderTable(students) {
  tableBody.innerHTML = '';

  if (!students || students.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  students.forEach(student => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${escapeHtml(student.student_id)}</td>
      <td>${escapeHtml(student.full_name)}</td>
      <td>${formatDateForDisplay(student.date_of_birth)}</td>
      <td>${escapeHtml(student.gender)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td>${escapeHtml(student.phone_number)}</td>
      <td>${escapeHtml(student.department)}</td>
      <td>${escapeHtml(student.course)}</td>
      <td>${escapeHtml(student.year)}</td>
      <td>${escapeHtml(student.address)}</td>
      <td>
        <button class="btn btn-primary btn-small" onclick="openEditModal('${student.student_id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteStudent('${student.student_id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// ---- Prevent basic HTML injection when displaying text ----
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// =========================================================
// DELETE STUDENT
// =========================================================
async function deleteStudent(studentId) {
  const confirmed = confirm(`Are you sure you want to delete student "${studentId}"? This cannot be undone.`);
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/${studentId}`, { method: 'DELETE' });
    const result = await response.json();

    if (response.ok && result.success) {
      showAlert(successAlert, 'Student deleted successfully.');
      loadStudents(); // refresh the table
    } else {
      showAlert(errorAlert, result.message || 'Failed to delete student.');
    }
  } catch (error) {
    console.error('Network or server error:', error);
    showAlert(errorAlert, 'Could not connect to the server.');
  }
}

// =========================================================
// EDIT STUDENT
// =========================================================

// ---- Open the modal and pre-fill it with the student's current data ----
async function openEditModal(studentId) {
  hideAlert(editErrorAlert);

  try {
    const response = await fetch(`${API_URL}/${studentId}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      showAlert(errorAlert, result.message || 'Failed to load student details.');
      return;
    }

    const student = result.data;

    document.getElementById('edit_student_id').value = student.student_id;
    document.getElementById('edit_full_name').value = student.full_name;
    document.getElementById('edit_date_of_birth').value = formatDateForDisplay(student.date_of_birth);
    document.getElementById('edit_gender').value = student.gender;
    document.getElementById('edit_email').value = student.email;
    document.getElementById('edit_phone_number').value = student.phone_number;
    document.getElementById('edit_department').value = student.department;
    document.getElementById('edit_course').value = student.course;
    document.getElementById('edit_year').value = student.year;
    document.getElementById('edit_address').value = student.address;

    editModalOverlay.classList.add('show');
  } catch (error) {
    console.error('Network or server error:', error);
    showAlert(errorAlert, 'Could not connect to the server.');
  }
}

function closeEditModal() {
  editModalOverlay.classList.remove('show');
}

document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);

// Close modal if the user clicks outside the modal box
editModalOverlay.addEventListener('click', function (event) {
  if (event.target === editModalOverlay) {
    closeEditModal();
  }
});

// ---- Handle the edit form submission ----
editForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  hideAlert(editErrorAlert);

  const studentId = document.getElementById('edit_student_id').value;

  const data = {
    full_name: document.getElementById('edit_full_name').value,
    date_of_birth: document.getElementById('edit_date_of_birth').value,
    gender: document.getElementById('edit_gender').value,
    email: document.getElementById('edit_email').value,
    phone_number: document.getElementById('edit_phone_number').value,
    department: document.getElementById('edit_department').value,
    course: document.getElementById('edit_course').value,
    year: document.getElementById('edit_year').value,
    address: document.getElementById('edit_address').value
  };

  // Basic validation before sending
  for (const key in data) {
    if (!data[key] || !data[key].toString().trim()) {
      showAlert(editErrorAlert, 'All fields are required.');
      return;
    }
  }

  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      closeEditModal();
      showAlert(successAlert, 'Student updated successfully.');
      loadStudents(); // refresh the table
    } else {
      showAlert(editErrorAlert, result.message || 'Failed to update student.');
    }
  } catch (error) {
    console.error('Network or server error:', error);
    showAlert(editErrorAlert, 'Could not connect to the server.');
  }
});

// ---- Load the students as soon as the page opens ----
loadStudents();
