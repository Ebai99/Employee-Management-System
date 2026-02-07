# Employee Management System - Project Context

## Project Overview

A comprehensive full-stack Employee Management System designed for ICT Hubs and organizations, featuring role-based access control, attendance tracking, task management, performance metrics, and comprehensive audit logging.

### Technology Stack

**Backend:**
- Node.js with Express.js
- MySQL 2 (v3.9.0)
- JWT Authentication
- RESTful API Architecture

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5/CSS3
- Responsive Design
- Chart.js for visualizations

**Security:**
- Helmet.js for HTTP headers
- bcrypt for password hashing
- Rate limiting
- CORS configuration
- Input validation

---

## Complete File and Folder Structure

```
employee-management-system/
│
├── .git/                          # Git version control
│
├── backend/                       # Node.js/Express backend application
│   ├── node_modules/             # npm dependencies (not tracked)
│   │
│   ├── src/                      # Source code directory
│   │   │
│   │   ├── config/               # Configuration files
│   │   │   ├── db.js            # MySQL database configuration
│   │   │   ├── dbTest.js        # Database testing utilities
│   │   │   └── jwt.js           # JWT configuration (secret, expiry)
│   │   │
│   │   ├── constants/            # Application constants
│   │   │   └── roles.js         # Role definitions (ADMIN, MANAGER, EMPLOYEE, etc.)
│   │   │
│   │   ├── controllers/          # Request handlers
│   │   │   ├── admin.controller.js        # Admin management operations
│   │   │   ├── attendance.controller.js   # Clock in/out operations
│   │   │   ├── audit.controller.js        # Audit log access
│   │   │   ├── auth.controller.js         # Login/authentication
│   │   │   ├── break.controller.js        # Break management
│   │   │   ├── employee.controller.js     # Employee CRUD operations
│   │   │   ├── export.controller.js       # CSV/PDF export handlers
│   │   │   ├── manager.controller.js      # Manager operations
│   │   │   ├── metrics.controller.js      # Performance metrics
│   │   │   ├── report.controller.js       # Report generation
│   │   │   └── task.controller.js         # Task management
│   │   │
│   │   ├── cron/                 # Scheduled jobs
│   │   │   ├── index.js         # Cron job initialization
│   │   │   ├── dailyMetrics.cron.js      # Daily metrics calculation
│   │   │   └── weeklyReports.cron.js     # Weekly report generation
│   │   │
│   │   ├── middleware/           # Express middleware
│   │   │   ├── audit.middleware.js       # Activity logging
│   │   │   ├── auth.middleware.js        # JWT verification
│   │   │   ├── error.middleware.js       # Centralized error handling
│   │   │   ├── rateLimit.middleware.js   # Request rate limiting
│   │   │   ├── role.middleware.js        # Role-based access control
│   │   │   └── validate.middleware.js    # Input validation
│   │   │
│   │   ├── models/               # Data models (database interaction patterns)
│   │   │   ├── ActivityLog.js   # Activity/audit log model
│   │   │   ├── Admin.js         # Admin user model
│   │   │   ├── Attendance.js    # Attendance record model
│   │   │   ├── Break.js         # Break record model
│   │   │   ├── Employee.js      # Employee model
│   │   │   ├── Report.js        # Report model
│   │   │   ├── Task.js          # Task model
│   │   │   └── TaskLog.js       # Task time tracking model
│   │   │
│   │   ├── routes/               # API route definitions
│   │   │   ├── admin.employee.routes.js  # Admin employee management routes
│   │   │   ├── admin.routes.js           # Admin dashboard routes
│   │   │   ├── attendance.routes.js      # Attendance routes
│   │   │   ├── audit.routes.js           # Audit log routes
│   │   │   ├── auth.routes.js            # Authentication routes
│   │   │   ├── break.routes.js           # Break management routes
│   │   │   ├── export.routes.js          # Export routes
│   │   │   ├── manager.routes.js         # Manager dashboard routes
│   │   │   ├── metrics.routes.js         # Metrics routes
│   │   │   ├── report.routes.js          # Report routes
│   │   │   └── task.routes.js            # Task routes
│   │   │
│   │   ├── scripts/              # Utility scripts
│   │   │   ├── createAdmin.js   # Initial admin account creation
│   │   │   └── initDb.js        # Database initialization
│   │   │
│   │   ├── services/             # Business logic layer
│   │   │   ├── admin.service.js          # Admin business logic
│   │   │   ├── attendance.service.js     # Attendance logic
│   │   │   ├── audit.service.js          # Audit logging logic
│   │   │   ├── auth.service.js           # Authentication logic
│   │   │   ├── break.service.js          # Break management logic
│   │   │   ├── employee.service.js       # Employee management logic
│   │   │   ├── export.service.js         # Export generation logic
│   │   │   ├── manager.service.js        # Manager operations logic
│   │   │   ├── metrics.service.js        # Metrics calculation logic
│   │   │   ├── report.service.js         # Report generation logic
│   │   │   └── task.service.js           # Task management logic
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── accessCode.generator.js   # Employee access code generator
│   │   │   ├── dailyMetrics.js           # Daily metrics utilities
│   │   │   ├── db.helper.js              # Database query helper
│   │   │   ├── password.util.js          # Password hashing/comparison
│   │   │   └── token.util.js             # JWT token utilities
│   │   │
│   │   ├── validators/           # Input validation schemas
│   │   │   └── employee.validator.js     # Employee data validators
│   │   │
│   │   ├── app.js               # Express app configuration
│   │   └── testAdmin.js         # Admin testing script
│   │
│   ├── .env                     # Environment variables (not tracked)
│   ├── package.json             # npm package configuration
│   ├── package-lock.json        # npm dependency lock file
│   └── server.js                # Application entry point
│
├── database/                    # Database scripts
│   ├── schema.sql              # Database schema definition
│   └── seed.sql                # Initial data seeding
│
├── frontend/                   # Frontend application
│   │
│   ├── assets/                 # Shared assets
│   │   │
│   │   ├── css/               # Stylesheets
│   │   │   ├── animations.css # Animation definitions
│   │   │   ├── base.css       # Base/reset styles
│   │   │   ├── components.css # Reusable component styles
│   │   │   ├── dashboard.css  # Dashboard layout styles
│   │   │   ├── sidebar.css    # Sidebar navigation styles
│   │   │   └── style.css      # Main stylesheet
│   │   │
│   │   └── js/                # JavaScript modules
│   │       ├── api.js         # API wrapper/fetch utilities
│   │       ├── auth.js        # Authentication logic
│   │       ├── charts.js      # Chart rendering utilities
│   │       ├── sidebar.js     # Sidebar interaction logic
│   │       └── ui.js          # UI helper functions (toasts, modals, etc.)
│   │
│   ├── admin/                  # Admin dashboard
│   │   ├── dashboard.html     # Admin dashboard page
│   │   ├── script.js          # Admin dashboard logic
│   │   └── style.css          # Admin-specific styles
│   │
│   ├── employee/               # Employee dashboard
│   │   ├── dashboard.html     # Employee dashboard page
│   │   ├── script.js          # Employee dashboard logic
│   │   └── style.css          # Employee-specific styles
│   │
│   ├── manager/                # Manager dashboard
│   │   ├── dashboard.html     # Manager dashboard page
│   │   ├── script.js          # Manager dashboard logic
│   │   └── style.css          # Manager-specific styles
│   │
│   └── index.html              # Login page (application entry)
│
├── BACKEND_HEALTH_CHECK.md     # Backend health verification document
├── DATABASE_INCONSISTENCIES_FIXED.md  # Database fix documentation
└── project-context.md          # Previous project context (this replaces it)
```

---

## Detailed Component Breakdown

### Backend Architecture

#### 1. Entry Points & Configuration

**`server.js`**
- Application bootstrapping
- Port configuration
- Server startup
- Error handling at startup

**`src/app.js`**
- Express app initialization
- Middleware setup:
  - CORS configuration
  - Helmet security headers
  - JSON parsing
  - Request logging (Morgan)
  - Rate limiting
  - Error handling
- Route registration
- Cron job initialization

**`src/config/`**
- `db.js`: MySQL connection pool configuration
- `jwt.js`: JWT secret and expiration settings
- `dbTest.js`: Database connection testing utilities

#### 2. Data Layer

**Database Schema (`database/schema.sql`)**

Tables:
1. **admins**
   - Fields: id, name, email, password_hash, role, is_active, created_at, updated_at
   - Roles: SUPER_ADMIN, ADMIN, MANAGER

2. **employees**
   - Fields: id, employee_code, firstname, lastname, email, access_code_hash, manager_id, status, created_by, created_at, updated_at
   - Status: ACTIVE, INACTIVE, SUSPENDED

3. **attendance**
   - Fields: id, employee_id, clock_in, clock_out, total_hours
   - Tracks daily attendance records

4. **breaks**
   - Fields: id, employee_id, attendance_id, break_start, break_end, duration_minutes
   - Links to attendance records

5. **tasks**
   - Fields: id, employee_id, title, description, priority, deadline, status, created_at, updated_at
   - Priority: low, medium, high
   - Status: pending, active, completed

6. **task_logs**
   - Fields: id, task_id, start_time, end_time, duration_minutes, description
   - Time tracking for tasks

7. **reports**
   - Fields: id, employee_id, type, report_date, content, created_at
   - Stores generated reports

8. **performance_metrics**
   - Fields: id, employee_id, metric_date, attendance_hours, tasks_completed, productivity_score
   - Daily performance metrics

9. **activity_logs**
   - Fields: id, actor_type, actor_id, action, entity, entity_id, ip_address, user_agent, created_at
   - Comprehensive audit trail

**Models (`src/models/`)**
- Define data access patterns
- Use `db.helper` for database operations
- Provide CRUD interfaces for each entity

#### 3. API Layer

**Routes (`src/routes/`)**

| Route File | Base Path | Description |
|------------|-----------|-------------|
| auth.routes.js | `/api/auth` | Login, token refresh |
| admin.routes.js | `/api/admin` | Admin dashboard operations |
| admin.employee.routes.js | `/api/admin/employees` | Employee management |
| manager.routes.js | `/api/manager` | Manager operations |
| employee.controller.js | `/api/employee` | Employee profile |
| attendance.routes.js | `/api/attendance` | Clock in/out |
| break.routes.js | `/api/breaks` | Break management |
| task.routes.js | `/api/tasks` | Task CRUD |
| report.routes.js | `/api/reports` | Report generation |
| metrics.routes.js | `/api/metrics` | Performance metrics |
| audit.routes.js | `/api/audit` | Audit logs |
| export.routes.js | `/api/export` | CSV/PDF exports |

**Controllers (`src/controllers/`)**
- Handle HTTP requests
- Validate input
- Call service layer
- Format responses
- Handle errors

**Services (`src/services/`)**
- Contain business logic
- Database transactions
- Data validation
- Business rule enforcement
- Integration with external services

#### 4. Middleware Stack

**`auth.middleware.js`**
- Extracts and verifies JWT tokens
- Attaches user info to request
- Handles token expiration

**`role.middleware.js`**
- Enforces role-based access control
- Supports multiple roles per endpoint
- Hierarchical role checking

**`audit.middleware.js`**
- Logs all user actions
- Captures IP address and user agent
- Tracks entity changes

**`validate.middleware.js`**
- Uses express-validator
- Validates request body, params, query
- Returns structured validation errors

**`rateLimit.middleware.js`**
- Prevents abuse
- Configurable per route
- IP-based limiting

**`error.middleware.js`**
- Centralized error handling
- Consistent error responses
- Logging of errors

#### 5. Utilities

**`db.helper.js`**
```javascript
// Provides:
- query(sql, params) // Execute queries
- Connection pool management
- Error handling
- Transaction support
```

**`password.util.js`**
```javascript
// Provides:
- hashPassword(password) // Hash passwords
- comparePassword(plain, hash) // Verify passwords
```

**`token.util.js`**
```javascript
// Provides:
- generateToken(payload) // Create JWT
- verifyToken(token) // Validate JWT
- refreshToken(oldToken) // Refresh JWT
```

**`accessCode.generator.js`**
```javascript
// Generates secure employee access codes
```

#### 6. Scheduled Jobs (`src/cron/`)

**`dailyMetrics.cron.js`**
- Runs: Daily at midnight
- Calculates:
  - Total attendance hours
  - Tasks completed
  - Productivity scores
- Stores in `performance_metrics` table

**`weeklyReports.cron.js`**
- Runs: Monday mornings
- Generates:
  - Weekly summaries
  - Team performance reports
  - Trend analysis

---

### Frontend Architecture

#### 1. Login System (`index.html`)

**Features:**
- Role-based login (Admin/Manager/Employee)
- Email/Employee code input
- Password/Access code authentication
- Remember me functionality
- Error handling and validation
- Responsive design

**Flow:**
1. User selects role
2. Enters credentials
3. Submits to `/api/auth/login`
4. Receives JWT token
5. Redirects to appropriate dashboard

#### 2. Dashboard Pages

**Admin Dashboard (`admin/dashboard.html`)**

Sections:
- **Overview**: System statistics, active employees, today's attendance
- **Employee Management**: 
  - Create/Edit/Delete employees
  - Assign managers
  - View employee details
  - Generate access codes
- **Manager Assignment**: Assign employees to managers
- **Reports**: System-wide reports and exports
- **Audit Logs**: View all system activity
- **Settings**: System configuration

**Manager Dashboard (`manager/dashboard.html`)**

Sections:
- **Team Overview**: Team statistics, attendance summary
- **Team Members**: View assigned employees
- **Attendance Monitoring**: Real-time team attendance
- **Task Management**: Assign and track team tasks
- **Team Reports**: Performance reports for team
- **Metrics**: Team productivity metrics

**Employee Dashboard (`employee/dashboard.html`)**

Sections:
- **Attendance**: 
  - Clock in/out buttons
  - Current status
  - Today's hours
- **Breaks**: Start/end break, break history
- **Tasks**:
  - Assigned tasks
  - Active tasks with timers
  - Completed tasks
- **Reports**: Personal performance reports
- **Profile**: View/edit profile information

#### 3. Shared Assets

**JavaScript Modules (`assets/js/`)**

**`api.js`** - API Communication
```javascript
const API = {
  baseURL: 'http://localhost:5000/api',
  
  // Methods:
  get(endpoint)
  post(endpoint, data)
  put(endpoint, data)
  delete(endpoint)
  
  // Features:
  - Automatic token injection
  - Error handling
  - Response parsing
  - Network error handling
}
```

**`auth.js`** - Authentication
```javascript
// Functions:
login(credentials) // Login user
logout() // Clear session
getToken() // Get stored token
isAuthenticated() // Check auth status
getUserRole() // Get user role
redirectToDashboard() // Role-based redirect
```

**`ui.js`** - UI Utilities
```javascript
// Functions:
showToast(message, type) // Toast notifications
showLoader() // Show loading state
hideLoader() // Hide loading state
showModal(title, content) // Display modal
confirmDialog(message) // Confirmation dialog
formatDate(date) // Date formatting
formatTime(time) // Time formatting
```

**`sidebar.js`** - Navigation
```javascript
// Functions:
toggleSidebar() // Open/close sidebar
setActiveMenuItem(item) // Highlight active nav
```

**`charts.js`** - Data Visualization
```javascript
// Functions:
renderAttendanceChart(data) // Attendance trends
renderTaskChart(data) // Task completion
renderPerformanceChart(data) // Performance metrics
```

**CSS Architecture (`assets/css/`)**

- **`base.css`**: Reset, typography, colors, spacing
- **`components.css`**: Buttons, cards, forms, tables
- **`dashboard.css`**: Dashboard grid, layout
- **`sidebar.css`**: Navigation sidebar
- **`animations.css`**: Transitions, keyframes
- **`style.css`**: Main stylesheet, imports all others

---

## API Endpoints Reference

### Authentication
```
POST   /api/auth/login          # Login
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/logout         # Logout (optional)
```

### Admin
```
GET    /api/admin/dashboard     # Admin dashboard data
GET    /api/admin/employees     # List all employees
POST   /api/admin/employees     # Create employee
GET    /api/admin/employees/:id # Get employee details
PUT    /api/admin/employees/:id # Update employee
DELETE /api/admin/employees/:id # Delete employee
POST   /api/admin/assign-manager # Assign manager to employee
GET    /api/admin/managers      # List all managers
```

### Manager
```
GET    /api/manager/dashboard   # Manager dashboard
GET    /api/manager/team        # Team members
GET    /api/manager/team/attendance # Team attendance
GET    /api/manager/team/tasks  # Team tasks
POST   /api/manager/team/tasks  # Assign task to team member
GET    /api/manager/team/reports # Team reports
```

### Employee
```
GET    /api/employee/profile    # Employee profile
PUT    /api/employee/profile    # Update profile
GET    /api/employee/tasks      # Assigned tasks
GET    /api/employee/reports    # Personal reports
```

### Attendance
```
POST   /api/attendance/clock-in  # Clock in
POST   /api/attendance/clock-out # Clock out
GET    /api/attendance/current   # Current attendance
GET    /api/attendance/history   # Attendance history
```

### Breaks
```
POST   /api/breaks/start        # Start break
POST   /api/breaks/end          # End break
GET    /api/breaks/current      # Current break
GET    /api/breaks/history      # Break history
```

### Tasks
```
GET    /api/tasks               # List tasks
POST   /api/tasks               # Create task
GET    /api/tasks/:id           # Get task
PUT    /api/tasks/:id           # Update task
DELETE /api/tasks/:id           # Delete task
POST   /api/tasks/:id/start     # Start task timer
POST   /api/tasks/:id/stop      # Stop task timer
POST   /api/tasks/:id/complete  # Complete task
```

### Reports
```
GET    /api/reports             # List reports
POST   /api/reports/generate    # Generate report
GET    /api/reports/:id         # Get report
```

### Metrics
```
GET    /api/metrics/daily       # Daily metrics
GET    /api/metrics/weekly      # Weekly metrics
GET    /api/metrics/employee/:id # Employee metrics
GET    /api/metrics/team/:id    # Team metrics
```

### Audit
```
GET    /api/audit/logs          # Audit logs
GET    /api/audit/logs/:id      # Specific audit log
```

### Export
```
GET    /api/export/attendance/csv # Attendance CSV
GET    /api/export/attendance/pdf # Attendance PDF
GET    /api/export/tasks/csv    # Tasks CSV
GET    /api/export/reports/pdf  # Reports PDF
```

---

## Environment Configuration

### Required Environment Variables (`.env`)

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=employee_management
DB_PORT=3306

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

---

## Database Setup & Management

### Initial Setup

1. **Create Database**
```bash
mysql -u root -p
CREATE DATABASE employee_management;
USE employee_management;
```

2. **Run Schema**
```bash
mysql -u root -p employee_management < database/schema.sql
```

3. **Seed Data**
```bash
mysql -u root -p employee_management < database/seed.sql
```

4. **Or use npm script**
```bash
cd backend
npm run db:init
```

### Create Initial Admin

```bash
cd backend
npm run admin:create
```

---

## Development Workflow

### Backend Development

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Initialize Database**
```bash
npm run db:init
npm run admin:create
```

4. **Start Development Server**
```bash
npm run dev  # Uses nodemon for auto-reload
```

5. **Production**
```bash
npm start
```

### Frontend Development

1. **Open in Browser**
   - Simply open `frontend/index.html` in a browser
   - Or use a local server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js http-server
npx http-server frontend -p 3000
```

2. **Login Credentials**
   - Admin: Use credentials from `npm run admin:create`
   - Employee: Use seeded employee codes and access codes

---

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Token expiration and refresh
- Secure password hashing (bcrypt)
- Access code system for employees

### Data Protection
- SQL injection prevention (parameterized queries)
- XSS protection (Helmet.js)
- CSRF protection
- Input validation and sanitization
- Rate limiting

### Audit Trail
- All user actions logged
- IP address tracking
- User agent logging
- Entity change tracking
- Timestamp on all records

---

## Performance Optimizations

### Backend
- Database connection pooling
- Indexed database columns
- Efficient query design
- Caching strategies
- Pagination on list endpoints

### Frontend
- Minimal dependencies
- CSS optimization
- Lazy loading
- Local storage for tokens
- Debounced search/filter

---

## Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for API endpoints
- Database transaction tests
- Authentication tests
- Authorization tests

### Frontend Testing
- Manual testing checklist
- Cross-browser compatibility
- Responsive design testing
- API integration testing

---

## Deployment Considerations

### Backend Deployment
1. **Environment**: Production `.env` configuration
2. **Database**: Ensure MySQL is accessible
3. **Process Manager**: Use PM2 or similar
4. **Reverse Proxy**: Nginx or Apache
5. **SSL**: Configure HTTPS
6. **Monitoring**: Application and database monitoring
7. **Backups**: Database backup strategy

### Frontend Deployment
1. **Static Hosting**: Nginx, Apache, or CDN
2. **API Configuration**: Update API base URL
3. **Build Process**: Optional bundling
4. **Caching**: Configure cache headers

---

## Extending the System

### Adding a New Feature

**Example: Adding "Leave Management"**

1. **Database**
```sql
-- Add to schema.sql
CREATE TABLE leaves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  leave_type ENUM('sick', 'vacation', 'personal'),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected'),
  reason TEXT,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

2. **Model** (`src/models/Leave.js`)
```javascript
module.exports = {
  create: (leaveData) => { /* ... */ },
  findById: (id) => { /* ... */ },
  update: (id, data) => { /* ... */ },
  delete: (id) => { /* ... */ }
};
```

3. **Service** (`src/services/leave.service.js`)
```javascript
const Leave = require('../models/Leave');

exports.requestLeave = async (employeeId, leaveData) => {
  // Business logic
};

exports.approveLeave = async (leaveId, adminId) => {
  // Business logic
};
```

4. **Controller** (`src/controllers/leave.controller.js`)
```javascript
const leaveService = require('../services/leave.service');

exports.requestLeave = async (req, res, next) => {
  // Handle request
};
```

5. **Routes** (`src/routes/leave.routes.js`)
```javascript
router.post('/request', auth, requestLeave);
router.put('/:id/approve', auth, role(['ADMIN', 'MANAGER']), approveLeave);
```

6. **Frontend**
   - Add leave request form
   - Add leave status display
   - Update relevant dashboards

---

## Common Tasks & Commands

### Database
```bash
# Reset database
mysql -u root -p employee_management < database/schema.sql

# Backup database
mysqldump -u root -p employee_management > backup.sql

# Restore database
mysql -u root -p employee_management < backup.sql
```

### Backend
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Start production
npm start

# Create admin
npm run admin:create

# Initialize database
npm run db:init
```

### Debugging
```bash
# Check database connection
node backend/src/config/dbTest.js

# Check admin creation
node backend/src/scripts/createAdmin.js

# Manual database queries
mysql -u root -p employee_management
```

---

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
- Check MySQL is running
- Verify credentials in `.env`
- Check database name exists
- Verify DB_PORT is correct

**2. Authentication Errors**
- Check JWT_SECRET is set
- Verify token expiration settings
- Clear browser local storage
- Check CORS settings

**3. Employee Cannot Login**
- Verify employee status is ACTIVE
- Check access code is correct
- Ensure employee_code exists
- Check audit logs for failed attempts

**4. CORS Errors**
- Update CORS_ORIGIN in `.env`
- Check frontend is on allowed origin
- Verify headers in `src/app.js`

**5. Rate Limiting Issues**
- Adjust RATE_LIMIT_MAX_REQUESTS
- Check IP address forwarding
- Review rate limit configuration

---

## Key Design Patterns

### Backend Patterns
- **Layered Architecture**: Controllers → Services → Models
- **Dependency Injection**: Services receive dependencies
- **Middleware Chain**: Sequential request processing
- **Error Handling**: Centralized error middleware
- **Repository Pattern**: Models abstract database access

### Frontend Patterns
- **Module Pattern**: Separate concerns in JS files
- **Observer Pattern**: Event-driven updates
- **Singleton**: API and Auth modules
- **Template Pattern**: Consistent component structure

---

## Performance Metrics

### Response Time Targets
- Authentication: < 200ms
- Dashboard load: < 500ms
- Report generation: < 2s
- Export (CSV): < 1s
- Export (PDF): < 3s

### Database Query Optimization
- Use indexes on foreign keys
- Limit result sets with LIMIT
- Use JOIN instead of multiple queries
- Cache frequently accessed data

---

## Security Checklist

- [ ] All passwords hashed with bcrypt
- [ ] JWT tokens properly validated
- [ ] Role-based access enforced
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Audit logging enabled
- [ ] HTTPS in production
- [ ] Environment variables secured
- [ ] Database credentials protected

---

## Future Enhancements

### Planned Features
- Real-time notifications (WebSocket)
- Email notifications
- Leave management system
- Performance review module
- Document management
- Mobile app (React Native)
- Advanced analytics dashboard
- Integration with third-party HR tools
- Biometric attendance
- Geolocation tracking

### Technical Improvements
- TypeScript migration
- GraphQL API option
- Redis caching
- Elasticsearch for logs
- Docker containerization
- CI/CD pipeline
- Automated testing
- Load balancing
- Microservices architecture

---

## Support & Maintenance

### Regular Maintenance Tasks
- Database backup (daily)
- Log rotation (weekly)
- Dependency updates (monthly)
- Security audit (quarterly)
- Performance review (quarterly)

### Monitoring
- Server uptime
- API response times
- Database query performance
- Error rates
- User activity

---

## License & Credits

**License**: [Specify your license]

**Dependencies**: See `package.json` for full list of dependencies and licenses

**Contributors**: [List contributors]

---

## Contact & Support

For issues, questions, or contributions:
- **GitHub Issues**: [Repository URL]
- **Email**: [Support email]
- **Documentation**: [Documentation URL]

---

*Last Updated: February 2026*
*Version: 1.0.0*
