"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//! Relation
const { User, Social } = db;
User.hasOne(Social, { onDelete: "CASCADE" }); //userId가 Social 테이블에 등록(foreign key 옵션으로 변경가능)
Social.belongsTo(User, { onDelete: "CASCADE" });
// const { Resume, User, CompanyLink } = db;
// Resume.belongsTo(User, {
//   foreignKey: "user_id", //외래키 등록
//   targetKey: "id", //외래키 타겟
//   onDelete: "cascade",
// });

// User.hasMany(Resume, {
//   foreignKey: "user_id", //외래키 등록
//   sourceKey: "id", //외래키 소스
//   as: "Resumes",
//   //조인된 조회시 결과물들이 담길 키(조인할때도 명시해야 작동함)
// });

//정확히 말해 해당 구조는 1:N으로 해야한다.
//N:M이 되려면, M에 해당하는 데이터베이스의 정보에 대해 링크들이 어딘가 프론트에서 리스트로 쭉 나오고, 유저가 그것을 선택할 수 있어야하는데
//그러면 그 클릭한 내용에 대해서 한쪽 테이블에 설정된 add이름() 함수를 이용하여 N:M 테이블에 그 관계가 넣어지지만
//해당 기능과는 핀트가 맞지 않는다.
// User.belongsToMany(CompanyLink, {
//   through: "CompanyLink_User", //N:M테이블명
//   foreignKey: "user_id", //테이블 컬럼이름
//   as: "CompanyLinks",
//   //조인된 결과 조회시 결과물이 담길 키(조인할때도 명시해야 작동함)
// });

// CompanyLink.belongsToMany(User, {
//   through: "CompanyLink_User",
//   foreignKey: "companyLink_id",
//   as: "UserList",
//   onDelete: "cascade",
// });

// const test = async () => {
//   const result = await db.User.findAll({
//     include: {
//       model: CompanyLink,
//       as: "CompanyLinks",
//     },
//   });
//   console.log(result);
// };

// test();

module.exports = db;
