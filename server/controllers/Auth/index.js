const { genAccess, genRefresh, verifyAccess, verifyRefresh } = require("../utils/token");
const { User } = require("../../models");
const { hashPassword, decodePassword } = require("../utils/bycript");
const axios = require("axios");

module.exports = {
  login: async (req, res) => {
    try {
      //1. user exist
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email } });
      if (!user) return res.status(404).json({ message: "no user" });

      //2. password verification
      decodePassword(password, user.password, (err, result) => {
        if (err) return res.status(500).json({ message: "decode failed" });
        if (!result) return res.status(400).json({ message: "wrong password" });

        const accessToken = genAccess({
          email,
        });
        const refreshToken = genRefresh({
          email,
        });

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
        });

        res.status(200).json({ message: "login success" });
      });
    } catch (err) {
      console.log(err);
    }
  },
  logout: (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "logout success" });
    //1. accessToken check;
    // const accessToken = req.cookies.accessToken;
    // const refreshToken = req.cookies.refreshToken;

    // if (verifyAccess(accessToken) || verifyRefresh(refreshToken)) {
    //   res.clearCookie("accessToken");
    //   res.clearCookie("refreshToken");
    //   return res.status(200).json({ message: "logout success" });
    // } else {
    //   return res.status(401).json({ message: "no accessToken or expired" });
    // }
  },
  signup: async (req, res) => {
    //1. email validation
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) return res.status(403).json({ message: "user already exist" });

    //2.add user
    hashPassword(password, async (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "password hashing failed" });

      try {
        await User.create({ email, password: hashedPassword });
        const accessToken = genAccess({
          email,
        });
        const refreshToken = genRefresh({
          email,
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
        });
        res.status(200).json({ message: "signup success" });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "add user to database failed" });
      }
    });
  },
  getAccessToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    //1. refresh token check
    const checkRefresh = verifyRefresh(refreshToken);
    if (!checkRefresh) {
      return res.status(401).json({ message: "no refresh token or expired. plase login again" });
    }

    //2. regenerate refresh token
    try {
      //if there is no user
      const { email } = checkRefresh;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: "no user" });

      //else
      delete user.dataValues.password;
      const newAccessToken = genAccess(user.dataValues);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
      });
      res.status(200).json({ message: "access token refreshed" });
    } catch (err) {
      console.log(err);
    }
  },
};
