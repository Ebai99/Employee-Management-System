require("dotenv").config({ path: ".env" });
const { query } = require("../utils/db.helper");

async function updateEmployeeFields() {
  try {
    console.log("Starting employee fields migration...");

    // Get all employees with NULL fields
    const employees = await query(
      `SELECT id, firstname, lastname FROM employees WHERE telephone IS NULL OR address IS NULL OR department IS NULL`,
    );

    console.log(`Found ${employees.length} employees with NULL fields`);

    // Update each employee with placeholder data
    for (const employee of employees) {
      const telephone = `+1-555-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;
      const address = `${Math.floor(Math.random() * 999) + 1} Main St, City, State 12345`;
      const department = ["Engineering", "Marketing", "Sales", "HR", "Finance"][
        Math.floor(Math.random() * 5)
      ];

      await query(
        `UPDATE employees SET telephone = ?, address = ?, department = ? WHERE id = ?`,
        [telephone, address, department, employee.id],
      );

      console.log(
        `Updated ${employee.firstname} ${employee.lastname}: ${telephone}, ${department}`,
      );
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

// Run the migration
updateEmployeeFields();
