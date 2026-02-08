// ======================= EMPLOYEE DASHBOARD =======================

let tasksData = [];
let attendanceData = {};
let timerIntervals = {};
let employeeCharts = {};
let notifications = [];
let previousTasksCount = 0;
let notificationCheckInterval = null;

// ======================= HELPER FUNCTIONS =======================

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}

function formatClockTime(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDateDisplay(date) {
  if (!date) return "No deadline";
  const d = new Date(date);
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${month[d.getMonth()]} ${d.getFullYear()}`;
}

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

    // Load notifications from storage
    loadNotifications();
    updateNotificationBadge();
    updateNotificationsPanel();

    // Load all dashboard data
    await Promise.all([
      loadAttendanceStatus(),
      loadMyTasks(),
      loadBreakHistory(),
      loadPersonalReport(),
      initCharts(),
    ]);

    updateUserInfo();
    console.log("Dashboard initialization complete, tasksData:", tasksData);
    console.log("Calling renderTasks with tasksData...");
    renderTasks(tasksData); // Explicitly call renderTasks again to ensure it renders
    
    // Restore break timer if user was on break
    const breakStartTime = localStorage.getItem("breakStartTime");
    if (breakStartTime) {
      startBreakTimer(breakStartTime);
    }
    
    // Set initial task count for notifications
    previousTasksCount = tasksData.length;
    
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
    // Get today's attendance record from API
    const response = await apiRequest("/attendance/today");
    
    if (!response.success || !response.data) {
      // No active session
      attendanceData = { status: "NOT_CLOCKED_IN" };
    } else {
      attendanceData = response.data;
    }

    const clockInTime = attendanceData.clock_in;
    const clockOutTime = attendanceData.clock_out;
    const totalHours = attendanceData.total_hours;

    // Update UI
    const statusEl = document.getElementById("attendanceStatus");
    const hoursEl = document.getElementById("hoursWorked");
    const clockInBtn = document.getElementById("clockInBtn");
    const clockOutBtn = document.getElementById("clockOutBtn");

    if (statusEl) {
      if (clockOutTime) {
        // Clocked out - show total hours
        statusEl.textContent = "Clocked Out";
        statusEl.className = "badge inactive";
        if (hoursEl) hoursEl.textContent = `${totalHours ? totalHours.toFixed(2) : '0'} hours worked`;
      } else if (clockInTime) {
        // Currently clocked in
        statusEl.textContent = "Clocked In";
        statusEl.className = "badge active";
        if (hoursEl) hoursEl.textContent = `Since ${formatClockTime(clockInTime)}`;
        
        // Start time tracker
        startTimeTracker(clockInTime);
      } else {
        // Not clocked in
        statusEl.textContent = "Not Clocked In";
        statusEl.className = "badge inactive";
        if (hoursEl) hoursEl.textContent = "0 hours worked";
      }
    }

    // Update button states
    if (clockInBtn && clockOutBtn) {
      if (clockInTime && !clockOutTime) {
        // Clocked in
        clockInBtn.disabled = true;
        clockOutBtn.disabled = false;
      } else {
        // Not clocked in or already clocked out
        clockInBtn.disabled = false;
        clockOutBtn.disabled = true;
      }
    }
  } catch (error) {
    console.error("Error loading attendance status:", error);
    attendanceData = { status: "NOT_CLOCKED_IN" };
    
    // Fallback to localStorage
    const clockInTime = localStorage.getItem("clockInTime");
    if (clockInTime) {
      const statusEl = document.getElementById("attendanceStatus");
      const hoursEl = document.getElementById("hoursWorked");
      if (statusEl) {
        statusEl.textContent = "Clocked In";
        statusEl.className = "badge active";
      }
      if (hoursEl) hoursEl.textContent = `Since ${formatClockTime(clockInTime)}`;
      startTimeTracker(clockInTime);
    }
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

function startBreakTimer(breakStartTime) {
  if (!breakStartTime) return;

  const updateBreakTime = () => {
    const elapsed = Math.floor((new Date() - new Date(breakStartTime)) / 1000);
    const breakChangeEl = document.querySelector(".kpi-content .change");
    const breakStatusEl = document.getElementById("breakStatus");
    
    if (breakStatusEl) {
      breakStatusEl.textContent = "On Break";
    }
  };

  updateBreakTime();
  if (timerIntervals.break) clearInterval(timerIntervals.break);
  timerIntervals.break = setInterval(updateBreakTime, 1000);
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
    if (breakStatus) {
      breakStatus.textContent = "On Break";
      breakStatus.style.background = "#d97706";
    }
    
    const breakStartTime = new Date().toISOString();
    localStorage.setItem("breakStartTime", breakStartTime);
    startBreakTimer(breakStartTime);
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
    if (breakStatus) {
      breakStatus.textContent = "Working";
      breakStatus.style.background = "#21262d";
    }
    
    localStorage.removeItem("breakStartTime");
    if (timerIntervals.break) {
      clearInterval(timerIntervals.break);
      timerIntervals.break = null;
    }
    notifySuccess("Break ended!");
    
    // Reload break history to update the display
    await loadBreakHistory();
  } catch (error) {
    hideLoader();
    notifyError("Error ending break");
    console.error(error);
  }
}

async function loadBreakHistory() {
  try {
    const response = await apiRequest("/breaks/employee/history");

    if (!response.success) {
      // Gracefully handle 404 or other errors
      console.debug("Break history not available:", response.status);
      return;
    }

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
    } else {
      // Show message when no breaks exist
      const container = document.getElementById("breakHistory");
      if (container) {
        container.innerHTML = '<p style="color: #8b949e; font-size: 12px;">No breaks recorded today</p>';
      }
    }
  } catch (error) {
    // Silently handle errors for optional endpoint
    console.debug("Break history error (expected if endpoint not available):", error.message);
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
    
    // Check for new tasks and send notifications
    checkForNewTasks();
    
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
  console.log("renderTasks called with tasks:", tasks);
  console.log("taskList container found:", !!container);
  
  if (!container) {
    console.error("taskList container not found in DOM!");
    return;
  }

  if (!tasks || tasks.length === 0) {
    console.log("No tasks to display, showing empty message");
    container.innerHTML =
      '<p class="text-center" style="color: #8b949e; padding: 20px;">No tasks assigned</p>';
    return;
  }

  const html = tasks
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
  
  console.log("Generated HTML length:", html.length);
  console.log("Setting container innerHTML...");
  container.innerHTML = html;
  console.log("Container innerHTML set successfully!");
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

  // Check for new task notifications every 30 seconds
  notificationCheckInterval = setInterval(checkForNewTasks, 30000);
}

// ======================= NOTIFICATIONS =======================

async function checkForNewTasks() {
  try {
    // Get current task count
    const currentCount = tasksData.length;
    const newUncompletedTasks = tasksData.filter(t => t.status !== 'COMPLETED');
    
    // Check if there are new tasks
    if (currentCount > previousTasksCount) {
      const newTaskCount = currentCount - previousTasksCount;
      const newTasks = newUncompletedTasks.slice(0, newTaskCount);
      
      // Add notification for each new task
      newTasks.forEach(task => {
        addNotification({
          id: `task-${task.id}`,
          type: 'task',
          title: 'New Task Assigned',
          message: `"${task.title}" assigned by ${task.firstname || 'Your Manager'}`,
          timestamp: new Date(),
          taskId: task.id,
          read: false
        });
      });
      
      // Show toast notification
      showNotificationToast(`${newTaskCount} new task${newTaskCount > 1 ? 's' : ''} assigned!`);
    }
    
    previousTasksCount = currentCount;
  } catch (error) {
    console.error('Error checking for new tasks:', error);
  }
}

function addNotification(notification) {
  notifications.unshift(notification);
  
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications = notifications.slice(0, 50);
  }
  
  // Save to localStorage
  saveNotifications();
  
  // Update badge
  updateNotificationBadge();
  
  // Update notifications panel if open
  updateNotificationsPanel();
}

function saveNotifications() {
  try {
    localStorage.setItem('employeeNotifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
}

function loadNotifications() {
  try {
    const saved = localStorage.getItem('employeeNotifications');
    if (saved) {
      notifications = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
    notifications = [];
  }
}

function updateNotificationBadge() {
  const badge = document.getElementById('notificationBadge');
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (badge) {
    if (unreadCount > 0) {
      badge.style.display = 'block';
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    } else {
      badge.style.display = 'none';
    }
  }
}

function toggleNotifications() {
  const panel = document.getElementById('notificationsPanel');
  if (panel) {
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      // Mark all as read when opening panel
      notifications.forEach(n => n.read = true);
      saveNotifications();
      updateNotificationBadge();
      updateNotificationsPanel();
    }
  }
}

function updateNotificationsPanel() {
  const list = document.getElementById('notificationsList');
  if (!list) return;
  
  if (notifications.length === 0) {
    list.innerHTML = '<div style="padding: 32px 16px; text-align: center; color: #8b949e; font-size: 14px;">No notifications yet</div>';
    return;
  }
  
  list.innerHTML = notifications.map(notification => `
    <div style="
      padding: 12px 16px;
      border-bottom: 1px solid #21262d;
      cursor: pointer;
      transition: background 0.2s;
      background: ${notification.read ? 'transparent' : 'rgba(79, 195, 247, 0.1)'};
    " onmouseover="this.style.background='#161b22'" onmouseout="this.style.background='${notification.read ? 'transparent' : 'rgba(79, 195, 247, 0.1)'}'">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
        <strong style="font-size: 14px; color: #fff;">${notification.title}</strong>
        ${notification.type === 'task' ? '<span style="background: #238636; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px;">TASK</span>' : ''}
      </div>
      <p style="margin: 0; font-size: 13px; color: #8b949e;">${notification.message}</p>
      <p style="margin: 6px 0 0 0; font-size: 12px; color: #6e7681;">${formatNotificationTime(notification.timestamp)}</p>
    </div>
  `).join('');
}

function formatNotificationTime(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

function clearAllNotifications() {
  notifications = [];
  saveNotifications();
  updateNotificationBadge();
  updateNotificationsPanel();
}

function showNotificationToast(message) {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #238636 0%, #1f6feb 100%);
    color: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
    z-index: 10000;
    max-width: 300px;
  `;
  
  toast.textContent = message;
  
  // Add animation keyframes if not already present
  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  // Remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Close notifications panel when clicking outside
document.addEventListener('click', (e) => {
  const panel = document.getElementById('notificationsPanel');
  const btn = document.querySelector('.notification-btn');
  
  if (panel && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.style.display = 'none';
  }
});

