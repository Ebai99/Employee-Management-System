# Frontend Implementation Testing Guide

**Purpose:** Verify that all frontend components are working correctly and properly integrated with the backend API.

---

## 🔍 Pre-Testing Checklist

- [ ] Backend server is running (typically `node backend/server.js`)
- [ ] Database is accessible and seeded with test data
- [ ] All frontend files are in correct location:
  - [ ] `/frontend/admin/dashboard.html` and `script.js`
  - [ ] `/frontend/manager/dashboard.html` and `script.js`
  - [ ] `/frontend/employee/dashboard.html` and `script.js`
  - [ ] `/frontend/assets/js/` directory with all utility files
  - [ ] `/frontend/assets/css/components.css`

---

## 🧪 Quick Verification (5 minutes)

### 1. Check Browser Console for Errors

1. Open Admin Dashboard in browser
2. Press `F12` to open Developer Tools
3. Check **Console** tab for errors
4. Should see: No red errors (warnings OK)

### 2. Check Network Requests

1. Open **Network** tab
2. Refresh the page
3. Look for API requests to:
   - `/admin/dashboard` (GET) - ✅ Should return 200
   - `/admin/employees` (GET) - ✅ Should return 200
   - `/audit/logs` (GET) - ✅ Should return 200
4. Any `401` or `403` indicates authentication issue
5. Any `404` indicates backend endpoint doesn't exist

### 3. Verify Authentication Guard

1. Clear localStorage: `localStorage.clear()`
2. Reload admin dashboard
3. Should redirect to `/index.html` (login page)
4. Login as admin user
5. Should load dashboard successfully

---

## 👤 Step-by-Step Testing by Role

### ADMIN DASHBOARD

#### Test 1: Dashboard Loads Successfully

1. Navigate to `/frontend/admin/dashboard.html`
2. **Expected:** Page loads with topbar + sidebar + KPI cards
3. **Check:**
   - [ ] User info shows at top (from JWT token)
   - [ ] 4 KPI cards visible with numbers
   - [ ] Charts render without errors in console
   - [ ] No "undefined" values in stats

#### Test 2: Employee Search (API Integration)

1. In Employee Management section, find search box
2. Type employee name or email
3. **Expected:** Table updates with filtered employees (debounced - wait 300ms)
4. **Check:**
   - [ ] Search works with partial matches
   - [ ] Table shows Name, Email, Department, Status columns
   - [ ] Action buttons visible (Edit, Assign, Disable)

#### Test 3: Create New Employee

1. Click "Add Employee" button
2. **Expected:** Modal appears with form
3. Fill in:
   - [ ] First Name: "John"
   - [ ] Last Name: "Doe"
   - [ ] Email: "john.doe@company.com"
   - [ ] Department: "Engineering"
   - [ ] Position: "Software Developer"
4. Click "Save Employee"
5. **Expected:**
   - [ ] Loading state shows
   - [ ] API call to `POST /admin/employees` succeeds (check Network tab)
   - [ ] Success toast notification appears
   - [ ] Access Code modal appears with credentials
   - [ ] Employee appears in table

#### Test 4: Assign Manager to Employee

1. Find employee in table and click "Assign Manager"
2. **Expected:** Modal appears with manager dropdown
3. Select a manager from dropdown
4. Click "Assign"
5. **Expected:**
   - [ ] API call to `PUT /admin/employees/{code}/manager` succeeds
   - [ ] Toast notification shows success
   - [ ] Employee table updates
   - [ ] Modal closes

#### Test 5: Edit Employee

1. Click "Edit" on an employee row
2. **Expected:** Form modal appears with pre-filled data
3. Change a field (e.g., Department)
4. Click "Save Employee"
5. **Expected:**
   - [ ] API call to `PUT /admin/employees/{code}` succeeds
   - [ ] Toast shows success
   - [ ] Table updates with new values

#### Test 6: Disable/Activate Employee

1. Find employee and click "Disable" button
2. **Expected:** Confirmation dialog appears
3. Click "Confirm"
4. **Expected:**
   - [ ] API call to `PATCH /admin/employees/{code}/disable` succeeds
   - [ ] Status badge changes to "INACTIVE"
   - [ ] Button changes to "Activate"

#### Test 7: Activity Log Auto-Refresh

1. Watch Activity Feed section
2. Create/Edit/Disable an employee
3. **Expected:** New activity appears in feed within 2 minutes (auto-refresh interval)
4. **Check:**
   - [ ] Timestamp shows
   - [ ] Action description visible
   - [ ] No duplicate entries

#### Test 8: Charts Render

1. Scroll to charts section
2. **Expected:** Two charts visible
   - Employee Growth (line chart)
   - By Department (doughnut chart)
3. **Check:**
   - [ ] No console errors
   - [ ] Legend visible for department chart
   - [ ] Numbers match KPI cards

---

### MANAGER DASHBOARD

#### Test 1: Dashboard Loads Successfully

1. Navigate to `/frontend/manager/dashboard.html`
2. Login as manager user (role: MANAGER)
3. **Expected:** Page loads with team stats
4. **Check:**
   - [ ] 4 KPI cards visible (Team Size, Tasks Completed, Pending Tasks, Avg Performance)
   - [ ] Charts render
   - [ ] Team table shows members

#### Test 2: Team Members Load

1. Look at Team Overview table
2. **Expected:** Shows list with columns: Member, Role, Progress, Status
3. **Check:**
   - [ ] Data loads from `GET /manager/team/members`
   - [ ] Progress bars visible (should be between 0-100%)
   - [ ] Status badges color-coded

#### Test 3: Team Attendance Filter

1. Find Team Attendance section with date picker
2. Keep default date (today) or select a date
3. **Expected:** Attendance stats show:
   - [ ] Present count
   - [ ] Absent count
   - [ ] On Leave count
4. **Check:**
   - [ ] Numbers update when date changes
   - [ ] Auto-refreshes every 1 minute

#### Test 4: Team Tasks Filter

1. Find Team Tasks section
2. Click filter buttons: "All" → "Pending" → "Completed"
3. **Expected:** Task list updates for each filter
4. **Check:**
   - [ ] API calls to `GET /manager/team/tasks?filter=` work
   - [ ] Task count matches filter
   - [ ] Task status badges visible

#### Test 5: Charts Display Correctly

1. Look at Performance and Task charts
2. **Expected:** Both render without errors
3. **Check:**
   - [ ] No console errors
   - [ ] Y-axis labeled
   - [ ] X-axis shows weeks or months

---

### EMPLOYEE DASHBOARD

#### Test 1: Dashboard Loads Successfully

1. Navigate to `/frontend/employee/dashboard.html`
2. Login as employee user (role: EMPLOYEE)
3. **Expected:** Page loads with attendance card
4. **Check:**
   - [ ] KPI cards show: Clock In Status, Break Status, Active Tasks, Performance Score
   - [ ] Clock In/Out buttons visible and enabled
   - [ ] Charts render

#### Test 2: Clock In/Out Functionality

1. Click "Clock In" button
2. **Expected:**
   - [ ] Button becomes disabled
   - [ ] "Clock Out" button becomes enabled
   - [ ] Status badge changes to "CLOCKED_IN"
   - [ ] Hours Worked displays "0 hours worked" initially
   - [ ] Hours display updates every 1 second

3. Wait 2-3 seconds and observe timer
4. **Expected:** Timer increments (00:00:02, 00:00:03, etc.)
5. Click "Clock Out" button
6. **Expected:**
   - [ ] API call to `POST /employee/attendance/clock-out` succeeds
   - [ ] Status badge changes back to "Not Clocked In"
   - [ ] Clock In button enabled, Clock Out button disabled
   - [ ] Success toast shows

#### Test 3: Break Start/End

1. Click "Clock In" first (if not already clocked in)
2. Click "Start Break"
3. **Expected:**
   - [ ] Break Status badge changes to "On Break"
   - [ ] Toast shows "Break started"
4. Click "End Break"
5. **Expected:**
   - [ ] Break Status changes to "Working"
   - [ ] Toast shows "Break ended"

#### Test 4: Break History

1. Start and end several breaks
2. Look at Break History section
3. **Expected:** Shows list of breaks with times and durations
4. **Check:**
   - [ ] Timestamps visible
   - [ ] Durations calculated correctly

#### Test 5: My Tasks List

1. Look at My Tasks section on page
2. **Expected:** Shows list of assigned tasks with:
   - [ ] Task title
   - [ ] Priority badge (High/Medium/Low with colors)
   - [ ] Due date
   - [ ] Complete button

3. Click "Complete" on a task
4. **Expected:**
   - [ ] Confirmation dialog appears
   - [ ] API call to `POST /employee/tasks/{id}/complete` succeeds
   - [ ] Task removed from list or status updated
   - [ ] Success toast shows

#### Test 6: Charts and Performance

1. Scroll to charts section
2. **Expected:** Two charts visible
   - Hours Worked (bar chart - 5 days)
   - Performance Trend (line chart - 6 months)
3. **Check:**
   - [ ] No console errors
   - [ ] Charts render correctly
   - [ ] Legends visible if applicable

---

## 🔐 Authentication Tests

#### Test 1: Token Expiration Handling

1. Get current token from localStorage:
   ```javascript
   console.log(localStorage.getItem("token"));
   ```
2. Try to manually expire it (if possible in test environment)
3. Make an API call or refresh page
4. **Expected:** Redirected to login page with message

#### Test 2: Role-Based Access Control

1. Admin dashboard:
   - Login as MANAGER user
   - Try to access `/admin/dashboard.html`
   - **Expected:** Redirect to login with "Insufficient permissions"

2. Manager dashboard:
   - Login as EMPLOYEE user
   - Try to access `/manager/dashboard.html`
   - **Expected:** Redirect to login

3. Employee dashboard:
   - Login as ADMIN user
   - Try to access `/employee/dashboard.html`
   - **Expected:** Redirect to login

#### Test 3: Logout Functionality

1. On any dashboard, click Logout button
2. **Expected:**
   - [ ] Confirmation dialog appears
   - [ ] After confirming, redirected to login page
   - [ ] localStorage cleared (token, role)
   - [ ] Can't access dashboard without logging in again

---

## ⚠️ Common Issues & Solutions

### Issue: "Cannot find element with ID X"

**Cause:** HTML element ID doesn't match JavaScript code
**Solution:**

1. Check browser console for errors
2. Verify element ID in HTML matches script (e.g., `id="clockInBtn"`)
3. Reload page

### Issue: API calls return 404

**Cause:** Backend endpoint doesn't exist or path is wrong
**Solution:**

1. Check Network tab → API calls
2. Verify endpoint path matches backend routes
3. Check if backend is running
4. Test endpoint with Postman/curl

### Issue: API calls return 401/403

**Cause:** Token missing or invalid
**Solution:**

1. Check if user is logged in
2. Check localStorage: `localStorage.getItem('token')`
3. If token exists, check expiration: `parseJwt(token)`
4. If expired, login again

### Issue: Toast notifications don't show

**Cause:** ui.js not loaded or CSS missing
**Solution:**

1. Check Network tab → `/assets/js/ui.js` loaded
2. Check Network tab → `/assets/css/components.css` loaded
3. Check for JavaScript errors in console
4. Verify script load order in HTML

### Issue: Charts don't render

**Cause:** Chart.js not loaded or canvas element missing
**Solution:**

1. Check Network tab → Chart.js CDN loaded
2. Verify canvas element IDs in HTML match script (e.g., `id="performanceChart"`)
3. Check console for chart library errors
4. Ensure chart data is not empty

### Issue: Search/Filter not working

**Cause:** Debounce delay or API issue
**Solution:**

1. Wait 300ms after typing (debounce delay)
2. Check Network tab for API calls
3. Verify API returns filtered results correctly
4. Check console for errors

### Issue: Page looks broken (missing styles)

**Cause:** CSS files not loading
**Solution:**

1. Check Network tab → `/assets/css/components.css` status
2. Check `style.css` loads for dashboard-specific styles
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for CSS errors

---

## 📊 Performance Testing

### Load Testing Checklist

- [ ] Admin dashboard loads in < 3 seconds
- [ ] API calls complete in < 2 seconds
- [ ] No memory leaks (check Chrome DevTools Memory tab)
- [ ] Auto-refresh intervals don't stack (check Network tab)

### Network Tab Inspection

1. Open Network tab
2. Filter by XHR (API calls)
3. **Check for:**
   - [ ] Correct HTTP methods (GET, POST, PUT, PATCH)
   - [ ] Correct status codes (200, 201, 400, 401, 404)
   - [ ] Request/response payloads contain expected data
   - [ ] Authorization header present: `Bearer {token}`

---

## ✅ Final Verification

### Before Deployment

- [ ] All 3 dashboards load without console errors
- [ ] Authentication guards work properly
- [ ] All API endpoints return correct data
- [ ] Form submissions work (create, edit, delete)
- [ ] Real-time features auto-update
- [ ] Charts render correctly
- [ ] Mobile view looks good (test at 768px)
- [ ] Toast notifications display properly
- [ ] Error messages are helpful
- [ ] Logout clears all data

### Sign-Off

Once all tests pass:

1. Document any failed tests and create issues
2. Update backend API if endpoints are missing
3. Test again if backend was modified
4. Schedule user acceptance testing (UAT)

---

## 🛠️ Debugging Commands

### Browser Console Commands

```javascript
// Check current user role
getCurrentRole();

// Check if authenticated
isAuthenticated();

// Get current token
getToken();

// Parse JWT to see payload
parseJwt(getToken());

// Check token expiration
isTokenExpired(getToken());

// Manually trigger API call (for testing)
apiRequest("/admin/dashboard");

// Clear all localStorage
localStorage.clear();

// Test notification
showToast("Test message", "success", 3000);
```

### Network Tab

- Filter by "XHR" to see only API calls
- Click on request to see headers, payload, response
- Check "Authorization" header for token
- Verify response status code (200 = success, 4xx = client error, 5xx = server error)

---

**Status:** Ready for comprehensive testing

Execute tests in order (Pre-Testing → Quick Verification → Role-Based Tests) for best results.
