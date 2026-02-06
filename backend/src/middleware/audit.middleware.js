const AuditService = require("../services/audit.service");

module.exports = (action, entity = null) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      if (!req.user || res.statusCode >= 400) return;

      await AuditService.log({
        actorId: req.user.id,
        actorRole: req.user.role,
        action,
        entity,
        entityId: req.params.id || null,
        req,
      });
    });

    next();
  };
};
