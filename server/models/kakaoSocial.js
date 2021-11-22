"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KakaoSocial extends Model {}
  KakaoSocial.init(
    {
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
      modelName: "KakaoSocial",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return KakaoSocial;
};
