const express = require("express");
const router = express.Router();
const { login, logout, signup } = require("../controllers/Auth/kakao");

router.post("/login", login);

router.get("/logout", logout);

router.post("/signup", signup);

module.exports = router;
