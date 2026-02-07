document.addEventListener("DOMContentLoaded", () => {
  // Only attach to the dedicated login button to avoid binding on other pages
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await login();
    });
  }
});

async function login() {
  const identifier = document.getElementById("identifier");
  const password = document.getElementById("password");
  const role = document.getElementById("role");
  const loginError = document.getElementById("loginError");

  // Validate elements exist
  if (!identifier || !password || !role || !loginError) {
    console.error("Login form elements not found");
    return;
  }

  const identifierValue = identifier.value.trim();
  const passwordValue = password.value;
  const roleValue = role.value;

  loginError.style.display = "none";

  if (!identifierValue || !passwordValue) {
    loginError.textContent = "All fields are required";
    loginError.style.display = "block";
    return;
  }

  if (!roleValue) {
    loginError.textContent = "Please select a role";
    loginError.style.display = "block";
    return;
  }

  let endpoint, bodyData;

  if (roleValue === "ADMIN") {
    endpoint = "/auth/admin/login";
    bodyData = { email: identifierValue, password: passwordValue };
  } else if (roleValue === "MANAGER") {
    endpoint = "/auth/manager/login";
    bodyData = { manager_code: identifierValue, access_code: passwordValue };
  } else if (roleValue === "EMPLOYEE") {
    endpoint = "/auth/employee/login";
    bodyData = { employee_code: identifierValue, access_code: passwordValue };
  } else {
    loginError.textContent = "Invalid role selected";
    loginError.style.display = "block";
    return;
  }

  try {
    const res = await apiRequest(endpoint, "POST", bodyData);

    if (!res.success) throw new Error(res.message || "Login failed");

    if (roleValue === "ADMIN") {
      const { accessToken, admin } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", admin.role);
      // store user info for UI
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstname: admin.name ? admin.name.split(" ")[0] : "",
          lastname: admin.name ? admin.name.split(" ").slice(1).join(" ") : "",
          email: admin.email || "",
        }),
      );
      window.location.href = "admin/dashboard.html";
    } else if (roleValue === "MANAGER") {
      const { accessToken, manager } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", "MANAGER");
      // store user info for UI
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstname: manager.firstname || "",
          lastname: manager.lastname || "",
          email: manager.email || "",
        }),
      );
      window.location.href = "manager/dashboard.html";
    } else if (roleValue === "EMPLOYEE") {
      const { accessToken, employee } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", "EMPLOYEE");
      // store user info for UI
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstname: employee.firstname || "",
          lastname: employee.lastname || "",
          email: employee.email || "",
        }),
      );
      window.location.href = "employee/dashboard.html";
    }
  } catch (err) {
    loginError.textContent = err.message || "Login failed";
    loginError.style.display = "block";
    console.error("Login error:", err);
  }
}

// ======================= AUTHENTICATION CHECKS =======================

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return !!(token && role);
}

/**
 * Get current user's role
 */
function getCurrentRole() {
  return localStorage.getItem("role") || null;
}

/**
 * Get current token
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Parse JWT token
 */
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
}

/**
 * Check authentication and redirect if needed
 */
function checkAuth() {
  const token = getToken();
  const role = getCurrentRole();

  if (!token || !role) {
    // Not authenticated
    if (!window.location.href.includes("index.html")) {
      window.location.href = "/index.html";
    }
    return false;
  }

  if (isTokenExpired(token)) {
    // Token expired
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (typeof showToast === "function") {
      showToast("Session expired. Please login again.", "warning");
    }
    setTimeout(() => (window.location.href = "/index.html"), 1500);
    return false;
  }

  return true;
}

/**
 * Check if user has specific role
 */
function hasRole(requiredRole) {
  const userRole = getCurrentRole();
  return userRole === requiredRole;
}

/**
 * Check if user has any of the specified roles
 */
function hasAnyRole(roles) {
  const userRole = getCurrentRole();
  return roles.includes(userRole);
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  if (typeof showToast === "function") {
    showToast("Logged out successfully", "success");
  }

  setTimeout(() => {
    window.location.href = "/index.html";
  }, 1000);
}

/**
 * Refresh token (if backend supports it)
 */
async function refreshToken() {
  try {
    const response = await apiRequest("/auth/refresh", "POST");
    if (response.success) {
      localStorage.setItem("token", response.data.accessToken);
      return true;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
  return false;
}

// ======================= AUTO INITIALIZATION =======================

// Check auth on page load for protected pages (not on login page)
document.addEventListener("DOMContentLoaded", () => {
  const isLoginPage =
    window.location.pathname.includes("index.html") ||
    window.location.pathname.endsWith("/");

  if (!isLoginPage) {
    if (!checkAuth()) {
      // Auth check already redirected, no need to throw
      return;
    }
  }
});
