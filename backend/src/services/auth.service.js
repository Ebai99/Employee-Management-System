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
        role: admin.role,
      },
    };
  }

  static async employeeLogin(employee_code, access_code) {
    const employee = await Employee.findByCode(employee_code);

    if (!employee) {
      throw new Error("Invalid credentials");
    }

    if (employee.status !== "active") {
      throw new Error("Account is inactive. Contact admin.");
    }

    const isMatch = await bcrypt.compare(
      access_code,
      employee.access_code_hash,
    );

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: employee.id,
        role: "employee",
        employee_code: employee.employee_code,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return {
      token,
      employee: {
        employee_code: employee.employee_code,
        firstname: employee.firstname,
        lastname: employee.lastname,
        email: employee.email,
      },
    };
  }
}

module.exports = AuthService;
