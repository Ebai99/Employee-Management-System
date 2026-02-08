require("dotenv").config({ path: ".env" });
const { query } = require("../utils/db.helper");

async function createTeamMembersTable() {
  try {
    console.log("Creating team_members table...");

    const sql = `
      CREATE TABLE IF NOT EXISTS team_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        manager_id INT NOT NULL,
        employee_id INT NOT NULL,
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_manager_employee (manager_id, employee_id),
        FOREIGN KEY (manager_id) REFERENCES employees(id),
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      )
    `;

    await query(sql);
    console.log("✓ team_members table created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

createTeamMembersTable();
