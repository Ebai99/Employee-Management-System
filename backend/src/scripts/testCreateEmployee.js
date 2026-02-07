(async () => {
  try {
    const fetch = globalThis.fetch || (await import("node-fetch")).default;
    const base = "http://localhost:5000";

    // Admin credentials created by createAdmin.js
    const loginRes = await fetch(`${base}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@company.com",
        password: "Admin@123",
      }),
    });
    const loginJson = await loginRes.json();
    if (!loginJson.success) {
      console.error("Admin login failed:", loginJson);
      process.exit(1);
    }

    const token = loginJson.data.accessToken;
    console.log("✅ Admin logged in, token length:", token ? token.length : 0);

    const employeePayload = {
      firstname: "Test",
      lastname: "Employee",
      email: `test.employee+${Date.now()}@example.com`,
      telephone: "0123456789",
      address: "123 Example St",
      department: "Engineering",
      position: "Developer",
    };

    const createRes = await fetch(`${base}/api/admin/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeePayload),
    });

    const createJson = await createRes.json();
    console.log("Create employee response status:", createRes.status);
    console.log(JSON.stringify(createJson, null, 2));
  } catch (err) {
    console.error("Error running test script:", err);
    process.exit(1);
  }
})();
