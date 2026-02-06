const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("button.btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await login();
    });
  }
});

async function login() {
  const identifier = document.getElementById("identifier").value || "";
  const password = document.getElementById("password").value || "";
  const role = document.getElementById("role").value;
  const loginError = document.getElementById("loginError");

  // Clear previous errors
  if (loginError) {
    loginError.textContent = "";
    loginError.style.display = "none";
  }

  if (!identifier || !password) {
    if (loginError) {
      loginError.textContent = "Please fill in all fields";
      loginError.style.display = "block";
    }
    return;
  }

  const endpoint =
    role === "admin" ? "/api/auth/admin/login" : "/api/auth/employee/login";

  // Build request body based on role
  let bodyData = {};
  if (role === "admin") {
    bodyData = {
      email: identifier,
      password: password,
    };
  } else {
    bodyData = {
      employee_code: identifier,
      access_code: password,
    };
  }

  try {
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || data.errors?.[0]?.msg || "Login failed");
    }

    // Save accessToken and role
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("role", role);

    // Redirect based on role
    if (role === "admin") window.location.href = "admin/dashboard.html";
    else if (role === "manager") window.location.href = "manager/dashboard.html";
    else if (role === "employee") window.location.href = "employee/dashboard.html";
  } catch (err) {
    console.error("Login error:", err);
    if (loginError) {
      loginError.textContent = err.message;
      loginError.style.display = "block";
    }
  }
}
