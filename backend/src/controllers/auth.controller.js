const AuthService = require("../services/auth.service");

class AuthController {
  static async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.adminLogin(email, password);

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      error.statusCode = 401;
      next(error);
    }
  }

  // 👇 ADD THIS
  static async employeeLogin(req, res, next) {
    try {
      const { employee_code, access_code } = req.body;

      const result = await AuthService.employeeLogin(
        employee_code,
        access_code,
      );

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      error.statusCode = 401;
      next(error);
    }
  }
}

module.exports = AuthController;
