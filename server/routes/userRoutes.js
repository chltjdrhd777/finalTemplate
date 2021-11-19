const express = require("express");
const router = express.Router();
const { getUserInfo, editUserInfo, deleteUserInfo } = require("../controllers/User");
const verifyAceess = require("../middleware/verifyAccessToken");

router
  .route("/userInfo")
  .get(verifyAceess, getUserInfo)
  .put(verifyAceess, editUserInfo)
  .delete(verifyAceess, deleteUserInfo);

module.exports = router;
