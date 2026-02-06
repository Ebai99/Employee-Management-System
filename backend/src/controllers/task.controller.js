const TaskService = require("../services/task.service");

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
