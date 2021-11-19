const express = require("express");
const router = express.Router();
const { login, logout, signup, getAccessToken } = require("../controllers/Auth");

router.post("/login", login);

router.get("/logout", logout);

router.post("/signup", signup);

router.get("/accessToken", getAccessToken);

module.exports = router;
