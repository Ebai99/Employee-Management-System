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
  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  console.log(role);
  const loginError = document.getElementById("loginError");

  loginError.style.display = "none";

  if (!identifier || !password) {
    loginError.textContent = "All fields are required";
    loginError.style.display = "block";
    return;
  }

  let endpoint, bodyData;

  if (role === "ADMIN") {
    endpoint = "/auth/admin/login";
    bodyData = { email: identifier, password };
  } else if (role === "MANAGER") {
    endpoint = "/auth/manager/login";
    bodyData = { email: identifier, password };
  } else if (role === "EMPLOYEE") {
    endpoint = "/auth/employee/login";
    bodyData = { employee_code: identifier, access_code: password };
  } else {
    throw new Error("Invalid role");
  }

  try {
    const res = await apiRequest(endpoint, "POST", bodyData);

    if (!res.success) throw new Error(res.message || "Login failed");

    // localStorage.setItem("token", res.data.accessToken);
    // localStorage.setItem("role", role);

    // const roleMap = {
    //   admin: "/admin/dashboard.html",
    //   manager: "/manager/dashboard.html",
    //   employee: "/employee/dashboard.html",
    // };
    // window.location.href = roleMap[role];

    // const { accessToken, admin, manager, employee } = res.data;

    // localStorage.setItem("token", accessToken);
    // localStorage.setItem("role", admin.role);

    // if (admin.role === "SUPER_ADMIN") {
    //   window.location.href = `/admin/dashboard.html`;
    // } else if (admin.role === "ADMIN") {
    //   window.location.href = `/admin/dashboard.html`;
    // } else if (manager.role === "MANAGER") {
    //   window.location.href = `/manager/dashboard.html`;
    // } else if (employee.role === "EMPLOYEE") {
    //   window.location.href = `/employee/dashboard.html`;
    // }

    if (role === "ADMIN") {
      const { accessToken, admin } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", admin.role);
      window.location.href = "admin/dashboard.html";
    } else if (role === "MANAGER") {
      const { accessToken, manager } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", manager.role);
      window.location.href = "manager/dashboard.html";
    } else if (role === "EMPLOYEE") {
      const { accessToken, employee } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", employee.role);
      window.location.href = "employee/dashboard.html";
    }
  } catch (err) {
    loginError.textContent = err.message;
    loginError.style.display = "block";
  }
}
