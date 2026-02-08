// ======================= ADMIN DASHBOARD =======================

let currentPage = 1;
const itemsPerPage = 20;
let employeeCharts = {};

// ======================= INITIALIZATION =======================

document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication
  if (!checkAuth() || !hasRole("ADMIN")) {
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
      loadDashboardStats(),
      loadEmployees(),
      loadManagers(),
      loadActivityLogs(1),
      initCharts(),
    ]);

    // Update current user info
    updateUserInfo();

    hideLoader();
  } catch (error) {
    hideLoader();
    notifyError("Failed to load dashboard");
    console.error(error);
  }
}

// ======================= PAGE NAVIGATION =======================

function switchSection(section, event) {
  event.preventDefault();

  // Hide all sections
  const dashboardSection = document.getElementById("dashboardSection");
  const employeesSection = document.getElementById("employeesSection");
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

  if (dashboardSection) dashboardSection.style.display = "none";
  if (employeesSection) employeesSection.style.display = "none";

  // Remove active class from all nav links
  navLinks.forEach((link) => link.classList.remove("active"));

  // Show selected section and mark nav link as active
  if (section === "dashboard") {
    if (dashboardSection) dashboardSection.style.display = "block";
    document.getElementById("pageTitle").textContent = "Dashboard";
    navLinks[0].classList.add("active");
  } else if (section === "employees") {
    if (employeesSection) employeesSection.style.display = "block";
    document.getElementById("pageTitle").textContent = "Employees";
    navLinks[1].classList.add("active");
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
        nameElement.textContent = fullName || user.email || "Admin";
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

// ======================= DASHBOARD STATS =======================

async function loadDashboardStats() {
  try {
    // Get employees list to calculate stats
    const response = await apiRequest("/admin/employees");

    if (!response.success) {
      notifyError(response.message || "Failed to load stats");
      return;
    }

    const employees = response.data || [];

    // Calculate stats from employee data
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
      (e) => e.status === "ACTIVE",
    ).length;
    const totalManagers = employees.filter(
      (e) => e.role === "MANAGER" || e.department === "Management",
    ).length;
    const todayAttendance = Math.floor(Math.random() * activeEmployees) || 0; // Placeholder

    // Update DOM elements
    const elements = {
      totalEmployees: totalEmployees,
      activeEmployees: activeEmployees,
      totalManagers: totalManagers,
      todayAttendance: todayAttendance,
    };

    for (const [id, value] of Object.entries(elements)) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = Array.isArray(value) ? value.length : value;
      }
    }
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
  }
}

// ======================= CHARTS =======================

function initCharts() {
  try {
    // Employee Growth Chart
    const growthChart = document.getElementById("growthChart");
    if (growthChart) {
      employeeCharts.growth = renderGrowthChart(
        {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [48, 55, 62, 58, 72, 81],
        },
        "growthChart",
      );
    }

    // Department Distribution Chart
    const departmentChart = document.getElementById("departmentChart");
    if (departmentChart) {
      employeeCharts.department = renderDepartmentChart(
        {
          labels: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
          values: [45, 22, 18, 10, 15],
        },
        "departmentChart",
      );
    }
  } catch (error) {
    console.error("Error initializing charts:", error);
  }
}

// ======================= EMPLOYEE MANAGEMENT =======================

async function loadEmployees(searchQuery = "", status = "all", page = 1) {
  try {
    showLoader("Loading employees...");

    const params = new URLSearchParams({
      search: searchQuery,
      status: status,
      page: page,
      limit: itemsPerPage,
    });

    const response = await apiRequest(`/admin/employees?${params}`);
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to load employees");
      return;
    }

    // Filter out managers - only show EMPLOYEE role
    const employees = (response.data.employees || response.data).filter(
      (emp) => emp.role === "EMPLOYEE" || !emp.role,
    );

    renderEmployeeTable(employees);

    // Update pagination if available
    if (response.data.pagination) {
      updatePagination(response.data.pagination);
    }

    currentPage = page;
  } catch (error) {
    hideLoader();
    notifyError("Error loading employees");
    console.error(error);
  }
}

function renderEmployeeTable(employees) {
  const tbody = document.getElementById("employeeTableBody");
  if (!tbody) return;

  if (!employees || employees.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <div class="empty-title">No Employees</div>
            <div class="empty-description">No employees found matching your criteria</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = employees
    .map(
      (emp) => `
    <tr>
      <td>
        <div>
          <strong>${emp.firstname} ${emp.lastname}</strong>
          <div style="font-size: 12px; color: #8b949e;">${emp.employee_code}</div>
        </div>
      </td>
      <td>${emp.email}</td>
      <td>${emp.telephone || "N/A"}</td>
      <td>${emp.address || "N/A"}</td>
      <td>${emp.department || "N/A"}</td>
      <td>
        <span class="badge ${emp.status === "ACTIVE" ? "active" : "inactive"}">
          ${emp.status || "INACTIVE"}
        </span>
      </td>
      <td class="text-center">
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="btn btn-primary" onclick="editEmployee('${emp.employee_code}')" style="padding: 6px 12px; font-size: 12px;">
            Edit
          </button>
          <button class="btn btn-secondary" onclick="showAssignManagerModal('${emp.employee_code}')" style="padding: 6px 12px; font-size: 12px;">
            Assign
          </button>
          ${
            emp.status === "ACTIVE"
              ? `<button class="btn btn-warning" onclick="disableEmployee('${emp.employee_code}')" style="padding: 6px 12px; font-size: 12px;">Disable</button>`
              : `<button class="btn btn-success" onclick="activateEmployee('${emp.employee_code}')" style="padding: 6px 12px; font-size: 12px;">Activate</button>`
          }
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

async function createEmployee(formData) {
  const form = document.getElementById("createEmployeeForm");

  if (
    !validateForm("createEmployeeForm", {
      firstname: { required: true },
      lastname: { required: true },
      email: { required: true, email: true },
      telephone: { required: true },
      address: { required: true },
    })
  ) {
    return;
  }

  try {
    showLoader("Creating employee...");

    const response = await apiRequest("/admin/employees", "POST", formData);
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to create employee");
      return;
    }

    // Show access code
    showAccessCode(response.data.employee_code, response.data.access_code);

    // Close modal and reload
    closeModal("createEmployeeModal");
    form.reset();
    await loadEmployees();
    await loadDashboardStats(); // Update KPI counts

    notifySuccess("Employee created successfully");

    // Navigate to Employees section after 2 seconds
    setTimeout(() => {
      const evt = new Event("click");
      evt.preventDefault = () => true;
      switchSection("employees", evt);
    }, 2000);
  } catch (error) {
    hideLoader();
    notifyError("Error creating employee");
    console.error(error);
  }
}

function showAccessCode(employeeCode, accessCode) {
  // Support both the static modal in the HTML (ids: codeDisplay/passwordDisplay)
  // and the dynamic modal created here (use same ids when creating dynamically).
  let modal = document.getElementById("accessCodeModal");

  if (!modal) {
    const newModal = document.createElement("div");
    newModal.id = "accessCodeModal";
    newModal.className = "modal";
    newModal.innerHTML =
      `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Employee Created Successfully! ✅</h3>
          <button class="modal-close" onclick="closeModal('accessCodeModal')">×</button>
        </div>
        <p>Please provide the following credentials to the employee:</p>
        <div class="card" style="background: #f5f5f5; margin: 15px 0;">
          <div style="margin-bottom: 15px;">
            <strong>Employee Code:</strong>
            <div id="codeDisplay" style="font-family: monospace; font-size: 16px; color: var(--color-primary); margin-top: 5px;"></div>
          </div>
          <div>
            <strong>Access Code:</strong>
            <div id="passwordDisplay" style="font-family: monospace; font-size: 16px; color: var(--color-primary); margin-top: 5px;"></div>
          </div>
        </div>
        <p style="color: #f44336; font-size: 12px;">⚠️ These credentials will only be shown once. Please save them securely.</p>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button class="btn btn-secondary" onclick="copyToClipboard('` +
      employeeCode +
      `')">Copy Code</button>
          <button class="btn btn-secondary" onclick="copyToClipboard('` +
      accessCode +
      `')">Copy Password</button>
          <button class="btn btn-primary" onclick="closeModal('accessCodeModal')">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(newModal);
    modal = newModal;
  } else {
    // If modal exists but doesn't have expected display elements, inject content.
    const codeEl =
      modal.querySelector("#codeDisplay") ||
      modal.querySelector("#display-code");
    const passEl =
      modal.querySelector("#passwordDisplay") ||
      modal.querySelector("#display-access");
    if (!codeEl || !passEl) {
      modal.innerHTML =
        `
        <div class="modal-content">
          <div class="modal-header">
            <h3>Employee Created Successfully! ✅</h3>
            <button class="modal-close" onclick="closeModal('accessCodeModal')">×</button>
          </div>
          <p>Please provide the following credentials to the employee:</p>
          <div class="card" style="background: #f5f5f5; margin: 15px 0;">
            <div style="margin-bottom: 15px;">
              <strong>Employee Code:</strong>
              <div id="codeDisplay" style="font-family: monospace; font-size: 16px; color: var(--color-primary); margin-top: 5px;"></div>
            </div>
            <div>
              <strong>Access Code:</strong>
              <div id="passwordDisplay" style="font-family: monospace; font-size: 16px; color: var(--color-primary); margin-top: 5px;"></div>
            </div>
          </div>
          <p style="color: #f44336; font-size: 12px;">⚠️ These credentials will only be shown once. Please save them securely.</p>
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="copyToClipboard('` +
        employeeCode +
        `')">Copy Code</button>
            <button class="btn btn-secondary" onclick="copyToClipboard('` +
        accessCode +
        `')">Copy Password</button>
            <button class="btn btn-primary" onclick="closeModal('accessCodeModal')">Done</button>
          </div>
        </div>
      `;
    }
  }

  // Set the values into whichever elements exist
  const finalCodeEl =
    modal.querySelector("#codeDisplay") || modal.querySelector("#display-code");
  const finalPassEl =
    modal.querySelector("#passwordDisplay") ||
    modal.querySelector("#display-access");
  if (finalCodeEl) finalCodeEl.textContent = employeeCode;
  if (finalPassEl) finalPassEl.textContent = accessCode;

  openModal("accessCodeModal");
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    notifySuccess("Copied to clipboard!");
  });
}

async function editEmployee(employeeCode) {
  try {
    showLoader("Loading employee...");

    const response = await apiRequest(`/admin/employees/${employeeCode}`);
    hideLoader();

    if (!response.success) {
      notifyError("Failed to load employee");
      return;
    }

    // Populate form with employee data
    const employee = response.data;
    const form = document.getElementById("createEmployeeForm");

    document.getElementById("firstName").value = employee.firstname || "";
    document.getElementById("lastName").value = employee.lastname || "";
    document.getElementById("email").value = employee.email || "";
    document.getElementById("telephone").value = employee.telephone || "";
    document.getElementById("address").value = employee.address || "";
    document.getElementById("department").value = employee.department || "";
    document.getElementById("position").value = employee.position || "";

    // Change button text to "Update"
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = "Update Employee";
    submitBtn.onclick = async (e) => {
      e.preventDefault();
      await updateEmployee(employeeCode);
    };

    openModal("createEmployeeModal");
  } catch (error) {
    hideLoader();
    notifyError("Error loading employee");
    console.error(error);
  }
}

async function updateEmployee(employeeCode) {
  const form = document.getElementById("createEmployeeForm");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    showLoader("Updating employee...");

    const response = await apiRequest(
      `/admin/employees/${employeeCode}`,
      "PUT",
      data,
    );
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to update employee");
      return;
    }

    closeModal("createEmployeeModal");
    await loadEmployees();
    notifySuccess("Employee updated successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error updating employee");
    console.error(error);
  }
}

async function disableEmployee(employeeCode) {
  const confirmed = await confirmDialog(
    "Are you sure you want to disable this employee?",
    "Disable Employee",
  );

  if (!confirmed) return;

  try {
    showLoader("Disabling employee...");

    const response = await apiRequest(
      `/admin/employees/${employeeCode}/disable`,
      "PATCH",
    );
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to disable employee");
      return;
    }

    await loadEmployees();
    notifySuccess("Employee disabled successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error disabling employee");
    console.error(error);
  }
}

async function activateEmployee(employeeCode) {
  const confirmed = await confirmDialog(
    "Are you sure you want to activate this employee?",
    "Activate Employee",
  );

  if (!confirmed) return;

  try {
    showLoader("Activating employee...");

    const response = await apiRequest(
      `/admin/employees/${employeeCode}/activate`,
      "PATCH",
    );
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to activate employee");
      return;
    }

    await loadEmployees();
    notifySuccess("Employee activated successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error activating employee");
    console.error(error);
  }
}

// ======================= MANAGER ASSIGNMENT =======================

async function showAssignManagerModal(employeeCode) {
  try {
    showLoader("Loading managers...");

    const response = await apiRequest("/admin/managers");
    hideLoader();

    if (!response.success) {
      notifyError("Failed to load managers");
      return;
    }

    // Create modal if not exists
    let modal = document.getElementById("assignManagerModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "assignManagerModal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>Assign Manager</h3>
            <button class="modal-close" onclick="closeModal('assignManagerModal')">×</button>
          </div>
          <div class="form-group">
            <label>Manager</label>
            <select id="managerSelect">
              <option value="">No Manager</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="closeModal('assignManagerModal')">Cancel</button>
            <button class="btn btn-primary" onclick="submitManagerAssignment('${employeeCode}')">Assign</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Populate managers
    const select = document.getElementById("managerSelect");
    select.innerHTML = '<option value="">No Manager</option>';

    response.data.forEach((manager) => {
      const option = document.createElement("option");
      option.value = manager.manager_id;
      option.textContent = manager.firstname + " " + manager.lastname;
      select.appendChild(option);
    });

    openModal("assignManagerModal");
  } catch (error) {
    hideLoader();
    notifyError("Error loading managers");
    console.error(error);
  }
}

async function submitManagerAssignment(employeeCode) {
  const managerId = document.getElementById("managerSelect").value;

  try {
    showLoader("Assigning manager...");

    const response = await apiRequest(
      `/admin/employees/${employeeCode}/manager`,
      "PUT",
      {
        manager_id: managerId || null,
      },
    );
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to assign manager");
      return;
    }

    closeModal("assignManagerModal");
    await loadEmployees();
    notifySuccess("Manager assigned successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error assigning manager");
    console.error(error);
  }
}

// ======================= ACTIVITY LOGS =======================

async function loadActivityLogs(page = 1) {
  try {
    const response = await apiRequest(`/audit/logs?page=${page}&limit=10`);

    if (!response.success) {
      return;
    }

    const container = document.getElementById("activityFeed");
    if (!container) return;

    const logs = response.data.logs || response.data;

    if (!logs || logs.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: #8b949e;">No activity logs</p>';
      return;
    }

    container.innerHTML = logs
      .map(
        (log) => `
      <div class="activity-item" style="padding: 12px 0; border-bottom: 1px solid #21262d;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <strong>${log.user_name || log.action}</strong>
            <div style="font-size: 12px; color: #8b949e; margin-top: 4px;">${log.action || "Action performed"}</div>
          </div>
          <div style="font-size: 12px; color: #8b949e;">
            ${formatDate(log.created_at, "DD MMM YYYY")}
          </div>
        </div>
        <div style="font-size: 12px; color: #8b949e; margin-top: 8px;">
          ${log.description || ""}
        </div>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading activity logs:", error);
  }
}

// ======================= NAVIGATION =======================

function navigateTo(sectionId) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none";
  });

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Show selected section
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = "block";

    // Update page title
    const titles = {
      dashboardSection: "Dashboard",
      employeesSection: "Employee Management",
      reportsSection: "Reports",
      logsSection: "Activity Logs",
      settingsSection: "Settings",
    };

    const pageTitle = document.querySelector(".page-title");
    if (pageTitle) {
      pageTitle.textContent = titles[sectionId] || "Dashboard";
    }

    // Set active nav link
    event?.target?.classList.add("active");

    // Load section-specific data
    if (sectionId === "employeesSection") {
      loadEmployees();
    } else if (sectionId === "logsSection") {
      loadActivityLogs();
    }
  }
}

// ======================= EVENT LISTENERS =======================

function setupEventListeners() {
  // Employee search and filter
  const searchInput = document.getElementById("employeeSearch");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        loadEmployees(e.target.value);
      }, 300),
    );
  }

  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      loadEmployees("", e.target.value);
    });
  }

  // Manager search and filter
  const managerSearchInput = document.getElementById("managerSearch");
  if (managerSearchInput) {
    managerSearchInput.addEventListener(
      "input",
      debounce((e) => {
        loadManagers(e.target.value);
      }, 300),
    );
  }

  const managerStatusFilter = document.getElementById("managerStatusFilter");
  if (managerStatusFilter) {
    managerStatusFilter.addEventListener("change", (e) => {
      loadManagers("", e.target.value);
    });
  }

  // Create employee button
  const createBtn = document.getElementById("createEmployeeBtn");
  if (createBtn) {
    createBtn.onclick = () => {
      document.getElementById("createEmployeeForm").reset();
      document.querySelector(
        '#createEmployeeModal button[type="submit"]',
      ).textContent = "Create Employee";
      openModal("createEmployeeModal");
    };
  }

  // Create employee form
  const form = document.getElementById("createEmployeeForm");
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      await createEmployee(Object.fromEntries(formData));
    };
  }

  // Create manager form
  const managerForm = document.getElementById("managerForm");
  if (managerForm) {
    managerForm.onsubmit = async (e) => {
      e.preventDefault();
      const managerCode = document.getElementById("managerCode").value;
      const formData = {
        firstname: document.getElementById("mFirstName").value,
        lastname: document.getElementById("mLastName").value,
        email: document.getElementById("mEmail").value,
        telephone: document.getElementById("mTelephone").value || null,
        address: document.getElementById("mAddress").value || null,
        department: document.getElementById("mDepartment").value || null,
      };
      // Check if we're editing or creating
      if (managerCode) {
        await updateManager(managerCode, formData);
      } else {
        await createManager(formData);
      }
    };
  }

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
      const confirmed = await confirmDialog(
        "Are you sure you want to logout?",
        "Logout",
      );
      if (confirmed) {
        logout();
      }
    };
  }

  // Notifications
  const notificationBtn = document.querySelector(".notification-btn");
  if (notificationBtn) {
    notificationBtn.onclick = () => {
      notifyInfo("You have 3 new notifications");
    };
  }
}

function setupAutoRefresh() {
  // Refresh stats every 5 minutes
  setInterval(loadDashboardStats, 5 * 60 * 1000);

  // Refresh activity logs every 2 minutes
  setInterval(() => loadActivityLogs(1), 2 * 60 * 1000);
}

function updatePagination(pagination) {
  // Implementation for pagination if needed
  console.log("Pagination:", pagination);
}
// ===== MANAGER MANAGEMENT FUNCTIONS =====

async function loadManagers(searchQuery = "", status = "all", page = 1) {
  try {
    // For now, get all employees and filter for managers
    const response = await apiRequest("/admin/employees");

    if (!response.success) {
      notifyError("Error loading managers");
      return;
    }

    let managers = (response.data.employees || response.data).filter(
      (emp) => emp.role === "MANAGER",
    );

    // Apply search filter
    if (searchQuery) {
      managers = managers.filter(
        (mgr) =>
          mgr.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mgr.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mgr.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply status filter
    if (status && status !== "all") {
      managers = managers.filter(
        (mgr) => mgr.status.toUpperCase() === status.toUpperCase(),
      );
    }

    renderManagerTable(managers);
  } catch (error) {
    notifyError("Error loading managers");
    console.error(error);
  }
}

function renderManagerTable(managers) {
  const tbody = document.getElementById("managerTableBody");
  if (!tbody) return;

  if (!managers || managers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          <div class="empty-state">
            <div class="empty-icon">👔</div>
            <div class="empty-title">No Managers</div>
            <div class="empty-description">No managers found. Create one to get started.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = managers
    .map(
      (mgr) => `
    <tr>
      <td>
        <div>
          <strong>${mgr.firstname} ${mgr.lastname}</strong>
          <div style="font-size: 12px; color: #8b949e;">${mgr.employee_code}</div>
        </div>
      </td>
      <td>${mgr.email}</td>
      <td>${mgr.telephone || "N/A"}</td>
      <td>${mgr.address || "N/A"}</td>
      <td>${mgr.department || "N/A"}</td>
      <td>
        <span class="badge ${mgr.status === "ACTIVE" ? "active" : "inactive"}">
          ${mgr.status || "INACTIVE"}
        </span>
      </td>
      <td class="text-center">
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="btn btn-primary" onclick="editManager('${mgr.employee_code}')" style="padding: 6px 12px; font-size: 12px;">
            Edit
          </button>
          ${
            mgr.status === "ACTIVE"
              ? `<button class="btn btn-warning" onclick="disableManager('${mgr.employee_code}')" style="padding: 6px 12px; font-size: 12px;">Disable</button>`
              : `<button class="btn btn-success" onclick="activateManager('${mgr.employee_code}')" style="padding: 6px 12px; font-size: 12px;">Activate</button>`
          }
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

async function createManager(formData) {
  const form = document.getElementById("managerForm");

  if (
    !validateForm("managerForm", {
      firstname: { required: false },
      lastname: { required: false },
      email: { required: true, email: true },
      telephone: { required: true },
      address: { required: true },
    })
  ) {
    return;
  }

  try {
    showLoader("Creating manager...");

    // Add role to formData for manager employees
    const managerData = { ...formData, role: "MANAGER" };
    // Use dedicated managers endpoint so backend sets proper manager code and role
    const response = await apiRequest("/admin/managers", "POST", managerData);
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to create manager");
      return;
    }

    // Show access code - backend returns manager_code for managers
    showManagerAccessCode(
      response.data.manager_code || response.data.employee_code,
      response.data.access_code,
    );

    // Close modal and reload
    closeModal("createManagerModal");
    form.reset();
    document.getElementById("managerCode").value = ""; // Clear the hidden field
    await loadManagers();
    await loadDashboardStats(); // Update KPI counts

    notifySuccess("Manager created successfully");

    // Navigate to Employees section after 2 seconds
    setTimeout(() => {
      const evt = new Event("click");
      evt.preventDefault = () => true;
      switchSection("employees", evt);
    }, 2000);
  } catch (error) {
    hideLoader();
    notifyError("Error creating manager");
    console.error(error);
  }
}

function showManagerAccessCode(managerCode, accessCode) {
  // Update existing modal for manager
  const modalHeader = document.querySelector("#accessCodeModal h2");
  if (modalHeader) {
    modalHeader.textContent = "Manager Access Code";
  }

  const modalLabel = document.querySelector("#accessCodeModal label");
  if (modalLabel) {
    modalLabel.textContent = "Manager Code";
  }

  const codeDisplay = document.getElementById("codeDisplay");
  const passwordDisplay = document.getElementById("passwordDisplay");

  if (codeDisplay) {
    codeDisplay.textContent = managerCode;
  }
  if (passwordDisplay) {
    passwordDisplay.textContent = accessCode;
  }

  openModal("accessCodeModal");
}

async function editManager(managerCode) {
  try {
    showLoader("Loading manager...");

    const response = await apiRequest(`/admin/employees/${managerCode}`);
    hideLoader();

    if (!response.success) {
      notifyError("Failed to load manager");
      return;
    }

    // Populate form with manager data
    const manager = response.data;
    const form = document.getElementById("managerForm");

    // Store the manager code in the hidden field
    document.getElementById("managerCode").value = managerCode;
    
    document.getElementById("mFirstName").value = manager.firstname || "";
    document.getElementById("mLastName").value = manager.lastname || "";
    document.getElementById("mEmail").value = manager.email || "";
    document.getElementById("mTelephone").value = manager.telephone || "";
    document.getElementById("mAddress").value = manager.address || "";
    document.getElementById("mDepartment").value = manager.department || "";
    document.getElementById("mPosition").value = manager.position || "";

    openModal("createManagerModal");
  } catch (error) {
    hideLoader();
    notifyError("Error loading manager");
    console.error(error);
  }
}

async function updateManager(managerCode, formData) {
  const form = document.getElementById("managerForm");

  if (
    !validateForm("managerForm", {
      firstname: { required: false },
      lastname: { required: false },
      email: { required: true, email: true },
      telephone: { required: true },
      address: { required: true },
    })
  ) {
    return;
  }

  try {
    showLoader("Updating manager...");

    const response = await apiRequest(
      `/admin/employees/${managerCode}`,
      "PUT",
      formData,
    );
    hideLoader();

    if (!response.success) {
      notifyError(response.message || "Failed to update manager");
      return;
    }

    // Close modal and reload
    closeModal("createManagerModal");
    form.reset();
    document.getElementById("managerCode").value = ""; // Clear the hidden field
    await loadManagers();
    notifySuccess("Manager updated successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error updating manager");
    console.error(error);
  }
}

async function disableManager(managerCode) {
  const confirmed = await confirmDialog(
    "Are you sure you want to disable this manager?",
    "Disable Manager",
  );

  if (!confirmed) return;

  try {
    showLoader("Disabling manager...");

    const response = await apiRequest(
      `/admin/employees/${managerCode}/disable`,
      "PATCH",
    );
    hideLoader();

    if (!response.success) {
      notifyError("Failed to disable manager");
      return;
    }

    await loadManagers();
    notifySuccess("Manager disabled successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error disabling manager");
    console.error(error);
  }
}

async function activateManager(managerCode) {
  const confirmed = await confirmDialog(
    "Are you sure you want to activate this manager?",
    "Activate Manager",
  );

  if (!confirmed) return;

  try {
    showLoader("Activating manager...");

    const response = await apiRequest(
      `/admin/employees/${managerCode}/activate`,
      "PATCH",
    );
    hideLoader();

    if (!response.success) {
      notifyError("Failed to activate manager");
      return;
    }

    await loadManagers();
    notifySuccess("Manager activated successfully");
  } catch (error) {
    hideLoader();
    notifyError("Error activating manager");
    console.error(error);
  }
}
