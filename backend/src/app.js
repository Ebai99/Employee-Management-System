const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// CRITICAL: Register dashboard routes FIRST, before ANY middleware
// This ensures they are matched before static middleware can intercept
app.get("/admin/dashboard.html", (req, res) => {
  const filePath = path.resolve(__dirname, "../../frontend/admin/dashboard.html");
  console.log("✓ Serving admin dashboard from:", filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("✗ Error serving admin dashboard:", err.message);
      res.status(500).send(`Error loading dashboard: ${err.message}`);
    }
  });
});

app.get("/manager/dashboard.html", (req, res) => {
  const filePath = path.resolve(__dirname, "../../frontend/manager/dashboard.html");
  console.log("✓ Serving manager dashboard from:", filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("✗ Error serving manager dashboard:", err.message);
      res.status(500).send(`Error loading dashboard: ${err.message}`);
    }
  });
});

app.get("/employee/dashboard.html", (req, res) => {
  const filePath = path.resolve(__dirname, "../../frontend/employee/dashboard.html");
  console.log("✓ Serving employee dashboard from:", filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("✗ Error serving employee dashboard:", err.message);
      res.status(500).send(`Error loading dashboard: ${err.message}`);
    }
  });
});

// Root route - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/index.html"));
});

// Basic middleware setup
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Security headers (configured to allow static file serving)
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for static files
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
}));

// Serve static files from frontend directory (AFTER explicit routes)
// Express will match app.get() routes before app.use() middleware, so dashboard routes above will be hit first
app.use(express.static(path.join(__dirname, "../../frontend")));

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

app.use("/api/manager", require("./routes/manager.routes"));

app.use("/api/audit", require("./routes/audit.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Employee Management API running" });
});

// Test route to verify dashboard route is registered
app.get("/test-dashboard", (req, res) => {
  res.json({ 
    message: "Dashboard routes are registered",
    adminPath: path.resolve(__dirname, "../../frontend/admin/dashboard.html"),
    fileExists: require("fs").existsSync(path.resolve(__dirname, "../../frontend/admin/dashboard.html"))
  });
});

// 404 handler for non-API routes (serve index.html for SPA routing)
app.use((req, res, next) => {
  // Skip API routes - return JSON 404
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found",
    });
  }
  // For other non-API routes (like root), serve index.html
  // Dashboard routes are handled explicitly above
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
