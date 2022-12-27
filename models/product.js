"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
  
    static associate(models) {
      this.hasMany(models.ProductDataMapping, {
        foreignKey: "product_id",
      }),
        this.hasMany(models.Media, {
          foreignKey: "product_id",
        }),
        this.hasMany(models.Comment, {
          foreignKey: "product_id",
        }),
        this.hasMany(models.Tag, {
          foreignKey: "product_id",
        });
    }
  }
  Product.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      offer: {
        type: Sequelize.INTEGER,
      },
      sku_id: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "product",
      tableName: "Product",
    }
  );
  return Product;
};
