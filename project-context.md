## Project Overview

This repository contains a full-stack **Employee Management System** for an ICT Hub. It provides authentication and role-based dashboards for **admins**, **managers**, and **employees**, along with attendance tracking, breaks, tasks, reports, metrics, and audit logging.

## High-Level Architecture

- **Backend** (Node.js / Express, under `backend/`):
  - REST API exposing routes under `/api/*`.
  - MySQL database access via a shared `db.helper` utility and a consistent query pattern.
  - Layered design with **controllers**, **services**, **models** (implicit via db helper), and **middleware**.
  - Scheduled cron jobs for daily and weekly metrics and reports.
- **Frontend** (static HTML/CSS/JS, under `frontend/`):
  - Role-based dashboards for admin, manager, and employee.
  - A login screen (`frontend/index.html`) that authenticates users and redirects to the appropriate dashboard.
  - Reusable UI helpers and API wrapper scripts under `frontend/assets/js/`.
- **Database** (under `database/`):
  - `schema.sql` defines tables such as `admins`, `employees`, `activity_logs`, and related entities.
  - `seed.sql` seeds initial data (e.g., demo users, sample records).

## Backend Structure

- **Entry & Configuration**
  - Express app configured with CORS, Helmet, rate limiting, JSON parsing, logging, and centralized error handling.
  - Environment configuration via `.env` (port, DB connection, JWT secrets, etc.).
- **Routes & Controllers** (under `backend/src/controllers` and `backend/src/routes`):
  - `auth` – login, refresh tokens.
  - `admin` – employee management and manager assignment.
  - `manager` – team management, reports, and team metrics.
  - `employee/attendance/breaks/tasks/reports` – core employee workflows.
  - `metrics` – daily and team metrics endpoints.
  - `audit` – access to audit logs.
  - `export` – CSV/PDF export of key data.
  - `health` – health check endpoint for monitoring.
- **Services** (under `backend/src/services`):
  - Encapsulate business logic and all database access using `{ query }` from `db.helper`.
  - One service per major domain: `admin`, `auth`, `employee`, `manager`, `attendance`, `break`, `task`, `report`, `metrics`, `audit`, `export`.
- **Utilities** (under `backend/src/utils`):
  - `db.helper.js` – creates and manages MySQL connection pool and exposes a `query` helper.
  - `password.util.js` – password hashing and comparison using bcrypt.
  - `token.util.js` – JWT creation and verification helpers.
  - `accessCode.generator.js` – generates access codes for employees.
  - `dailyMetrics.js` – cron job for computing and storing daily metrics.
- **Middleware** (under `backend/src/middleware`):
  - `auth.middleware.js` – verifies JWT tokens.
  - `role.middleware.js` – enforces role-based access control (e.g., `ADMIN`, `SUPER_ADMIN`, `MANAGER`).
  - `audit.middleware.js` – logs user actions to `activity_logs`.
  - `validate.middleware.js` – integrates with `express-validator` and validator schemas (under `backend/src/validators`).
  - `error.middleware.js` – central error handling with consistent error responses.
  - `rate-limit.middleware.js` – throttles incoming requests.
- **Cron Jobs**
  - Daily metrics: runs at midnight to calculate core KPIs (attendance, productivity, etc.).
  - Weekly reports: runs on Mondays to generate and persist summary reports.

## Frontend Structure

- **Login Page** (`frontend/index.html`):
  - Simple branded login card with role selector (`admin`, `manager`, `employee`), identifier (email/employee code), and password/access code field.
  - Uses `assets/js/api.js`, `assets/js/ui.js`, and `assets/js/auth.js` to:
    - Call the backend API for login.
    - Handle loading states and error messages.
    - Store tokens (e.g., in local storage) and redirect to the correct dashboard.
- **Dashboards**
  - `frontend/admin/dashboard.html` – admin-facing dashboard for managing employees, managers, and overall system configuration.
  - `frontend/manager/dashboard.html` – manager-facing dashboard for team metrics, attendance, tasks, and reports.
  - `frontend/employee/dashboard.html` – employee-facing dashboard for clock in/out, breaks, tasks, and personal reports.
- **Assets**
  - `assets/css/*` – base styles, animations, common components, dashboard layout, and sidebar styling.
  - `assets/js/api.js` – wraps `fetch` calls to the backend (base URL, auth headers, error handling).
  - `assets/js/auth.js` – login logic, token handling, and redirect helpers.
  - `assets/js/sidebar.js` – toggles navigation sidebar and active states.
  - `assets/js/ui.js` – shared UI helpers (toasts, loaders, modals, etc.).
  - `assets/js/charts.js` – chart rendering for metrics (e.g., using a charting library).

## Database Layer

- **Schema & Seeds**
  - `database/schema.sql` – defines core tables:
    - `admins`, `employees`, `managers` (or role relations).
    - `attendance`, `breaks`, `tasks`, `reports`.
    - `activity_logs` and metrics-related tables.
  - `database/seed.sql` – inserts base/reference data and sample records.
- **Initialization Scripts**
  - `scripts/initDb.js` – runs `schema.sql` and `seed.sql` using `db.helper` to bootstrap the database.
  - `scripts/createAdmin.js` – creates an initial admin account for first-time setup.

## Operational Notes

- **Backend Health**:
  - See `BACKEND_HEALTH_CHECK.md` for detailed health status, verified components, and dependency versions.
  - Exposes `/api/health` endpoint for monitoring.
- **Environment & Running Locally**:
  - Requires a MySQL instance (compatible with mysql2 3.9.0).
  - Typical dev flow:
    1. Install dependencies: `cd backend && npm install`.
    2. Initialize DB: `npm run db:init`.
    3. Create admin: `npm run admin:create`.
    4. Start dev server: `npm run dev` (default port 5000).
    5. Open `frontend/index.html` in a browser and log in.

## How to Extend

- **Adding a new feature (e.g., “Performance Reviews”)**:
  1. Add tables/columns in `database/schema.sql` (and update seeds if needed).
  2. Create a service file in `backend/src/services` and use `db.helper` for queries.
  3. Add controller methods in `backend/src/controllers`.
  4. Register new routes and secure them with `auth`, `role`, and `audit` middleware.
  5. Extend frontend dashboards and `assets/js` utilities to consume the new endpoints.

This `project-context.md` is meant as a high-level mental map of the system. For detailed backend readiness and health, refer to `BACKEND_HEALTH_CHECK.md`.
