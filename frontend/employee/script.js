// Data
const tasks = [
  {
    name: "Complete API documentation",
    project: "Platform v2",
    priority: "High",
    deadline: "Feb 10",
    status: "In Progress",
  },
  {
    name: "Code review — Auth module",
    project: "Platform v2",
    priority: "Medium",
    deadline: "Feb 12",
    status: "Pending",
  },
];

const notifications = [
  {
    message: "Your leave request for Feb 20 was approved",
    time: "1 hr ago",
  },
  {
    message: "New task assigned: Sprint demo preparation",
    time: "3 hrs ago",
  },
];

// Render tasks
function renderTasks() {
  const container = document.getElementById("taskList");
  container.innerHTML = "";

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.innerHTML = `
      <div class="task-header">
        <span>${task.name}</span>
        <span class="priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
      </div>
      <div>Project: ${task.project}</div>
      <div style="display:flex; justify-content:space-between;">
        <span>Deadline: ${task.deadline}</span>
        <span class="status status-${task.status.toLowerCase().replace(" ", "")}">
          ${task.status}
        </span>
      </div>
    `;
    container.appendChild(div);
  });
}

// Render notifications
function renderNotifications() {
  const container = document.getElementById("notificationList");
  container.innerHTML = "";

  notifications.forEach((notif) => {
    const div = document.createElement("div");
    div.className = "notification-item";
    div.innerHTML = `
      <div>${notif.message}</div>
      <div class="time">${notif.time}</div>
    `;
    container.appendChild(div);
  });
}

// Charts
function initCharts() {
  // Hours Worked - Bar Chart
  new Chart(document.getElementById("hoursChart"), {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          data: [8, 8, 6, 9, 7],
          backgroundColor: "#238636",
          borderRadius: 6,
          barThickness: 32,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#21262d" },
          ticks: { color: "#8b949e" },
        },
        x: { grid: { display: false }, ticks: { color: "#8b949e" } },
      },
    },
  });

  // Performance Trend - Line Chart
  new Chart(document.getElementById("performanceChart"), {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [78, 82, 85, 88, 90, 91],
          borderColor: "#00d4ff",
          backgroundColor: "rgba(0, 212, 255, 0.12)",
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 60,
          max: 100,
          grid: { color: "#21262d" },
          ticks: { color: "#8b949e" },
        },
        x: { grid: { color: "#21262d" }, ticks: { color: "#8b949e" } },
      },
    },
  });
}

// Mobile menu
document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("active");
});

// Simple actions
function toggleNotifications() {
  alert("Notifications panel");
}

function logout() {
  if (confirm("Logout?")) alert("Goodbye!");
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  renderNotifications();
  initCharts();
});
