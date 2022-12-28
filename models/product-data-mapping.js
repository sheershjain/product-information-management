'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductDataMapping extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "id",
      }),
        this.belongsTo(models.ItemField, {
          foreignKey: "item_id",
          targetKey: "id",
        });
    }
    toJSON() {
      return {
        ...this.get(),
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
       
      };
    }
  }
  ProductDataMapping.init(
    {
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "product",
          key: "id",
        },
      },
      itemId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "item_field",
          key: "id",
        },
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "ProductDataMapping",
      tableName: "product_data_mapping",
    }
  );
  return ProductDataMapping;
};