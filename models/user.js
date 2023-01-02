"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM(['SADM','ADM','USR']),
        allowNull: false,
        defaultValue:'USR'
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "user",
      modelName: "User",
    }
  );
  return User;
};
