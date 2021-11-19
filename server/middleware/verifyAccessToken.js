const { genAccess, verifyAccess, verifyRefresh } = require("../controllers/utils/token");
const { User } = require("../models");

module.exports = (req, res, next) => {
  try {
    //1. if access token valid
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (verifyAccess(accessToken)) {
      const { email } = verifyAccess(accessToken);

      //if no user
      const user = User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "no user" });

      //else
      req.accessToken = accessToken;
      next();
    } else if (verifyRefresh(refreshToken)) {
      //2. if refresh token valid
      const { email } = verifyRefresh(refreshToken);

      //if no user
      const user = User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "no user" });

      //else
      const newAccessToken = genAccess({ email });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
      });
      req.accessToken = newAccessToken;
      next();
    } else {
      return res.status(401).json({ message: "no valid authorization. please login again" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "token validation process failed" });
  }
};
