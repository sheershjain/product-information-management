'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductDataMapping extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
      }),
        this.belongsTo(models.ItemField, {
          foreignKey: "item_id",
        });
    }
  }
  ProductDataMapping.init(
    {
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'product',
          key:'id'
        }
      },
      item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'itemField',
          key:"id"
        }
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "product_data_mapping",
      tableName: "ProductDataMapping",
    }
  );
  return ProductDataMapping;
};