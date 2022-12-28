'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemField extends Model {
    static associate(models) {
      this.hasMany(models.ProductDataMapping, {
        foreignKey: "item_id",
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
  ItemField.init(
    {
      newAttribute: { type: DataTypes.STRING },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "ItemField",
      tableName: "item_field",
    }
  );
  return ItemField;
};