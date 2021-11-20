require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const db = require("./models");
const fs = require("fs");
const https = require("https");
const path = require("path");

//1. initial setting
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

//2. routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const kakaoRoutes = require("./routes/oauth/kakaoRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/kakao", kakaoRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    data: null,
    message: "not found",
  });
});
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    data: null,
    message: "something wrong",
  });
});

//3. connection
const PORT = process.env.HTTPS_PORT || 5000;

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  const options = {
    key: fs.readFileSync(path.resolve("key.pem"), "utf8"),
    cert: fs.readFileSync(path.resolve("cert.pem"), "utf8"),
  };
  https.createServer(options, app).listen(PORT, () => console.log(`now listening port ${PORT}`));
} else {
  app.listen(PORT, () => {
    console.log(`now listening port : ${PORT}`);
  });
}

let user;
let social;

db.sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    //return db.User.create({});
    return db.User.findOne({ where: { id: 3 } });
  })
  .then((data) => {
    //console.log(data);
    user = data;
    //return user.createSocial({ socialType: "kakao", email: "test5@c.a", nickname: "test5" });
    return db.Social.findOne({ where: { id: 9 } });
  })
  .then((data) => {
    social = data;
    social.setUser(user);
  })
  .then(() => console.log("successfully initialized sequelize"))
  .catch((err) => console.log(err));

// db.User.bulkCreate([{}, {}, {}]);
// db.Social.bulkCreate([
//   { socialType: "kakao", email: "test1@c.a", nickname: "test1" },
//   { socialType: "kakao", email: "test2@c.a", nickname: "test2" },
//   { socialType: "kakao", email: "test3@c.a", nickname: "test3" },
// ]);
// return db.User.findOne({ where: { id: 1 } });
