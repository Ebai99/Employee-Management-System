const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const employeeCode = document.getElementById("employeeCode").value;
  const accessCode = document.getElementById("accessCode").value;
  const role = document.getElementById("role").value;

  const endpoint =
    role === "admin" ? "/api/auth/admin/login" : "/api/auth/employee/login";

  try {
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeCode,
        accessCode,
        email: role === "admin" ? employeeCode : undefined,
      }),
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message || "Login failed");

    // Save accessToken and role
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("role", role);

    // Redirect based on role
    if (role === "admin") window.location.href = "admin-dashboard.html";
    if (role === "manager") window.location.href = "manager-dashboard.html";
    if (role === "employee") window.location.href = "employee-dashboard.html";
  } catch (err) {
    loginError.textContent = err.message;
  }
});
