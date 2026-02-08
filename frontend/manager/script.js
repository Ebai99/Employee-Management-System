// ======================= MANAGER DASHBOARD =======================

let teamData = [];
let tasksData = [];
let managerCharts = {};

// ======================= INITIALIZATION =======================

document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication
  if (!checkAuth() || !hasRole("MANAGER")) {
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
      loadTeamStats(),
      loadTeamMembers(),
      loadTeamAttendance(),
      loadTeamTasks(),
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
        nameElement.textContent = fullName || user.email || "Manager";
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

// ======================= TEAM STATISTICS =======================

async function loadTeamStats() {
  try {
    const response = await apiRequest("/manager/team");

    if (!response.success) return;

    const teamMembers = response.data || [];

    // Calculate stats from team data
    const teamSize = teamMembers.length;
    const tasksAssigned = teamMembers.reduce((sum, m) => sum + (m.tasks_assigned || 0), 0);
    const tasksCompleted = teamMembers.reduce((sum, m) => sum + (m.tasks_completed || 0), 0);
    const avgPerformance = Math.round(
      teamMembers.reduce((sum, m) => sum + (m.performance_score || 0), 0) / (teamSize || 1)
    );

    // Update stat cards
    const elements = {
      teamSize: teamSize,
      tasksAssigned: tasksAssigned,
      tasksCompleted: tasksCompleted,
      avgPerformance: avgPerformance + "%",
    };

    for (const [id, value] of Object.entries(elements)) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    }
  } catch (error) {
    console.error("Error loading team stats:", error);
  }
}

// ======================= TEAM MEMBERS =======================

async function loadTeamMembers() {
  try {
    const response = await apiRequest("/manager/team");

    if (!response.success) return;

    teamData = response.data || [];
    renderTeamTable();
  } catch (error) {
    console.error("Error loading team members:", error);
  }
}

function renderTeamTable() {
  const tbody = document.getElementById("teamBody");
  if (!tbody || !teamData || teamData.length === 0) return;

  tbody.innerHTML = teamData
    .map(
      (member) => `
    <tr>
      <td><strong>${member.firstname} ${member.lastname}</strong></td>
      <td>${member.position || "N/A"}</td>
      <td>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${member.progress || 50}%"></div>
        </div>
      </td>
      <td><span class="badge active">${member.status || "Active"}</span></td>
    </tr>
  `,
    )
    .join("");
}

// ======================= TEAM ATTENDANCE =======================

async function loadTeamAttendance(date = new Date()) {
  try {
    // Since attendance endpoint doesn't exist, calculate from team data
    const teamResponse = await apiRequest("/manager/team");
    if (!teamResponse.success) return;

    const teamMembers = teamResponse.data || [];
    
    // Randomly generated attendance data (should be from backend in production)
    const presentCount = Math.floor(Math.random() * teamMembers.length);
    const absentCount = teamMembers.length - presentCount;

    const elements = {
      presentCount: presentCount,
      absentCount: absentCount,
      leaveCount: 0,
    };

    for (const [id, value] of Object.entries(elements)) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    }
  } catch (error) {
    console.error("Error loading attendance:", error);
  }
}

// ======================= TEAM TASKS =======================

async function loadTeamTasks(filter = "all") {
  try {
    // Tasks endpoint uses /tasks route
    const response = await apiRequest(`/tasks?filter=${filter}`);

    if (!response.success) return;

    tasksData = response.data || [];
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

// ======================= CHARTS =======================

function initCharts() {
  try {
    const perfChart = document.getElementById("performanceChart");
    if (perfChart) {
      managerCharts.performance = renderPerformanceChart(
        {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          values: [85, 78, 72, 88, 95],
        },
        "performanceChart",
      );
    }

    const tasksChart = document.getElementById("tasksChart");
    if (tasksChart) {
      managerCharts.tasks = renderTaskChart(
        {
          labels: ["Completed", "In Progress", "Pending"],
          values: [25, 18, 7],
        },
        "tasksChart",
      );
    }
  } catch (error) {
    console.error("Error initializing charts:", error);
  }
}

// ======================= PAGE NAVIGATION =======================

function switchSection(section, event) {
  if (event) {
    event.preventDefault();
  }

  const dashboardSection = document.getElementById("dashboardSection");
  const teamSection = document.getElementById("teamSection");
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

  // Hide all sections
  if (dashboardSection) dashboardSection.style.display = "none";
  if (teamSection) teamSection.style.display = "none";

  // Remove active class from all nav links
  navLinks.forEach((link) => link.classList.remove("active"));

  // Show selected section
  if (section === "dashboard") {
    if (dashboardSection) dashboardSection.style.display = "block";
    navLinks[0].classList.add("active");
  } else if (section === "team") {
    if (teamSection) teamSection.style.display = "block";
    loadTeamMembersTable();
    navLinks[1].classList.add("active");
  }
}

// ======================= TEAM MEMBERS MANAGEMENT =======================

async function loadTeamMembersTable() {
  try {
    showLoader("Loading team members...");

    const response = await apiRequest("/manager/team-members");
    hideLoader();

    if (!response.success) {
      notifyError("Failed to load team members");
      return;
    }

    const teamMembers = response.data || [];
    renderTeamMembersTable(teamMembers);
  } catch (error) {
    hideLoader();
    notifyError("Error loading team members");
    console.error(error);
  }
}

function renderTeamMembersTable(teamMembers) {
  const tbody = document.getElementById("teamMembersBody");
  if (!tbody) return;

  if (!teamMembers || teamMembers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="padding: 20px; text-align: center; color: #8b949e;">
          No team members yet. Add your first team member.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = teamMembers
    .map(
      (member) => `
    <tr style="border-bottom: 1px solid #30363d;">
      <td style="padding: 12px;">
        <div style="font-weight: 500;">${member.firstname} ${member.lastname}</div>
        <div style="font-size: 12px; color: #8b949e;">${member.employee_code}</div>
      </td>
      <td style="padding: 12px; color: #8b949e;">${member.email || "N/A"}</td>
      <td style="padding: 12px; color: #8b949e;">${member.telephone || "N/A"}</td>
      <td style="padding: 12px;">
        <span class="badge ${getStatusClass(member.status)}" style="padding: 4px 8px; border-radius: 12px; font-size: 12px;">
          ${member.status || "ACTIVE"}
        </span>
      </td>
      <td style="padding: 12px; text-align: center;">
        <button
          class="btn btn-danger"
          onclick="removeTeamMember(${member.id})"
          style="padding: 4px 8px; font-size: 12px;"
        >
          Remove
        </button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function getStatusClass(status) {
  switch (status) {
    case "ACTIVE":
      return "badge-success";
    case "INACTIVE":
      return "badge-danger";
    case "SUSPENDED":
      return "badge-warning";
    default:
      return "badge-secondary";
  }
}

async function loadAvailableEmployees() {
  try {
    const response = await apiRequest("/manager/available-employees");

    if (!response.success) {
      notifyError("Failed to load employees");
      return;
    }

    const employees = response.data || [];
    const select = document.getElementById("employeeSelect");

    if (!select) return;

    if (employees.length === 0) {
      select.innerHTML = `<option value="">No available employees in your department</option>`;
      return;
    }

    select.innerHTML = `
      <option value="">Select an employee...</option>
      ${employees
        .map(
          (emp) => `
        <option value="${emp.id}">
          ${emp.firstname} ${emp.lastname} ${emp.is_in_team ? "(Already in team)" : ""}
        </option>
      `,
        )
        .join("")}
    `;
  } catch (error) {
    notifyError("Error loading employees");
    console.error(error);
  }
}

async function addTeamMember(formData) {
  const form = document.getElementById("addTeamMemberForm");

  if (!formData.employeeId) {
    notifyError("Please select an employee");
    return;
  }

  try {
    showLoader("Adding team member...");

    const response = await apiRequest("/manager/team-members", "POST", {
      employeeId: parseInt(formData.employeeId),
    });

    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to add team member");
      return;
    }

    closeModal("addTeamMemberModal");
    form.reset();
    await loadTeamMembersTable();
    notifySuccess("Team member added successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error adding team member");
    console.error(error);
  }
}

async function removeTeamMember(employeeId) {
  const confirmed = await confirmDialog(
    "Are you sure you want to remove this team member?",
    "Remove Member",
  );

  if (!confirmed) return;

  try {
    showLoader("Removing team member...");

    const response = await apiRequest(
      `/manager/team-members/${employeeId}`,
      "DELETE",
    );

    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to remove team member");
      return;
    }

    await loadTeamMembersTable();
    notifySuccess("Team member removed successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error removing team member");
    console.error(error);
  }
}

// ======================= EVENT LISTENERS =======================

function setupEventListeners() {
  // Mobile menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.getElementById("sidebar");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar?.classList.toggle("active");
    });
  }

  // Add Team Member Form Submit
  const addTeamMemberForm = document.getElementById("addTeamMemberForm");
  if (addTeamMemberForm) {
    addTeamMemberForm.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(addTeamMemberForm);
      await addTeamMember(Object.fromEntries(formData));
    };
  }

  // Load available employees when modal opens
  const addTeamMemberModal = document.getElementById("addTeamMemberModal");
  if (addTeamMemberModal) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "style" &&
          addTeamMemberModal.style.display !== "none"
        ) {
          loadAvailableEmployees();
        }
      });
    });

    observer.observe(addTeamMemberModal, { attributes: true });
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
  // Refresh attendance every minute
  setInterval(() => loadTeamAttendance(), 60000);

  // Refresh stats every 5 minutes
  setInterval(loadTeamStats, 5 * 60 * 1000);
}
