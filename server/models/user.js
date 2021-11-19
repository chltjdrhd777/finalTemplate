"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {},
    {
      sequelize,
      modelName: "User",
      freezeTableName: true,
    }
  );
  return User;
};
