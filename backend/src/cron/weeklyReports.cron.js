const cron = require("node-cron");
const { execute } = require("../utils/db.helper");

cron.schedule("0 1 * * 1", async () => {
  try {
    console.log("📊 Running WEEKLY report cron...");

    await execute(
      `
    INSERT INTO reports (employee_id, week_start, week_end, summary)
    SELECT
      employee_id,
      DATE_SUB(CURDATE(), INTERVAL 7 DAY),
      CURDATE(),
      CONCAT(
        'Attendance Hours: ', SUM(attendance_hours),
        ', Tasks Completed: ', SUM(tasks_completed),
        ', Avg Productivity: ', ROUND(AVG(productivity_score))
      )
    FROM performance_metrics
    WHERE metric_date >= CURDATE() - INTERVAL 7 DAY
    GROUP BY employee_id
    `,
    );

    console.log("✅ Weekly reports generated");
  } catch (error) {
    console.error("❌ Error running weekly reports cron:", error.message);
  }
});
