const crypto = require("crypto");

const generateAccessCode = () => {
  return crypto.randomBytes(4).toString("hex"); // 8 chars
};

module.exports = generateAccessCode;
