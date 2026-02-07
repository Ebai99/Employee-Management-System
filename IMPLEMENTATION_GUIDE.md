# COMPLETE IMPLEMENTATION PROMPT - Employee Management System
# Full-Stack Development Guide

## 🎯 PROJECT GOAL
Build a fully functional Employee Management System with three role-based dashboards (Admin, Manager, Employee) connected to the existing Node.js/Express backend API.

---

## 📋 PREREQUISITES (Already Complete ✓)

You already have:
- ✓ Backend API with Express.js + MySQL
- ✓ Complete database schema
- ✓ Authentication system (JWT)
- ✓ Role-based middleware
- ✓ All API routes defined
- ✓ HTML dashboard templates
- ✓ Basic CSS styling
- ✓ API wrapper (`api.js`)
- ✓ Login system working

**What you need to build:** Connect frontend dashboards to backend APIs and implement all interactive features.

---

## 🏗️ IMPLEMENTATION PHASES

### PHASE 1: ADMIN DASHBOARD - Complete Implementation

**Objective:** Build a fully functional admin dashboard with employee management, manager assignment, and system monitoring.

#### 1.1 - Dashboard Overview Page
```javascript
// File: frontend/admin/script.js

// TASK: Fetch and display dashboard statistics
async function loadDashboardStats() {
  /* 
   * API Endpoint: GET /api/admin/dashboard
   * 
   * Display:
   * - Total employees count
   * - Active employees count
   * - Total managers count
   * - Today's attendance count
   * - Recent activities (last 5)
   * 
   * Update DOM elements with these stats
   */
}

// TASK: Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  // Load dashboard stats
  // Load user info
  // Initialize sidebar
});
```

**Required DOM Structure in `dashboard.html`:**
```html
<div class="stats-grid">
  <div class="stat-card">
    <h3 id="totalEmployees">0</h3>
    <p>Total Employees</p>
  </div>
  <div class="stat-card">
    <h3 id="activeEmployees">0</h3>
    <p>Active Employees</p>
  </div>
  <div class="stat-card">
    <h3 id="totalManagers">0</h3>
    <p>Managers</p>
  </div>
  <div class="stat-card">
    <h3 id="todayAttendance">0</h3>
    <p>Today's Attendance</p>
  </div>
</div>
```

#### 1.2 - Employee Management Module
```javascript
// TASK: Employee List with Search and Filter
async function loadEmployees(searchQuery = '', status = 'all') {
  /*
   * API Endpoint: GET /api/admin/employees
   * Query params: ?search=${searchQuery}&status=${status}
   * 
   * Steps:
   * 1. Fetch employees from API
   * 2. Build table rows dynamically
   * 3. Add action buttons (View, Edit, Disable/Enable, Delete)
   * 4. Handle empty state
   */
  
  const response = await apiRequest(`/admin/employees?search=${searchQuery}&status=${status}`);
  
  if (!response.success) {
    showToast('Failed to load employees', 'error');
    return;
  }
  
  renderEmployeeTable(response.data);
}

function renderEmployeeTable(employees) {
  const tbody = document.getElementById('employeeTableBody');
  
  if (employees.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No employees found</td></tr>';
    return;
  }
  
  tbody.innerHTML = employees.map(emp => `
    <tr>
      <td>${emp.employee_code}</td>
      <td>${emp.firstname} ${emp.lastname}</td>
      <td>${emp.email}</td>
      <td>
        <span class="badge ${emp.status.toLowerCase()}">
          ${emp.status}
        </span>
      </td>
      <td>${emp.manager_name || 'Not Assigned'}</td>
      <td>
        <button onclick="viewEmployee('${emp.employee_code}')" class="btn-sm">View</button>
        <button onclick="editEmployee('${emp.employee_code}')" class="btn-sm">Edit</button>
        ${emp.status === 'ACTIVE' 
          ? `<button onclick="disableEmployee('${emp.employee_code}')" class="btn-sm btn-danger">Disable</button>`
          : `<button onclick="activateEmployee('${emp.employee_code}')" class="btn-sm btn-success">Activate</button>`
        }
      </td>
    </tr>
  `).join('');
}

// TASK: Create New Employee
async function createEmployee(formData) {
  /*
   * API Endpoint: POST /api/admin/employees
   * 
   * Required fields:
   * - firstname
   * - lastname
   * - email
   * - manager_id (optional)
   * 
   * Response includes: employee details + auto-generated access_code
   * 
   * Steps:
   * 1. Validate form data
   * 2. Send POST request
   * 3. Show success message with access code
   * 4. Refresh employee list
   * 5. Close modal
   */
}

// TASK: Edit Employee
async function editEmployee(employeeCode) {
  /*
   * Steps:
   * 1. Fetch employee details: GET /api/admin/employees/${employeeCode}
   * 2. Populate edit form modal
   * 3. On submit: PUT /api/admin/employees/${employeeCode}
   * 4. Refresh list
   */
}

// TASK: Disable/Activate Employee
async function disableEmployee(employeeCode) {
  /*
   * API Endpoint: PATCH /api/admin/employees/${employeeCode}/disable
   * 
   * Steps:
   * 1. Show confirmation dialog
   * 2. Send request
   * 3. Update UI (change badge, button)
   * 4. Show success message
   */
}

async function activateEmployee(employeeCode) {
  /*
   * API Endpoint: PATCH /api/admin/employees/${employeeCode}/activate
   */
}
```

**Required HTML Structure:**
```html
<!-- Employee Management Section -->
<section id="employeesSection" class="content-section" style="display: none;">
  <div class="section-header">
    <h2>Employee Management</h2>
    <button onclick="showCreateEmployeeModal()" class="btn-primary">
      + Add Employee
    </button>
  </div>
  
  <!-- Search and Filter -->
  <div class="filters">
    <input 
      type="text" 
      id="employeeSearch" 
      placeholder="Search by name, email, or code..."
      onkeyup="handleEmployeeSearch()"
    />
    <select id="statusFilter" onchange="handleStatusFilter()">
      <option value="all">All Status</option>
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
      <option value="SUSPENDED">Suspended</option>
    </select>
  </div>
  
  <!-- Employee Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th>Employee Code</th>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Manager</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="employeeTableBody">
      <!-- Dynamic content -->
    </tbody>
  </table>
</section>

<!-- Create Employee Modal -->
<div id="createEmployeeModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Add New Employee</h3>
      <button onclick="closeModal('createEmployeeModal')">&times;</button>
    </div>
    <form id="createEmployeeForm" onsubmit="handleCreateEmployee(event)">
      <div class="form-group">
        <label>First Name *</label>
        <input type="text" name="firstname" required />
      </div>
      <div class="form-group">
        <label>Last Name *</label>
        <input type="text" name="lastname" required />
      </div>
      <div class="form-group">
        <label>Email *</label>
        <input type="email" name="email" required />
      </div>
      <div class="form-group">
        <label>Assign Manager (Optional)</label>
        <select name="manager_id" id="managerSelect">
          <option value="">No Manager</option>
          <!-- Dynamic manager list -->
        </select>
      </div>
      <div class="modal-footer">
        <button type="button" onclick="closeModal('createEmployeeModal')">Cancel</button>
        <button type="submit" class="btn-primary">Create Employee</button>
      </div>
    </form>
  </div>
</div>

<!-- Access Code Display Modal -->
<div id="accessCodeModal" class="modal">
  <div class="modal-content">
    <h3>Employee Created Successfully!</h3>
    <div class="access-code-display">
      <p>Employee Code: <strong id="displayEmployeeCode"></strong></p>
      <p>Access Code: <strong id="displayAccessCode" class="highlight"></strong></p>
      <small>⚠️ Save this access code! It cannot be retrieved later.</small>
    </div>
    <button onclick="closeModal('accessCodeModal')" class="btn-primary">OK</button>
  </div>
</div>
```

#### 1.3 - Manager Assignment Module
```javascript
// TASK: Assign Manager to Employee
async function showAssignManagerModal(employeeCode) {
  /*
   * Steps:
   * 1. Fetch list of all managers: GET /api/admin/managers
   * 2. Show modal with manager dropdown
   * 3. On submit: POST /api/admin/assign-manager
   *    Body: { employee_code, manager_id }
   * 4. Update employee list
   */
}

// TASK: Load Managers for Dropdown
async function loadManagers() {
  const response = await apiRequest('/admin/managers');
  const select = document.getElementById('managerSelect');
  
  select.innerHTML = '<option value="">No Manager</option>';
  
  if (response.success) {
    response.data.forEach(manager => {
      select.innerHTML += `<option value="${manager.id}">${manager.name}</option>`;
    });
  }
}
```

#### 1.4 - Activity Logs Module
```javascript
// TASK: Display Activity Logs
async function loadActivityLogs(page = 1, limit = 20) {
  /*
   * API Endpoint: GET /api/audit/logs?page=${page}&limit=${limit}
   * 
   * Display:
   * - Actor name
   * - Action performed
   * - Entity affected
   * - Timestamp
   * - IP address
   * 
   * Include pagination
   */
}
```

#### 1.5 - Navigation System
```javascript
// TASK: Single Page Application Navigation
function navigateTo(sectionId) {
  /*
   * Steps:
   * 1. Hide all sections
   * 2. Show selected section
   * 3. Update active nav link
   * 4. Load section data if needed
   * 
   * Sections:
   * - dashboard (default)
   * - employees
   * - reports
   * - activityLogs
   * - settings
   */
  
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionId + 'Section').style.display = 'block';
  
  // Add active class to current nav link
  event.target.closest('.nav-link').classList.add('active');
  
  // Load data based on section
  switch(sectionId) {
    case 'dashboard':
      loadDashboardStats();
      break;
    case 'employees':
      loadEmployees();
      break;
    case 'activityLogs':
      loadActivityLogs();
      break;
  }
}
```

---

### PHASE 2: MANAGER DASHBOARD - Complete Implementation

**Objective:** Build manager dashboard to view and manage assigned team members.

#### 2.1 - Team Overview
```javascript
// File: frontend/manager/script.js

// TASK: Load Team Statistics
async function loadTeamStats() {
  /*
   * API Endpoint: GET /api/manager/dashboard
   * 
   * Display:
   * - Total team members
   * - Present today
   * - On break
   * - Active tasks
   * - Team performance score
   */
}

// TASK: Load Team Members
async function loadTeamMembers() {
  /*
   * API Endpoint: GET /api/manager/team
   * 
   * Display:
   * - Employee name, code
   * - Current status (Present/Absent/On Break)
   * - Today's hours
   * - Active tasks
   */
}
```

#### 2.2 - Team Attendance Monitoring
```javascript
// TASK: Real-time Team Attendance
async function loadTeamAttendance(date = new Date()) {
  /*
   * API Endpoint: GET /api/manager/team/attendance?date=${date}
   * 
   * Display:
   * - Clock in time
   * - Current status
   * - Total hours
   * - Break time
   * 
   * Auto-refresh every 60 seconds
   */
  
  setInterval(() => loadTeamAttendance(date), 60000);
}
```

#### 2.3 - Task Assignment
```javascript
// TASK: Create Task for Team Member
async function assignTaskToEmployee(taskData) {
  /*
   * API Endpoint: POST /api/tasks
   * 
   * Required fields:
   * - employee_id
   * - title
   * - description
   * - priority (low/medium/high)
   * - deadline
   * 
   * Steps:
   * 1. Show task creation modal
   * 2. Populate employee dropdown
   * 3. Submit task
   * 4. Refresh task list
   */
}

// TASK: View Team Tasks
async function loadTeamTasks(filter = 'all') {
  /*
   * API Endpoint: GET /api/manager/team/tasks?status=${filter}
   * 
   * Filters: all, pending, active, completed
   * 
   * Display:
   * - Task title
   * - Assigned to
   * - Priority
   * - Status
   * - Deadline
   * - Actions (view, edit, delete)
   */
}
```

#### 2.4 - Team Reports
```javascript
// TASK: Generate Team Performance Report
async function generateTeamReport(startDate, endDate) {
  /*
   * API Endpoint: POST /api/reports/generate
   * Body: { type: 'team', start_date, end_date }
   * 
   * Display:
   * - Total attendance hours
   * - Tasks completed
   * - Average productivity
   * - Top performers
   * 
   * Export options: CSV, PDF
   */
}
```

---

### PHASE 3: EMPLOYEE DASHBOARD - Complete Implementation

**Objective:** Build employee dashboard for attendance, breaks, tasks, and personal reports.

#### 3.1 - Attendance Management
```javascript
// File: frontend/employee/script.js

// TASK: Clock In/Out System
async function handleClockIn() {
  /*
   * API Endpoint: POST /api/attendance/clock-in
   * 
   * Steps:
   * 1. Check if already clocked in
   * 2. Send clock-in request
   * 3. Update UI (show clock-out button, current time)
   * 4. Start time tracker
   */
  
  const response = await apiRequest('/attendance/clock-in', 'POST');
  
  if (response.success) {
    showToast('Clocked in successfully!', 'success');
    updateAttendanceUI('clocked-in');
    startTimeTracker(response.data.clock_in);
  }
}

async function handleClockOut() {
  /*
   * API Endpoint: POST /api/attendance/clock-out
   * 
   * Steps:
   * 1. Confirm clock-out
   * 2. Send request
   * 3. Display total hours worked
   * 4. Reset UI
   */
}

function startTimeTracker(clockInTime) {
  /*
   * Real-time timer showing:
   * - Time elapsed since clock-in
   * - Current time
   * - Update every second
   */
  
  setInterval(() => {
    const now = new Date();
    const start = new Date(clockInTime);
    const elapsed = now - start;
    
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    document.getElementById('timeElapsed').textContent = 
      `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}
```

**Required HTML:**
```html
<section id="attendanceSection">
  <div class="attendance-card">
    <h3>Attendance</h3>
    
    <!-- Clock In State -->
    <div id="clockedOutState">
      <p>You are currently clocked out</p>
      <button onclick="handleClockIn()" class="btn-primary btn-large">
        🕐 Clock In
      </button>
    </div>
    
    <!-- Clock Out State -->
    <div id="clockedInState" style="display: none;">
      <div class="time-display">
        <p>Time Elapsed</p>
        <h2 id="timeElapsed">0h 0m 0s</h2>
      </div>
      <p>Clocked in at: <span id="clockInTime"></span></p>
      <button onclick="handleClockOut()" class="btn-danger btn-large">
        🕐 Clock Out
      </button>
    </div>
  </div>
  
  <!-- Attendance History -->
  <div class="attendance-history">
    <h4>Recent Attendance</h4>
    <table id="attendanceHistoryTable">
      <!-- Dynamic content -->
    </table>
  </div>
</section>
```

#### 3.2 - Break Management
```javascript
// TASK: Break System
async function startBreak() {
  /*
   * API Endpoint: POST /api/breaks/start
   * 
   * Requirements:
   * - Must be clocked in
   * - Cannot have active break
   * 
   * Steps:
   * 1. Validate can start break
   * 2. Send request
   * 3. Update UI (show end break button)
   * 4. Start break timer
   */
}

async function endBreak() {
  /*
   * API Endpoint: POST /api/breaks/end
   * 
   * Steps:
   * 1. Send request
   * 2. Display break duration
   * 3. Update break history
   * 4. Reset break UI
   */
}

async function loadBreakHistory() {
  /*
   * API Endpoint: GET /api/breaks/history
   * 
   * Display:
   * - Break start time
   * - Break end time
   * - Duration
   * - Date
   */
}
```

#### 3.3 - Task Management
```javascript
// TASK: View Assigned Tasks
async function loadMyTasks(filter = 'all') {
  /*
   * API Endpoint: GET /api/tasks?status=${filter}
   * 
   * Display:
   * - Task title, description
   * - Priority badge
   * - Deadline
   * - Status
   * - Time spent
   * - Actions (Start, Stop, Complete)
   */
}

// TASK: Task Timer
async function startTaskTimer(taskId) {
  /*
   * API Endpoint: POST /api/tasks/${taskId}/start
   * 
   * Steps:
   * 1. Record start time in task_logs
   * 2. Show active timer
   * 3. Update UI (show stop button)
   */
}

async function stopTaskTimer(taskId) {
  /*
   * API Endpoint: POST /api/tasks/${taskId}/stop
   * 
   * Steps:
   * 1. Record end time
   * 2. Calculate duration
   * 3. Update task_logs
   * 4. Update UI
   */
}

async function completeTask(taskId) {
  /*
   * API Endpoint: POST /api/tasks/${taskId}/complete
   * 
   * Steps:
   * 1. Confirm completion
   * 2. Update task status to 'completed'
   * 3. Stop any active timers
   * 4. Refresh task list
   */
}
```

#### 3.4 - Personal Reports
```javascript
// TASK: View Personal Performance
async function loadPersonalReport(period = 'week') {
  /*
   * API Endpoint: GET /api/reports?period=${period}
   * 
   * Display:
   * - Total hours worked
   * - Tasks completed
   * - Average hours per day
   * - Attendance rate
   * - Break time
   * 
   * Periods: day, week, month
   * 
   * Include charts:
   * - Attendance trend
   * - Task completion rate
   */
}
```

---

### PHASE 4: SHARED COMPONENTS & UTILITIES

#### 4.1 - Enhanced UI Utilities
```javascript
// File: frontend/assets/js/ui.js

// TASK: Toast Notification System
function showToast(message, type = 'info', duration = 3000) {
  /*
   * Types: success, error, warning, info
   * 
   * Implementation:
   * 1. Create toast element
   * 2. Add to DOM
   * 3. Animate in
   * 4. Auto-remove after duration
   */
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Animate out and remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// TASK: Loading Overlay
function showLoader(message = 'Loading...') {
  const loader = document.getElementById('loader') || createLoader();
  loader.querySelector('.loader-text').textContent = message;
  loader.style.display = 'flex';
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
}

// TASK: Confirmation Dialog
async function confirmDialog(message, title = 'Confirm') {
  /*
   * Returns: Promise<boolean>
   * 
   * Implementation:
   * 1. Show modal with message
   * 2. Return promise
   * 3. Resolve true on confirm, false on cancel
   */
  
  return new Promise((resolve) => {
    const modal = createConfirmModal(title, message, resolve);
    document.body.appendChild(modal);
  });
}

// TASK: Date Formatting
function formatDate(date, format = 'YYYY-MM-DD') {
  /*
   * Formats: 
   * - 'YYYY-MM-DD': 2024-02-07
   * - 'DD/MM/YYYY': 07/02/2024
   * - 'MMM DD, YYYY': Feb 07, 2024
   * - 'HH:mm': 14:30
   * - 'HH:mm:ss': 14:30:45
   */
}

// TASK: Form Validation
function validateForm(formId, rules) {
  /*
   * Rules example:
   * {
   *   email: { required: true, type: 'email' },
   *   name: { required: true, minLength: 3 },
   *   age: { required: true, type: 'number', min: 18 }
   * }
   * 
   * Returns: { valid: boolean, errors: {} }
   */
}
```

#### 4.2 - Chart Utilities
```javascript
// File: frontend/assets/js/charts.js

// TASK: Attendance Chart
function renderAttendanceChart(data, canvasId) {
  /*
   * Chart.js Line Chart
   * 
   * X-axis: Dates
   * Y-axis: Hours
   * 
   * Data format:
   * [
   *   { date: '2024-02-01', hours: 8 },
   *   { date: '2024-02-02', hours: 7.5 }
   * ]
   */
  
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => formatDate(d.date, 'MMM DD')),
      datasets: [{
        label: 'Hours Worked',
        data: data.map(d => d.hours),
        borderColor: '#4A90E2',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: 'Attendance Trend' }
      }
    }
  });
}

// TASK: Task Status Chart
function renderTaskChart(data, canvasId) {
  /*
   * Chart.js Doughnut Chart
   * 
   * Data format:
   * {
   *   pending: 5,
   *   active: 3,
   *   completed: 12
   * }
   */
  
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pending', 'Active', 'Completed'],
      datasets: [{
        data: [data.pending, data.active, data.completed],
        backgroundColor: ['#FFC107', '#2196F3', '#4CAF50']
      }]
    }
  });
}

// TASK: Performance Chart
function renderPerformanceChart(data, canvasId) {
  /*
   * Chart.js Bar Chart
   * 
   * Shows daily productivity score
   */
}
```

#### 4.3 - Authentication Guard
```javascript
// File: frontend/assets/js/auth.js (additions)

// TASK: Check Authentication on Page Load
function checkAuth() {
  /*
   * Steps:
   * 1. Get token from localStorage
   * 2. If no token, redirect to login
   * 3. Verify token is valid (check expiration)
   * 4. If invalid, redirect to login
   * 5. Load user data
   */
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    window.location.href = '/index.html';
    return false;
  }
  
  // Decode JWT to check expiration
  const payload = parseJwt(token);
  const now = Date.now() / 1000;
  
  if (payload.exp < now) {
    localStorage.clear();
    window.location.href = '/index.html';
    return false;
  }
  
  return true;
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}

// TASK: Logout Function
function logout() {
  /*
   * Steps:
   * 1. Clear localStorage
   * 2. Optional: Call logout API
   * 3. Redirect to login
   */
  
  localStorage.clear();
  window.location.href = '/index.html';
}

// Add to all dashboard pages
document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  
  // Initialize dashboard
  initDashboard();
});
```

---

### PHASE 5: ERROR HANDLING & UX IMPROVEMENTS

#### 5.1 - Global Error Handler
```javascript
// Add to all dashboard scripts

// TASK: Handle API Errors Gracefully
async function handleApiError(error, context = '') {
  /*
   * Error types:
   * - 401: Unauthorized (token expired)
   * - 403: Forbidden (insufficient permissions)
   * - 404: Not found
   * - 500: Server error
   * - Network error
   * 
   * Actions:
   * - Show user-friendly message
   * - Log error for debugging
   * - Handle token expiration
   */
  
  console.error(`Error in ${context}:`, error);
  
  if (error.status === 401) {
    showToast('Session expired. Please login again.', 'error');
    setTimeout(() => logout(), 2000);
    return;
  }
  
  if (error.status === 403) {
    showToast('You do not have permission for this action.', 'error');
    return;
  }
  
  if (error.status === 404) {
    showToast('Resource not found.', 'error');
    return;
  }
  
  if (error.status >= 500) {
    showToast('Server error. Please try again later.', 'error');
    return;
  }
  
  showToast(error.message || 'An error occurred', 'error');
}

// Wrap all API calls
async function safeApiRequest(endpoint, method, body, context) {
  try {
    showLoader();
    const response = await apiRequest(endpoint, method, body);
    hideLoader();
    
    if (!response.success) {
      throw response;
    }
    
    return response;
  } catch (error) {
    hideLoader();
    handleApiError(error, context);
    throw error;
  }
}
```

#### 5.2 - Loading States
```javascript
// TASK: Show Loading During Data Fetch
async function loadDataWithLoading(fetchFunction, loadingMessage) {
  showLoader(loadingMessage);
  try {
    await fetchFunction();
  } finally {
    hideLoader();
  }
}

// Usage:
loadDataWithLoading(
  () => loadEmployees(), 
  'Loading employees...'
);
```

#### 5.3 - Empty States
```html
<!-- Add to tables when no data -->
<div class="empty-state">
  <div class="empty-icon">📭</div>
  <h3>No employees found</h3>
  <p>Get started by adding your first employee</p>
  <button onclick="showCreateEmployeeModal()" class="btn-primary">
    Add Employee
  </button>
</div>
```

---

### PHASE 6: REAL-TIME FEATURES

#### 6.1 - Auto-Refresh
```javascript
// TASK: Auto-refresh Dashboard Data
function setupAutoRefresh(refreshFunction, interval = 60000) {
  /*
   * Refresh dashboard data every minute
   * 
   * Use cases:
   * - Team attendance status
   * - Active tasks
   * - Time trackers
   */
  
  setInterval(refreshFunction, interval);
}

// Usage in manager dashboard:
setupAutoRefresh(() => loadTeamAttendance(), 60000);
```

#### 6.2 - Live Time Display
```javascript
// TASK: Update Current Time
function updateClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById('currentTime').textContent = 
      formatDate(now, 'HH:mm:ss');
  }, 1000);
}
```

---

### PHASE 7: EXPORT FUNCTIONALITY

#### 7.1 - CSV Export
```javascript
// TASK: Export Data to CSV
async function exportToCSV(type, filters = {}) {
  /*
   * API Endpoints:
   * - GET /api/export/attendance/csv
   * - GET /api/export/tasks/csv
   * 
   * Steps:
   * 1. Request CSV data from API
   * 2. Create blob
   * 3. Trigger download
   */
  
  const response = await apiRequest(`/export/${type}/csv`, 'GET');
  
  const blob = new Blob([response.data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-${new Date().toISOString()}.csv`;
  a.click();
}
```

#### 7.2 - PDF Export
```javascript
// TASK: Export Reports to PDF
async function exportToPDF(reportType, data) {
  /*
   * API Endpoint: GET /api/export/reports/pdf?type=${reportType}
   * 
   * Returns: PDF blob
   */
  
  const response = await fetch(
    `${API_BASE}/export/reports/pdf?type=${reportType}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  window.open(url);
}
```

---

## 🎨 CSS IMPROVEMENTS

### Required CSS Additions

```css
/* File: frontend/assets/css/components.css */

/* Toast Notifications */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.3s ease;
  z-index: 10000;
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast-success { background: #4CAF50; }
.toast-error { background: #F44336; }
.toast-warning { background: #FF9800; }
.toast-info { background: #2196F3; }

/* Loading Overlay */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}

.modal.show {
  display: flex;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

/* Status Badges */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

.badge.active { background: #E8F5E9; color: #4CAF50; }
.badge.inactive { background: #FFEBEE; color: #F44336; }
.badge.pending { background: #FFF3E0; color: #FF9800; }
.badge.completed { background: #E3F2FD; color: #2196F3; }

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #757575;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

/* Priority Badges */
.priority-high { color: #F44336; }
.priority-medium { color: #FF9800; }
.priority-low { color: #4CAF50; }
```

---

## 🧪 TESTING CHECKLIST

### For Each Dashboard:

**Admin Dashboard:**
- [ ] Can create employee with all required fields
- [ ] Employee list loads and displays correctly
- [ ] Search filters employees by name/email/code
- [ ] Status filter works (Active/Inactive)
- [ ] Can disable/enable employee
- [ ] Access code displays after employee creation
- [ ] Can assign manager to employee
- [ ] Activity logs display correctly
- [ ] Dashboard stats update in real-time
- [ ] Logout works and redirects to login

**Manager Dashboard:**
- [ ] Team members list displays
- [ ] Team attendance shows correct status
- [ ] Can assign tasks to team members
- [ ] Team tasks list loads
- [ ] Task filters work (All/Pending/Active/Completed)
- [ ] Can view team reports
- [ ] Dashboard stats are accurate
- [ ] Auto-refresh works for attendance

**Employee Dashboard:**
- [ ] Clock in/out works
- [ ] Time tracker counts correctly
- [ ] Can start/end break
- [ ] Break timer works
- [ ] Assigned tasks display
- [ ] Can start/stop task timer
- [ ] Can complete tasks
- [ ] Attendance history shows
- [ ] Personal reports display

**General:**
- [ ] Authentication persists on refresh
- [ ] Token expiration redirects to login
- [ ] Error messages display correctly
- [ ] Loading states show during API calls
- [ ] Toast notifications appear
- [ ] Responsive on mobile
- [ ] All API calls have error handling

---

## 🚀 DEPLOYMENT STEPS

1. **Backend Deployment:**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   
   # Run database migrations
   npm run db:init
   
   # Create admin account
   npm run admin:create
   
   # Start server with PM2
   pm2 start server.js --name employee-system
   ```

2. **Frontend Deployment:**
   - Update API_BASE in `api.js` to production URL
   - Deploy static files to web server
   - Configure CORS on backend for production domain

3. **Database Backup:**
   ```bash
   mysqldump -u root -p employee_management > backup.sql
   ```

---

## 📝 FINAL CHECKLIST

Before considering the project complete:

- [ ] All API endpoints tested and working
- [ ] All three dashboards fully functional
- [ ] Authentication and authorization working
- [ ] Error handling implemented
- [ ] Loading states for all async operations
- [ ] Input validation on all forms
- [ ] Responsive design tested
- [ ] Cross-browser compatibility checked
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] Code commented where necessary
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Production deployment tested

---

## 🆘 TROUBLESHOOTING GUIDE

**Issue: "Token expired" errors**
- Solution: Implement token refresh logic or increase expiration time

**Issue: CORS errors**
- Solution: Check CORS_ORIGIN in backend .env matches frontend URL

**Issue: Data not loading**
- Solution: Check network tab, verify API endpoint, check authentication

**Issue: Database connection failed**
- Solution: Verify MySQL is running, check credentials in .env

**Issue: Employee cannot login**
- Solution: Verify employee is ACTIVE, check access code, review audit logs

---

This prompt provides everything you need to build a complete, production-ready Employee Management System. Start with Phase 1 (Admin Dashboard) and work through each phase systematically.
