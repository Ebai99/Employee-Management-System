require("dotenv").config();
const { hashPassword } = require("../utils/password.util");
const { query } = require("../utils/db.helper");
const generateAccessCode = require("../utils/accessCode.generator");

(async () => {
  try {
    // Get admin ID for created_by
    const admins = await query(`SELECT id FROM admins LIMIT 1`);
    if (!admins || admins.length === 0) {
      console.error(
        "❌ No admin found. Create admin first with: npm run admin:create",
      );
      process.exit(1);
    }

    const adminId = admins[0].id;
    const accessCode = generateAccessCode();
    const accessCodeHash = await hashPassword(accessCode);
    const managerCode = `MGR-${Date.now()}`;

    // Check if manager already exists
    const existingManager = await query(
      `SELECT id FROM employees WHERE employee_code = ?`,
      [managerCode],
    );

    if (existingManager && existingManager.length > 0) {
      console.log("✅ Manager account already exists");
      process.exit(0);
    }

    await query(
      `INSERT INTO employees 
       (employee_code, firstname, lastname, email, access_code_hash, role, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        managerCode,
        "Manager",
        "Account",
        "manager@company.com",
        accessCodeHash,
        "MANAGER",
        adminId,
        "ACTIVE",
      ],
    );

    console.log("✅ Manager created successfully");
    console.log("Manager Code:", managerCode);
    console.log("Access Code:", accessCode);
    console.log("\nUse these credentials to login at /manager/");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
})();
