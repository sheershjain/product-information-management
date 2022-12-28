"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductVariationDataMapping extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "id",
      });
      this.belongsTo(models.ProductVariationData, {
        foreignKey: "product_variation_data_id",
        targetKey:"id"
      });
    }
  }
  ProductVariationDataMapping.init(
    {
      ProductId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "product",
          key: "id",
        },
      },
      ProductVariationDataId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "product_variation_data",
          key: "id",
        },
      },
      additional_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "product_variation_data_mapping",
      modelName: "ProductVariationDataMapping",
    }
  );
  return ProductVariationDataMapping;
};
