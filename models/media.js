"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "id",
      });
    }
  }
  Media.init(
    {
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "product",
          key: "id",
        },
      },
      photoLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Media",
      tableName: "media",
    }
  );
  return Media;
};
