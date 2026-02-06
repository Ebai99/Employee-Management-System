const cron = require("node-cron");
const { execute } = require("../utils/db.helper");

function calculateProductivity(attendanceHours, tasksCompleted) {
  if (attendanceHours === 0) return 0;
  return Math.min(100, Math.round((tasksCompleted / attendanceHours) * 10));
}

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("⏱️ Running DAILY metrics cron...");

    const [employees] = await execute(
      `SELECT id FROM employees WHERE status = 'ACTIVE'`,
    );

    for (const emp of employees) {
      const employeeId = emp.id;

      // Attendance hours
      const [attendanceRows] = await execute(
        `
      SELECT IFNULL(SUM(TIMESTAMPDIFF(MINUTE, sign_in, sign_out)) / 60, 0) AS hours
      FROM attendance
      WHERE employee_id = ?
      AND DATE(sign_in) = CURDATE() - INTERVAL 1 DAY
      `,
        [employeeId],
      );
      const attendance = attendanceRows[0];

      // Tasks completed
      const [tasksRows] = await execute(
        `
      SELECT COUNT(*) AS completed
      FROM tasks
      WHERE employee_id = ?
      AND status = 'completed'
      AND DATE(updated_at) = CURDATE() - INTERVAL 1 DAY
      `,
        [employeeId],
      );
      const tasks = tasksRows[0];

      const productivity = calculateProductivity(
        attendance.hours,
        tasks.completed,
      );

      await execute(
        `
      INSERT INTO performance_metrics
      (employee_id, metric_date, attendance_hours, tasks_completed, productivity_score)
      VALUES (?, CURDATE() - INTERVAL 1 DAY, ?, ?, ?)
      `,
        [employeeId, attendance.hours, tasks.completed, productivity],
      );
    }

    console.log("✅ Daily metrics generated");
  } catch (error) {
    console.error("❌ Error running daily metrics cron:", error.message);
  }
});
