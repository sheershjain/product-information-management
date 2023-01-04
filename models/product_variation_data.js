'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariationData extends Model {
    static associate(models) {
      this.belongsTo(models.ProductVariation, {
        foreignKey: "product_variation_id",
        targetKey:"id"
      });
      this.hasMany(models.ProductVariationDataMapping, {
        foreignKey: "product_variation_data_id",
      });
    }
  }
  ProductVariationData.init(
    {
      ProductVariationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "product_variation",
          key: "id",
        },
      },
      DataValue: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "product_variation_data",
      modelName: "ProductVariationData",
    }
  );
  return ProductVariationData;
};