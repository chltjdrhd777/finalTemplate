const { verifyAccess, verifyRefresh } = require("../utils/token");
const { User, Resume } = require("../../models");

module.exports = {
  editResume: async (req, res) => {
    const { resumeId } = req.params;

    const targetResume = await Resume.findOne({ where: { id: resumeId } });

    if (!targetResume || !Object.keys(req.body).length) {
      return res.status(400).json({ message: "there is no data to change" });
    }

    try {
      await Resume.update({ ...req.body }, { where: { id: resumeId } });
      res.status(200).json({ message: "edit resume success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "cannot update database" });
    }
  },
  addResume: async (req, res) => {
    const { email } = verifyAccess(req.accessToken);

    const { id: user_id } = await User.findOne({ where: { email } });

    try {
      await Resume.create({ ...req.body, user_id });
      return res.status(201).json({ message: "create resume successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "cannot create row on database" });
    }
  },
  deleteResume: async (req, res) => {
    const { resumeId } = req.params;
    try {
      await Resume.destroy({ where: { id: resumeId } });
      res.status(200).json({ message: "delete resume success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "cannot delete data from database" });
    }
  },
};
