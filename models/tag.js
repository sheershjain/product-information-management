'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
   
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        targetKey:'id'
      })
    }
  }
  Tag.init(
    {
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'product',
          key:'id'
        }
      },
      tagName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Tag",
      tableName: "tag",
    }
  );
  return Tag;
};