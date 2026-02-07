require("dotenv").config();
const { hashPassword } = require("../utils/password.util");
const { query } = require("../utils/db.helper");

(async () => {
  try {
    const password = "Admin@123"; // change later
    const passwordHash = await hashPassword(password);

    // Check if admin already exists
    const existingAdmin = await query(`SELECT id FROM admins WHERE email = ?`, [
      "admin@company.com",
    ]);

    if (existingAdmin && existingAdmin.length > 0) {
      console.log("✅ Admin account already exists");
      console.log("Login email: admin@company.com");
      console.log("Login password:", password);
      process.exit(0);
    }

    await query(
      `INSERT INTO admins (name, email, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      ["System Admin", "admin@company.com", passwordHash, "SUPER_ADMIN", true],
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
