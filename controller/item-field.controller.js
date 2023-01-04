const { commonErrorHandler } = require("../helper/error-handler.helper");
const fieldService = require("../services/item-field.service");

const newAttributeAdd = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await fieldService.newAttributeAdd(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const updateAttribute = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await fieldService.updateAttribute(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const enableAttribute = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await fieldService.enableAttribute(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deactivateAttribute = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await fieldService.deactivateAttribute(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  newAttributeAdd,
  updateAttribute,
  enableAttribute,
  deactivateAttribute,
};
