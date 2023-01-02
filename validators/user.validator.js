const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { validateRequest } = require("../helper/common-function.helper");

const complexityOptions = {
  min: 4,
  max: 16,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

const loginSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const createUserSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string.require(),
    email: Joi.string().email().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
    role: Joi.string().min(1).required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const emailFileSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const mailParse = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });
  validateRequest(req, res, next, schema, "params");
};
const deactivateUserSchema = async (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "body");
};
const userDetailsSchema = async (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "params");
};
module.exports = {
  loginSchema,
  createUserSchema,
  emailFileSchema,
  mailParse,
  deactivateUserSchema,
  userDetailsSchema,
};
