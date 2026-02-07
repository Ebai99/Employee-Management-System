const Admin = require("../models/Admin");
const { comparePassword } = require("../utils/password.util");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token.util");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

class AuthService {
  static async adminLogin(email, password) {
    const admin = await Admin.findByEmail(email);

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await comparePassword(password, admin.password_hash);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      id: admin.id,
      role: admin.role,
      type: "ADMIN",
    };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "ADMIN",
      },
    };
  }

  static async employeeLogin(employee_code, access_code) {
    const employee = await Employee.findByCode(employee_code);

    if (!employee) {
      throw new Error("Invalid credentials");
    }

    if (employee.status !== "ACTIVE") {
      throw new Error("Account is inactive. Contact admin.");
    }

    const isMatch = await bcrypt.compare(
      access_code,
      employee.access_code_hash,
    );

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({
      id: employee.id,
      role: "EMPLOYEE",
      employee_code: employee.employee_code,
    });

    return {
      accessToken,
      employee: {
        employee_code: employee.employee_code,
        firstname: employee.firstname,
        lastname: employee.lastname,
        email: employee.email,
      },
    };
  }

  static async managerLogin(manager_code, access_code) {
    const manager = await Employee.findByCode(manager_code);

    if (!manager) {
      throw new Error("Invalid credentials");
    }

    if (manager.role !== "MANAGER") {
      throw new Error("Invalid credentials");
    }

    if (manager.status !== "ACTIVE") {
      throw new Error("Account is inactive. Contact admin.");
    }

    const isMatch = await bcrypt.compare(access_code, manager.access_code_hash);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({
      id: manager.id,
      role: "MANAGER",
      employee_code: manager.employee_code,
    });

    return {
      accessToken,
      manager: {
        manager_code: manager.employee_code,
        firstname: manager.firstname,
        lastname: manager.lastname,
        email: manager.email,
      },
    };
  }

  static async setupPassword(employee_code, access_code, new_password) {
    const employee = await Employee.findByCode(employee_code);

    if (!employee) {
      throw new Error("Invalid employee code");
    }

    // Verify access code
    const isMatch = await bcrypt.compare(
      access_code,
      employee.access_code_hash,
    );

    if (!isMatch) {
      throw new Error("Invalid access code");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update employee with new password hash (replace access code with password)
    await Employee.updatePasswordHash(employee_code, hashedPassword);

    return {
      success: true,
      message: "Password set successfully",
    };
  }
}

module.exports = AuthService;
