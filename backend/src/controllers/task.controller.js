const TaskService = require("../services/task.service");
const Task = require("../models/Task");

class TaskController {
  // ADMIN
  static async assign(req, res, next) {
    try {
      const taskId = await TaskService.assignTask(req.body);
      res.json({ success: true, taskId });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  // MANAGER - Create task for team member
  static async createTask(req, res, next) {
    try {
      const { employee_id, title, description, priority, deadline } = req.body;
      const managerId = req.user.id;

      if (!employee_id || !title) {
        const err = new Error("Employee and title are required");
        err.statusCode = 400;
        throw err;
      }

      const taskId = await Task.create({
        manager_id: managerId,
        employee_id,
        title,
        description,
        priority: priority || "medium",
        deadline,
      });

      res.json({ success: true, taskId });
    } catch (err) {
      err.statusCode = err.statusCode || 400;
      next(err);
    }
  }

  // MANAGER - Get all tasks assigned to team
  static async getTeamTasks(req, res, next) {
    try {
      const managerId = req.user.id;
      if (!managerId) {
        const err = new Error("Manager ID not found in token");
        err.statusCode = 401;
        throw err;
      }

      const tasks = await Task.getTeamTasks(managerId);
      res.json({ success: true, data: tasks });
    } catch (err) {
      console.error("Error in getTeamTasks:", err);
      err.statusCode = err.statusCode || 400;
      next(err);
    }
  }

  // MANAGER - Update task
  static async updateTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const { title, description, priority, deadline, status } = req.body;

      await Task.updateTask(taskId, {
        title,
        description,
        priority,
        deadline,
        status,
      });

      res.json({ success: true, message: "Task updated" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  // MANAGER - Delete task
  static async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;
      await Task.deleteTask(taskId);
      res.json({ success: true, message: "Task deleted" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  // EMPLOYEE
  static async start(req, res, next) {
    try {
      await TaskService.startTask(req.user.id, req.params.taskId);
      res.json({ success: true, message: "Task started" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  static async complete(req, res, next) {
    try {
      const { description } = req.body;
      await TaskService.completeTask(
        req.user.id,
        req.params.taskId,
        description,
      );
      res.json({ success: true, message: "Task completed" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }
}

module.exports = TaskController;
