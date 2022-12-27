'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
   
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey:'product_id'
      })
    }
  }
  Tag.init(
    {
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'product',
          key:id
        }
      },
      tag_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "tag",
      tableName: "Tag",
    }
  );
  return Tag;
};