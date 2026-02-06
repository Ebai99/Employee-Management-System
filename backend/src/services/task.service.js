const Task = require("../models/Task");
const TaskLog = require("../models/TaskLog");

class TaskService {
  // ADMIN
  static async assignTask(data) {
    return Task.create(data);
  }

  // EMPLOYEE
  static async startTask(employeeId, taskId) {
    const active = await Task.getActiveTask(employeeId);
    if (active) {
      throw new Error("Finish current task before starting another");
    }

    const task = await Task.findById(taskId);
    if (!task || task.employee_id !== employeeId) {
      throw new Error("Unauthorized task access");
    }

    await Task.updateStatus(taskId, "active");
    await TaskLog.start(taskId);
  }

  static async completeTask(employeeId, taskId, description) {
    const task = await Task.findById(taskId);
    if (!task || task.employee_id !== employeeId) {
      throw new Error("Unauthorized task access");
    }

    await TaskLog.end(taskId, description);
    await Task.updateStatus(taskId, "completed");
  }
}

module.exports = TaskService;
