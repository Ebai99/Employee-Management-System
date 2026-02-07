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
  const token = getToken();
  const payload = parseJwt(token);

  if (payload) {
    const nameElement = document.querySelector(".user-info .name");
    if (nameElement) {
      nameElement.textContent = payload.employee_code || "Employee";
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
    const response = await apiRequest(`/tasks?filter=${filter}`);

    tasksData = response.data || [];
    renderTasks();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

function renderTasks() {
  const container = document.getElementById("taskList");
  if (!container) return;

  if (!tasksData || tasksData.length === 0) {
    container.innerHTML =
      '<p class="text-center" style="color: #8b949e;">No tasks assigned</p>';
    return;
  }

  container.innerHTML = tasksData
    .map(
      (task) => `
    <div class="card" style="margin-bottom: 15px;">
      <div class="card-header">
        <div>
          <strong>${task.title}</strong>
        </div>
        <span class="priority priority-${(task.priority || "medium").toLowerCase()}">
          ${task.priority || "Medium"}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px; align-items: center;">
        <div style="font-size: 12px; color: #8b949e;">
          Due: ${formatDate(task.due_date, "DD MMM YYYY")}
        </div>
        <button class="btn btn-success" onclick="completeTask(${task.task_id})" style="padding: 6px 12px; font-size: 12px;">Complete</button>
      </div>
    </div>
  `,
    )
    .join("");
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
      `/employee/tasks/${taskId}/complete`,
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
