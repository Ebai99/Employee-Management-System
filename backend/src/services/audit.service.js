const { query } = require("../utils/db.helper");

class AuditService {
  static async log({
    actorId,
    actorRole,
    action,
    entity = null,
    entityId = null,
    req,
  }) {
    // Map role to actor_type: ADMIN roles (SUPER_ADMIN, ADMIN, MANAGER) -> 'ADMIN', EMPLOYEE -> 'EMPLOYEE'
    const actorType = ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(actorRole)
      ? "ADMIN"
      : "EMPLOYEE";

    await query(
      `
      INSERT INTO activity_logs
      (actor_type, actor_id, action, entity, entity_id, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        actorType,
        actorId,
        action,
        entity,
        entityId,
        req.ip,
        req.headers["user-agent"],
      ],
    );
  }
}

module.exports = AuditService;
