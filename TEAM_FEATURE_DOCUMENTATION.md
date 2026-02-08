# Manager Team Section Implementation

## Overview

The Manager Dashboard now includes a complete **Team Section** that allows managers to:

1. View all team members in their department
2. Add employees from their department to their team
3. Remove team members from their team
4. View team member details (email, phone, status)

## Database Schema

### New Table: `team_members`

```sql
CREATE TABLE team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  manager_id INT NOT NULL,
  employee_id INT NOT NULL,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_manager_employee (manager_id, employee_id),
  FOREIGN KEY (manager_id) REFERENCES employees(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

## Backend Implementation

### Models

- **TeamMember.js** - Handles all database operations for team members:
  - `addTeamMember(managerId, employeeId)` - Add employee to manager's team
  - `removeTeamMember(managerId, employeeId)` - Remove from team
  - `getTeamMembers(managerId)` - Get all team members
  - `getAvailableEmployees(managerId, department)` - Get employees available to add
  - `getManagerDepartment(managerId)` - Get manager's department

### Services

- **ManagerService** - Business logic:
  - Validates employees are in the same department
  - Coordinates database operations
  - Manages error handling

### Controllers

- **ManagerController** - HTTP endpoints:
  - `getTeamMembers()` - Returns manager's team members
  - `getAvailableEmployees()` - Returns employees available to add
  - `addTeamMember()` - Adds employee to team
  - `removeTeamMember()` - Removes employee from team

### Routes

```
GET  /manager/team-members              - Get team members
GET  /manager/available-employees       - Get available employees
POST /manager/team-members              - Add team member
DELETE /manager/team-members/:employeeId - Remove team member
```

## Frontend Implementation

### HTML

- **Manager Dashboard** (`manager/dashboard.html`):
  - Added "My Team" navigation link that switches to team section
  - Team Section with:
    - Add Team Member button
    - Team members table showing name, email, phone, status
    - Remove button for each team member
  - Modal for selecting and adding employees

### JavaScript (`manager/script.js`)

New functions:

- `switchSection(section, event)` - Navigate between dashboard and team sections
- `loadTeamMembersTable()` - Load and display team members
- `loadAvailableEmployees()` - Load available employees for selection
- `addTeamMember(formData)` - Add employee to team via API
- `removeTeamMember(employeeId)` - Remove employee from team via API
- `renderTeamMembersTable(teamMembers)` - Render table with team data
- `getStatusClass(status)` - Get CSS class for status badge

### Styling (`manager/style.css`)

New CSS classes:

- `.badge`, `.badge-success`, `.badge-danger`, `.badge-warning`, `.badge-secondary` - Status indicators
- `.modal`, `.modal-content`, `.modal-header`, `.close-btn` - Modal styling
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger` - Button styles

## How to Use

### For Managers

1. Navigate to "My Team" in the sidebar
2. Click "+ Add Team Member" button
3. Select an employee from the same department
4. Click "Add to Team"
5. To remove a member, click the "Remove" button next to their name

### Features

- Only shows employees from the manager's department
- Prevents duplicate team members
- Shows team member status (ACTIVE, INACTIVE, SUSPENDED)
- Displays contact information (email, telephone)
- Automatic date tracking for when member was added

## Example Flow

1. Manager logs in → Dashboard loads
2. Manager clicks "My Team" → Team section displays
3. If no team members exist → Shows "No team members yet" message
4. Manager clicks "+ Add Team Member" → Modal opens with available employees
5. Manager selects an employee → Employee added to team_members table
6. Table refreshes → Shows new team member with Remove button
7. Manager can click Remove → Team member deleted from team

## Testing

To test the feature:

1. **Create test data**:

   ```sql
   -- Verify managers and employees exist in same department
   SELECT * FROM employees
   WHERE department = 'Engineering'
   AND role IN ('MANAGER', 'EMPLOYEE');
   ```

2. **Test endpoints**:

   ```bash
   # Get available employees
   curl -H "Authorization: Bearer TOKEN" \
     http://localhost:5000/manager/available-employees

   # Get team members
   curl -H "Authorization: Bearer TOKEN" \
     http://localhost:5000/manager/team-members

   # Add team member
   curl -X POST -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"employeeId": 5}' \
     http://localhost:5000/manager/team-members

   # Remove team member
   curl -X DELETE -H "Authorization: Bearer TOKEN" \
     http://localhost:5000/manager/team-members/5
   ```

3. **UI Testing**:
   - Login as a manager
   - Navigate to My Team section
   - Add an employee from the same department
   - Verify employee appears in table
   - Remove the employee
   - Verify removal is reflected

## Database Querying

### View all team members

```sql
SELECT
  e.firstname, e.lastname, e.email, e.department, tm.assigned_date
FROM team_members tm
JOIN employees e ON tm.employee_id = e.id
WHERE tm.manager_id = ?;
```

### View available employees for a manager

```sql
SELECT
  e.firstname, e.lastname, e.email,
  CASE WHEN tm.employee_id IS NOT NULL THEN 'In Team' ELSE 'Available' END as status
FROM employees e
LEFT JOIN team_members tm ON e.id = tm.employee_id
WHERE e.department = ? AND e.role = 'EMPLOYEE' AND e.status = 'ACTIVE';
```

## Notes

- Team members are stored in a separate `team_members` table
- All team members must be from the manager's department
- Managers can only have each employee once (UNIQUE constraint)
- Department is used as the primary filter for available employees
- Status updates are automatic based on employee status in main table
