const Joi = require("joi");
const { validateRequest } = require("../helper/common-function.helper");

const newAttributeAdd = async (req, res, next) => {
  const schema = Joi.object({
    newAttribute: Joi.string().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const updateAttribute = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().guid().required(),
    newAttribute: Joi.string().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const commonValidator = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

module.exports = {
  newAttributeAdd,
  commonValidator,
  updateAttribute,
};
