"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Social extends Model {}
  Social.init(
    {
      socialType: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      thumbImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Social",
      freezeTableName: true,
    }
  );
  return Social;
};
