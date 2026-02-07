// Fake activity data
const activities = [
  {
    employee: "Sarah Chen",
    action: "Updated profile",
    department: "Engineering",
    time: "2 min ago",
    status: "Completed",
  },
  {
    employee: "James Wilson",
    action: "Submitted leave request",
    department: "Marketing",
    time: "15 min ago",
    status: "Pending",
  },
  {
    employee: "Maria Lopez",
    action: "Approved promotion",
    department: "Sales",
    time: "42 min ago",
    status: "Completed",
  },
];

// Render activity feed
function renderActivity() {
  const container = document.getElementById("activityFeed");
  container.innerHTML = "";

  activities.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div>${item.employee}</div>
      <div>${item.action}</div>
      <div>${item.department}</div>
      <div>${item.time}</div>
      <div>
        <span class="status status-${item.status.toLowerCase()}">
          ${item.status}
        </span>
      </div>
    `;
    container.appendChild(div);
  });
}

// Charts
function initCharts() {
  // Employee Growth - Line Chart
  new Chart(document.getElementById("growthChart"), {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "New Hires",
          data: [48, 55, 62, 58, 72, 81],
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
          min: 20,
          max: 100,
          grid: { color: "#21262d" },
          ticks: { color: "#8b949e" },
        },
        x: {
          grid: { color: "#21262d" },
          ticks: { color: "#8b949e" },
        },
      },
    },
  });

  // Department Distribution - Doughnut Chart
  new Chart(document.getElementById("departmentChart"), {
    type: "doughnut",
    data: {
      labels: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
      datasets: [
        {
          data: [45, 22, 18, 10, 15],
          backgroundColor: [
            "#00d4ff",
            "#238636",
            "#ffa657",
            "#7c3aed",
            "#f85149",
          ],
          borderWidth: 1,
          borderColor: "#0d1117",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      cutout: "68%",
    },
  });
}

// Mobile menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");

mobileMenuBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Simple interactions
function toggleNotifications() {
  alert("Notifications panel (placeholder)");
}

function logout() {
  if (confirm("Logout from admin panel?")) {
    alert("Goodbye!");
  }
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  renderActivity();
  initCharts();

  // Close sidebar on outside click (mobile)
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 768 &&
      !sidebar.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      sidebar.classList.remove("active");
    }
  });
});
