const productService = require("../services/product.service");
const { commonErrorHandler } = require("../helper/error-handler.helper");
const getAllData = async (req, res, next) => {
  try {
    const  query  = req.query;
    const data = await productService.getAllData(query);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const addData = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await productService.addData(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};
const deactivateProduct = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.deactivateProduct(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const enableProduct = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.enableProduct(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  getAllData,
  addData,
  deactivateProduct,
  enableProduct,
};
