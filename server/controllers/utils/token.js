require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

module.exports = {
  genAccess: (data) => sign(data, process.env.ACCESS_SECRET, { expiresIn: "1h" }),
  genRefresh: (data) => sign(data, process.env.REFRESH_SECRET, { expiresIn: "3d" }),
  verifyAccess: (accessToken) => {
    //1. check token exist
    if (!accessToken) return null;

    //2. check verification
    try {
      return verify(accessToken, process.env.ACCESS_SECRET);
    } catch (_) {
      return null;
    }
  },
  verifyRefresh: (refreshToken) => {
    //1. check token exist
    if (!refreshToken) return null;

    //2. check verification
    try {
      return verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (_) {
      return null;
    }
  },
};
