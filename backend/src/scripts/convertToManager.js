require("dotenv").config();
const db = require("../config/db");

(async function () {
  try {
    const code = process.argv[2] || "EMP-JEEK2";
    console.log("Converting", code, "to MANAGER...");
    await db.query(
      "UPDATE employees SET role = 'MANAGER' WHERE employee_code = ?",
      [code],
    );
    const [rows] = await db.query(
      "SELECT id, employee_code, firstname, lastname, role, telephone, address, department FROM employees WHERE employee_code = ?",
      [code],
    );
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
