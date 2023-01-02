const models = require("../models");

const newAttributeAdd = async (payload) => {
  const data = await models.ItemField.findOne({
    where: {
      newAttribute: payload.newAttribute,
    },
  });
  if (data) {
    throw new Error("Field already exists");
  }

  await models.ItemField.create({
    newAttribute: payload.newAttribute,
  });
  return `${payload.newAttribute} added`;
};

const updateAttribute = async (payload) => {
  const data = await models.ItemField.findOne({
    where: {
      id: payload.id,
    },
  });
  if (!data) {
    throw new Error("Field not exists");
  }

  await models.ItemField.update(
    { newAttribute: payload.newAttribute },
    {
      where: {
        id: payload.id,
      },
    }
  );
  return `${payload.newAttribute} attribute updated`;
};

const enableAttribute = async (payload) => {
  await models.ItemField.restore({ where: { id: payload.id } });
  return "Item field activated";
};
const deactivateAttribute = async (payload) => {
  const data = await models.ItemField.findOne({
    where: {
      id: payload.id,
    },
  });
  if (!data) {
    throw new Error("Field not exists");
  }
  await models.ItemField.destroy({ where: { id: payload.id } });
  return "Item field deactivated";
};

module.exports = {
  newAttributeAdd,
  updateAttribute,
  enableAttribute,
  deactivateAttribute,
};
