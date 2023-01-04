const { commonErrorHandler } = require("../helper/error-handler.helper");
const userService = require("../services/user.service");

const loginUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
   const data = await userService.loginUser(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { userId: userId } = req.body;
    const refreshToken = req.headers["authorization"];

    const data = await userService.refreshToken(refreshToken, userId);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const emailFile = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.emailFile(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};
const createUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.createUser(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const mailParse = async (req, res, next) => {
  try {
    const { params: payload } = req;
    const data = await userService.mailParse(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const userDetail = async (req, res, next) => {
  try {
    const payload = {
      userId: req.user.id,
    };
    const data = await userService.userDetail(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.deactivateUser(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const detailById = async (req, res, next) => {
  try {
    const { params: payload } = req;
    const data = await userService.detailById(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const userDetailById = async (req, res, next) => {
   try {
     const { params: payload } = req;
     const data = await userService.userDetailById(payload);
     res.data = data;
     next();
   } catch (error) {
     commonErrorHandler(req, res, error.message, 400, error);
   }
}

const forgetPassword = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.forgetPassword(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const resetPassword= async (req, res, next) => {
  try {
    const { body: payload } = req;
    const params = req.params.token;
    const data = await userService.resetPassword(payload, params);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  loginUser,
  refreshToken,
  emailFile,
  createUser,
  mailParse,
  deactivateUser,
  userDetail,
  detailById,
  userDetailById,
  forgetPassword,
  resetPassword
};
