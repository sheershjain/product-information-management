'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }
  Comment.init(
    {
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "product",
          key: "id",
        },
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "comment",
      modelName: "Comment",
    }
  );
  return Comment;
};