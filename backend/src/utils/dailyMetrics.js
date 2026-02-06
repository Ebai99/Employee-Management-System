const MetricsService = require("../services/metrics.service");
const { query } = require("./db.helper");

async function runDailyMetrics() {
  const employees = await query(`SELECT id FROM employees`);
  const today = new Date().toISOString().split("T")[0];

  for (const emp of employees) {
    await MetricsService.calculateDaily(emp.id, today);
  }

  console.log("Daily metrics calculated");
}

module.exports = runDailyMetrics;
