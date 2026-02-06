const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const db = require("../config/db");

async function initDatabase() {
  try {
    const schemaPath = path.join(__dirname, "../../../database/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Drop tables first to ensure clean slate
    const dropStatements = [
      "DROP TABLE IF EXISTS activity_logs",
      "DROP TABLE IF EXISTS employees",
      "DROP TABLE IF EXISTS admins",
    ];

    for (const statement of dropStatements) {
      console.log(`Executing: ${statement}`);
      await db.query(statement);
    }

    // Split by semicolon and filter empty statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute...`);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await db.query(statement);
    }

    console.log("✓ Database initialized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error initializing database:", error.message);
    process.exit(1);
  }
}

initDatabase();
