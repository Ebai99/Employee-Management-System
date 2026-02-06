const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
