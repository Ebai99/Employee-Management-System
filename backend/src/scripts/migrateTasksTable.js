/**
 * Migration Script: Add manager_id to tasks table
 * This script adds the manager_id column if it doesn't exist
 */

require("dotenv").config();
const { query } = require("../utils/db.helper");

(async () => {
  try {
    console.log("Starting tasks table migration...");

    // Check if manager_id column exists
    const checkColumnQuery = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tasks' 
      AND COLUMN_NAME = 'manager_id'
    `;

    try {
      const results = await query(checkColumnQuery);

      if (results.length === 0) {
        // Column doesn't exist, add it
        const addColumnQuery = `
          ALTER TABLE tasks 
          ADD COLUMN manager_id INT NULL,
          ADD FOREIGN KEY (manager_id) REFERENCES employees(id)
        `;

        await query(addColumnQuery);
        console.log("✓ Successfully added manager_id column to tasks table");
        process.exit(0);
      } else {
        console.log("✓ manager_id column already exists");
        process.exit(0);
      }
    } catch (err) {
      if (err.code === "ER_DUP_KEYNAME") {
        console.log("✓ Foreign key already exists");
        process.exit(0);
      } else if (err.code === "ER_DUPLICATE_COLUMN_NAME") {
        console.log("✓ Column already exists");
        process.exit(0);
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Migration error:", error.message);
    process.exit(1);
  }
})();
