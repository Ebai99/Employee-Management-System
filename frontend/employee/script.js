// ======================= EMPLOYEE DASHBOARD =======================

let tasksData = [];
let attendanceData = {};
let timerIntervals = {};
let employeeCharts = {};

// ======================= INITIALIZATION =======================

document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication
  if (!checkAuth() || !hasRole("EMPLOYEE")) {
    window.location.href = "/index.html";
    return;
  }

  // Initialize dashboard
  await initDashboard();
  setupEventListeners();
  setupAutoRefresh();
});

async function initDashboard() {
  try {
    showLoader("Loading dashboard...");

    // Load all dashboard data
    await Promise.all([
      loadAttendanceStatus(),
      loadMyTasks(),
      loadBreakHistory(),
      loadPersonalReport(),
      initCharts(),
    ]);

    updateUserInfo();
    hideLoader();
  } catch (error) {
    hideLoader();
    notifyError("Failed to load dashboard");
    console.error(error);
  }
}

function updateUserInfo() {
  const userStr = localStorage.getItem("user");
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const nameElement = document.querySelector(".user-info .name");
      if (nameElement) {
        const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();
        nameElement.textContent = fullName || user.email || "Employee";
      }
      
      // Update avatar with initials
      const avatar = document.querySelector(".user-profile .avatar");
      if (avatar && user.firstname && user.lastname) {
        avatar.textContent = (user.firstname[0] + user.lastname[0]).toUpperCase();
      }
    } catch (e) {
      console.error("Error parsing user info:", e);
    }
  }
}

// ======================= ATTENDANCE MANAGEMENT =======================

async function loadAttendanceStatus() {
  try {
    // Get status from localStorage since no API endpoint exists
    const clockInTime = localStorage.getItem("clockInTime");
    const status = clockInTime ? "CLOCKED_IN" : "NOT_CLOCKED_IN";

    attendanceData = { status, clock_in_time: clockInTime };

    // Update UI
    const statusEl = document.getElementById("attendanceStatus");
    if (statusEl) {
      statusEl.textContent = status === "CLOCKED_IN" ? "Clocked In" : "Not Clocked In";
      statusEl.className =
        "badge " +
        (status === "CLOCKED_IN" ? "active" : "inactive");
    }

    // Update button states
    const clockInBtn = document.getElementById("clockInBtn");
    const clockOutBtn = document.getElementById("clockOutBtn");

    if (clockInBtn && clockOutBtn) {
      if (status === "CLOCKED_IN") {
        clockInBtn.disabled = true;
        clockOutBtn.disabled = false;
        startTimeTracker(clockInTime);
      } else {
        clockInBtn.disabled = false;
        clockOutBtn.disabled = true;
      }
    }
  } catch (error) {
    console.error("Error loading attendance status:", error);
  }
}

async function handleClockIn() {
  try {
    showLoader("Clocking in...");

    const response = await apiRequest("/attendance/clock-in", "POST");
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to clock in");
      return;
    }

    attendanceData = response.data || {};
    const clockInTime = new Date().toISOString();
    localStorage.setItem("clockInTime", clockInTime);
    await loadAttendanceStatus();
    notifySuccess("Clocked in successfully!");
  } catch (error) {
    hideLoader();
    notifyError("Error clocking in");
    console.error(error);
  }
}

async function handleClockOut() {
  try {
    showLoader("Clocking out...");

    const response = await apiRequest("/attendance/clock-out", "POST");
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to clock out");
      return;
    }

    attendanceData = {};
    localStorage.removeItem("clockInTime");
    await loadAttendanceStatus();
    notifySuccess("Clocked out successfully!");
  } catch (error) {
    hideLoader();
    notifyError("Error clocking out");
    console.error(error);
  }
}

function startTimeTracker(clockInTime) {
  if (!clockInTime) return;

  const updateTime = () => {
    const elapsed = Math.floor((new Date() - new Date(clockInTime)) / 1000);
    const timeEl = document.getElementById("hoursWorked");
    if (timeEl) {
      timeEl.textContent = formatTime(elapsed);
    }
  };

  updateTime();
  if (timerIntervals.attendance) clearInterval(timerIntervals.attendance);
  timerIntervals.attendance = setInterval(updateTime, 1000);
}

// ======================= BREAK MANAGEMENT =======================

async function startBreak() {
  try {
    showLoader("Starting break...");

    const response = await apiRequest("/breaks/start", "POST");
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to start break");
      return;
    }

    const breakStatus = document.getElementById("breakStatus");
    if (breakStatus) breakStatus.textContent = "On Break";
    
    localStorage.setItem("breakStartTime", new Date().toISOString());
    notifySuccess("Break started!");
  } catch (error) {
    hideLoader();
    notifyError("Error starting break");
    console.error(error);
  }
}

async function endBreak() {
  try {
    showLoader("Ending break...");

    const response = await apiRequest("/breaks/end", "POST");
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to end break");
      return;
    }

    const breakStatus = document.getElementById("breakStatus");
    if (breakStatus) breakStatus.textContent = "Working";
    
    localStorage.removeItem("breakStartTime");
    notifySuccess("Break ended!");
  } catch (error) {
    hideLoader();
    notifyError("Error ending break");
    console.error(error);
  }
}

async function loadBreakHistory() {
  try {
    const response = await apiRequest("/employee/breaks/history");

    if (!response.success) return;

    const container = document.getElementById("breakHistory");
    if (!container || !response.data) return;

    const breaks = response.data;
    if (breaks && breaks.length > 0) {
      container.innerHTML = breaks
        .slice(0, 5)
        .map(
          (br) => `
        <div style="padding: 10px 0; border-bottom: 1px solid #21262d;">
          <div style="display: flex; justify-content: space-between;">
            <span>${formatDate(br.break_start_time, "DD MMM HH:MM")}</span>
            <span style="font-size: 12px; color: #8b949e;">
              ${formatTime(br.break_duration || 0)}
            </span>
          </div>
        </div>
      `,
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading break history:", error);
  }
}

// ======================= TASKS =======================

async function loadMyTasks(filter = "all") {
  try {
    const response = await apiRequest("/tasks/employee/assigned");
    console.log("Tasks API Response:", response);

    if (!response.success) {
      console.error("Failed to load tasks:", response.message);
      tasksData = [];
      renderTasks();
      return;
    }

    tasksData = response.data || [];
    console.log("Tasks loaded:", tasksData);
    
    // Filter tasks based on status
    let filteredTasks = tasksData;
    if (filter === "pending") {
      filteredTasks = tasksData.filter(t => t.status === "pending");
    } else if (filter === "active") {
      filteredTasks = tasksData.filter(t => t.status === "active");
    } else if (filter === "completed") {
      filteredTasks = tasksData.filter(t => t.status === "completed");
    }
    
    console.log(`Filtered tasks (${filter}):`, filteredTasks);
    renderTasks(filteredTasks);
  } catch (error) {
    console.error("Error loading tasks:", error);
    tasksData = [];
    renderTasks([]);
  }
}

function formatDateDisplay(date) {
  if (!date) return "No deadline";
  const d = new Date(date);
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${month[d.getMonth()]} ${d.getFullYear()}`;
}

function getTaskStatusBadgeClass(status) {
  switch ((status || "pending").toLowerCase()) {
    case "completed":
      return "success";
    case "active":
      return "active";
    case "pending":
      return "warning";
    default:
      return "secondary";
  }
}

function getPriorityBadgeClass(priority) {
  switch ((priority || "medium").toLowerCase()) {
    case "high":
      return "priority-high";
    case "low":
      return "priority-low";
    default:
      return "priority-medium";
  }
}

function renderTasks(tasks = tasksData) {
  const container = document.getElementById("taskList");
  if (!container) return;

  if (!tasks || tasks.length === 0) {
    container.innerHTML =
      '<p class="text-center" style="color: #8b949e; padding: 20px;">No tasks assigned</p>';
    return;
  }

  container.innerHTML = tasks
    .map(
      (task) => {
        const priority = (task.priority || "medium").toLowerCase();
        const status = (task.status || "pending").toLowerCase();
        const borderColor = priority === 'high' ? 'ef4444' : priority === 'low' ? '22c55e' : 'f59e0b';
        return `
    <div class="card" style="margin-bottom: 12px; border-left: 4px solid #${borderColor};">
      <div style="padding: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div style="flex: 1;">
            <strong style="font-size: 14px; color: #fff;">${task.title || 'Untitled Task'}</strong>
            ${task.description ? `<p style="margin: 6px 0 0 0; font-size: 12px; color: #8b949e;">${task.description}</p>` : ""}
          </div>
          <span class="badge ${getPriorityBadgeClass(priority)}" style="margin-left: 10px; font-size: 11px;">${priority.toUpperCase()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <p style="margin: 0; font-size: 12px; color: #8b949e;">
              Assigned by: <strong>${task.firstname || ''} ${task.lastname || ''}</strong>
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #8b949e;">
              Due: <strong>${formatDateDisplay(task.deadline)}</strong>
            </p>
          </div>
          <span class="badge ${getTaskStatusBadgeClass(status)}" style="font-size: 11px;">${status.toUpperCase()}</span>
        </div>
        <div style="display: flex; gap: 6px;">
          ${status !== 'completed' ? `
            ${status !== 'active' ? `<button class="btn btn-primary" onclick="startTask(${task.id})" style="padding: 6px 10px; font-size: 11px;">Start</button>` : ""}
            <button class="btn btn-success" onclick="completeTask(${task.id})" style="padding: 6px 10px; font-size: 11px;">Complete</button>
          ` : `
            <span style="font-size: 12px; color: #22c55e;">✓ Completed</span>
          `}
        </div>
      </div>
    </div>
  `;
      }
    )
    .join("");
}

async function startTask(taskId) {
  try {
    showLoader("Starting task...");

    const response = await apiRequest(`/tasks/${taskId}/start`, "POST");
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to start task");
      return;
    }

    await loadMyTasks();
    notifySuccess("Task started!");
  } catch (error) {
    hideLoader();
    notifyError("Error starting task");
    console.error(error);
  }
}

async function completeTask(taskId) {
  const confirmed = await confirmDialog(
    "Mark this task as complete?",
    "Complete Task",
  );
  if (!confirmed) return;

  try {
    showLoader("Completing task...");

    const response = await apiRequest(
      `/tasks/${taskId}/complete`,
      "POST",
    );
    hideLoader();

    if (!response.success) {
      notifyError("Failed to complete task");
      return;
    }

    await loadMyTasks();
    notifySuccess("Task completed!");
  } catch (error) {
    hideLoader();
    notifyError("Error completing task");
    console.error(error);
  }
}

// ======================= PERSONAL REPORTS =======================

async function loadPersonalReport(period = "week") {
  try {
    // Report endpoint is not available, so calculate from local data
    const tasksCompleted = tasksData.filter(t => t.status === 'COMPLETED').length || 0;
    
    if (document.getElementById("tasksCompleted")) {
      document.getElementById("tasksCompleted").textContent = tasksCompleted;
    }
  } catch (error) {
    console.error("Error loading report:", error);
  }
}

// ======================= CHARTS =======================

function initCharts() {
  try {
    const hoursChart = document.getElementById("hoursChart");
    if (hoursChart) {
      employeeCharts.hours = renderPerformanceChart(
        {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          values: [8, 8, 6, 9, 7],
        },
        "hoursChart",
      );
    }

    const perfChart = document.getElementById("performanceChart");
    if (perfChart) {
      employeeCharts.performance = renderAttendanceChart(
        {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [78, 82, 85, 88, 90, 91],
        },
        "performanceChart",
      );
    }
  } catch (error) {
    console.error("Error initializing charts:", error);
  }
}

// ======================= EVENT LISTENERS =======================

function setupEventListeners() {
  const clockInBtn = document.getElementById("clockInBtn");
  const clockOutBtn = document.getElementById("clockOutBtn");
  const startBreakBtn = document.getElementById("startBreakBtn");
  const endBreakBtn = document.getElementById("endBreakBtn");

  if (clockInBtn) clockInBtn.onclick = handleClockIn;
  if (clockOutBtn) clockOutBtn.onclick = handleClockOut;
  if (startBreakBtn) startBreakBtn.onclick = startBreak;
  if (endBreakBtn) endBreakBtn.onclick = endBreak;

  // Mobile menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.getElementById("sidebar");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar?.classList.toggle("active");
    });
  }

  // Logout
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      const confirmed = await confirmDialog("Logout from dashboard?", "Logout");
      if (confirmed) {
        logout();
      }
    };
  }
}

function setupAutoRefresh() {
  // Refresh attendance status every minute
  setInterval(loadAttendanceStatus, 60000);

  // Refresh tasks every 5 minutes
  setInterval(loadMyTasks, 5 * 60 * 1000);
}
