const pool = require("../config/db");

const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const execute = async (sql, params = []) => {
  return await pool.execute(sql, params);
};

module.exports = { query, execute };
