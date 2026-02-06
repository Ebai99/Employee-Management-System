require("dotenv").config();
const { hashPassword } = require("../utils/password.util");
const { query } = require("../utils/db.helper");

(async () => {
  try {
    const password = "Admin@123"; // change later
    const passwordHash = await hashPassword(password);

    await query(
      `INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ["System Admin", "admin@company.com", passwordHash, "SUPER_ADMIN"],
    );

    console.log("✅ Admin created successfully");
    console.log("Login email: admin@company.com");
    console.log("Login password:", password);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
})();
