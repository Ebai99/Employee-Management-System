const ManagerService = require("../services/manager.service");

class ManagerController {
  static async team(req, res, next) {
    try {
      const team = await ManagerService.getTeam(req.user.id);
      res.json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }

  static async reports(req, res, next) {
    try {
      const reports = await ManagerService.getTeamReports(req.user.id);
      res.json({ success: true, data: reports });
    } catch (error) {
      next(error);
    }
  }

  static async getTeamMembers(req, res, next) {
    try {
      const teamMembers = await ManagerService.getTeamMembers(req.user.id);
      res.json({
        success: true,
        data: teamMembers,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAvailableEmployees(req, res, next) {
    try {
      const availableEmployees = await ManagerService.getAvailableEmployees(
        req.user.id,
      );
      res.json({
        success: true,
        data: availableEmployees,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addTeamMember(req, res, next) {
    try {
      const { employeeId } = req.body;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: "Employee ID is required",
        });
      }

      await ManagerService.addTeamMember(req.user.id, employeeId);

      res.json({
        success: true,
        message: "Team member added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeTeamMember(req, res, next) {
    try {
      const { employeeId } = req.params;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: "Employee ID is required",
        });
      }

      const removed = await ManagerService.removeTeamMember(
        req.user.id,
        employeeId,
      );

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: "Team member not found",
        });
      }

      res.json({
        success: true,
        message: "Team member removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ManagerController;
