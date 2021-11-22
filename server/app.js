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
const kakaoRoutes = require("./routes/kakaoRoutes");

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

db.sequelize
  .sync({ force: false, alter: true })
  .then(async () => {
    // await db.User.bulkCreate([{}, {}, {}]);
    // await db.KakaoSocial.bulkCreate([
    //   { email: "test1@c.a", nickname: "test1" },
    //   { email: "test2@c.a", nickname: "test2" },
    //   { email: "test3@c.a", nickname: "test3" },
    // ]);

    //const targetUser = await db.User.findOne({ where: { id: 2 } });
    //console.log(await targetUser.getKakaoSocials({ where: { id: 1 } }));
    //const allSocial = await targetUser.countKakaoSocials();
    //await targetUser.addKakaoSocials(allSocial);
    // const targetSocial = await db.KakaoSocial.findOne({ where: { id: 1 } });
    // await targetUser.removeKakaoSocials(targetSocial);
    // db.User.destroy({ where: { id: 1 } });
    // const targetSocial = await db.KakaoSocial.findOne();
    // await targetUser.setKakaoSocial(targetSocial);

    //! for N:M practice
    // await db.Customer.bulkCreate([
    //   { customerName: "anderson1" },
    //   { customerName: "anderson2" },
    //   { customerName: "anderson3" },
    // ]);
    // await db.Product.bulkCreate([
    //   { productName: "product1" },
    //   { productName: "product2" },
    //   { productName: "product3" },
    // ]);

    // const targetCustomer = await db.Customer.findOne({ where: { customerName: "anderson1" } });
    // const targetProduct = await db.Product.findAll();
    // await targetCustomer.addProducts(targetProduct);

    // const targetProduct = await db.Product.findOne({ where: { productName: "product2" } });
    // const targetUser = await db.Customer.findAll();
    // await targetProduct.addCustomers(targetUser);

    console.log("successfully initialized sequelize");
  })
  .catch((err) => console.log(err));

// db.User.bulkCreate([{}, {}, {}]);
// db.Social.bulkCreate([
//   { socialType: "kakao", email: "test1@c.a", nickname: "test1" },
//   { socialType: "kakao", email: "test2@c.a", nickname: "test2" },
//   { socialType: "kakao", email: "test3@c.a", nickname: "test3" },
// ]);
// return db.User.findOne({ where: { id: 1 } });
