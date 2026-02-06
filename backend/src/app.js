const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const errorHandler = require("./middleware/error.middleware");

const app = express();

// Security headers
app.use(helmet());

// Allow frontend communication
app.use(cors());

// Parse JSON
app.use(express.json());

// Request logging
app.use(morgan("dev"));

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

const adminEmployeeRoutes = require("./routes/admin.employee.routes");
app.use("/api/admin", adminEmployeeRoutes);

app.use("/api/attendance", require("./routes/attendance.routes"));

app.use("/api/breaks", require("./routes/break.routes"));

app.use("/api/tasks", require("./routes/task.routes"));

app.use("/api/reports", require("./routes/report.routes"));

app.use("/api/metrics", require("./routes/metrics.routes"));

const runDailyMetrics = require("./utils/dailyMetrics");
runDailyMetrics();

app.use("/api/export", require("./routes/export.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Employee Management API running" });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
