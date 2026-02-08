-- admins (extended role support)
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER') DEFAULT 'ADMIN',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- employees
CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  telephone VARCHAR(50),
  address VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  department VARCHAR(100),
  access_code_hash VARCHAR(255) NOT NULL,
  role ENUM('EMPLOYEE', 'MANAGER') NOT NULL DEFAULT 'EMPLOYEE',
  manager_id INT NULL,
  status ENUM('ACTIVE','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admins(id),
  FOREIGN KEY (manager_id) REFERENCES admins(id)
);

-- activity_logs (already good, just add user_agent for better auditing)
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  actor_type ENUM('ADMIN','EMPLOYEE') NOT NULL,
  actor_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity VARCHAR(50) NULL,
  entity_id INT NULL,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- attendance, breaks, tasks, etc.
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  clock_in DATETIME NOT NULL,
  clock_out DATETIME NULL,
  total_hours DECIMAL(5,2) NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS  breaks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  attendance_id INT NOT NULL,
  break_start DATETIME NOT NULL,
  break_end DATETIME NULL,
  duration_minutes INT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (attendance_id) REFERENCES attendance(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('low','medium','high') DEFAULT 'medium',
  deadline DATE NULL,
  status ENUM('pending','active','completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS task_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NULL,
  duration_minutes INT NULL,
  description TEXT,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  report_date DATE NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  metric_date DATE NOT NULL,
  attendance_hours DECIMAL(5,2) DEFAULT 0,
  tasks_completed INT DEFAULT 0,
  productivity_score INT DEFAULT 0,
  UNIQUE KEY uniq_emp_date (employee_id, metric_date),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- team_members mapping
CREATE TABLE IF NOT EXISTS team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  manager_id INT NOT NULL,
  employee_id INT NOT NULL,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_manager_employee (manager_id, employee_id),
  FOREIGN KEY (manager_id) REFERENCES employees(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);