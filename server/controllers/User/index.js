const { verifyAccess, verifyRefresh } = require("../utils/token");
const { User, Resume } = require("../../models");

module.exports = {
  getUserInfo: async (req, res) => {
    const { email } = verifyAccess(req.accessToken);
    try {
      const user = await User.findOne({
        where: {
          email,
        },
        include: {
          model: Resume,
          as: "Resumes",
        },
      });

      if (!user) {
        return res.status(404).json({ message: "no user" });
      }

      return res.status(200).json({ nickname: user.nickname, resumes: user.Resumes });
    } catch (err) {
      console.log(err);
    }
  },
  editUserInfo: (req, res) => {
    const { email } = verifyAccess(req.accessToken);
    res.send(email);
  },
  deleteUserInfo: async (req, res) => {
    const { email } = verifyAccess(req.accessToken);

    const { id } = await User.findOne({ where: { email } });

    try {
      await User.destroy({ where: { id } });
      return res.status(200).json({ message: "userInfo delete success" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "cannot delete user from database" });
    }
  },
};
