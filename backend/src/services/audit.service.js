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
    await query(
      `
      INSERT INTO activity_logs
      (actor_id, actor_role, action, entity, entity_id, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        actorId,
        actorRole,
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
