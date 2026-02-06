const { query } = require("../utils/db.helper");

class Admin {
  static async findByEmail(email) {
    const sql = `SELECT * FROM admins WHERE email = ? AND is_active = TRUE LIMIT 1`;
    const rows = await query(sql, [email]);
    return rows[0];
  }

  static async findById(id) {
    const sql = `SELECT id, name, email, role FROM admins WHERE id = ?`;
    const rows = await query(sql, [id]);
    return rows[0];
  }

  static async create({ name, email, passwordHash, role = "ADMIN" }) {
    const sql = `
      INSERT INTO admins (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [name, email, passwordHash, role]);
    return result.insertId;
  }
}

module.exports = Admin;
