const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { validateRequest } = require("../helper/common-function.helper");

const addData = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string.require(),
    modelId: Joi.string().guid().required(),
    price: Joi.number.require(),
  });
  validateRequest(req, res, next, schema, "body");
};

const deactivateProduct = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const enableProduct = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

module.exports = {
  addData,
  deactivateProduct,
  enableProduct,
};
