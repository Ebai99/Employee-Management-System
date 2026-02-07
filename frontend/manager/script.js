// Fake data
const teamMembers = [
  {
    name: "Alice Johnson",
    role: "Senior Dev",
    progress: 75,
    status: "On Track",
  },
  { name: "Bob Smith", role: "Designer", progress: 100, status: "Ahead" },
  { name: "Carol White", role: "QA Engineer", progress: 57, status: "Behind" },
  { name: "Dan Lee", role: "Frontend Dev", progress: 83, status: "On Track" },
  {
    name: "Eve Martinez",
    role: "Backend Dev",
    progress: 78,
    status: "On Track",
  },
];

const activities = [
  { time: "1 hr ago", text: "Sprint 14 completed" },
  {
    time: "3 hrs ago",
    text: "New task assigned to Alice – API integration module",
  },
  {
    time: "5 hrs ago",
    text: "Performance review due – Carol White — Q4 review",
  },
  { time: "Yesterday", text: "Team meeting scheduled" },
];

// Render team table
function renderTeam() {
  const tbody = document.getElementById("teamBody");
  tbody.innerHTML = "";

  teamMembers.forEach((member) => {
    const statusClass =
      member.status === "On Track"
        ? "status-on"
        : member.status === "Ahead"
          ? "status-ahead"
          : "status-behind";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.name}</td>
      <td>${member.role}</td>
      <td>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${member.progress}%"></div>
        </div>
      </td>
      <td><span class="status ${statusClass}">${member.status}</span></td>
    `;
    tbody.appendChild(row);
  });
}

// Render activity feed
function renderActivity() {
  const container = document.getElementById("activityFeed");
  container.innerHTML = "";

  activities.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div>${item.text}</div>
      <div class="activity-time">${item.time}</div>
    `;
    container.appendChild(div);
  });
}

// Charts
function initCharts() {
  // Performance Line Chart
  new Chart(document.getElementById("performanceChart"), {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          label: "Avg Score",
          data: [85, 78, 72, 88, 95],
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.12)",
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#06b6d4",
          pointRadius: 4,
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
          grid: { color: "#1e293b" },
          ticks: { color: "#64748b" },
        },
        x: { grid: { color: "#1e293b" }, ticks: { color: "#64748b" } },
      },
    },
  });

  // Tasks Bar Chart
  new Chart(document.getElementById("tasksChart"), {
    type: "bar",
    data: {
      labels: ["Wk1", "Wk2", "Wk3", "Wk4"],
      datasets: [
        {
          label: "Tasks",
          data: [18, 27, 25, 35],
          backgroundColor: ["#1e293b", "#1e293b", "#1e293b", "#06b6d4"],
          borderRadius: 10,
          barThickness: 32,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: "#1e293b" }, ticks: { color: "#64748b" } },
        x: { grid: { display: false }, ticks: { color: "#64748b" } },
      },
    },
  });
}

// Simple interactions
function toggleNotifications() {
  alert("Notifications panel (placeholder)");
}

function logout() {
  if (confirm("Logout from Stellar EMS?")) {
    alert("Goodbye, Jane! 👋");
  }
}

function refreshTeam() {
  const btn = document.querySelector(".refresh-btn");
  btn.textContent = "Refreshing...";
  setTimeout(() => {
    btn.textContent = "↻ Refresh";
    alert("Team data refreshed");
  }, 1200);
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  renderTeam();
  renderActivity();
  initCharts();
});
