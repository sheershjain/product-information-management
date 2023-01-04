const { Router } = require("express");
const controller = require("../controller");
const { checkRefreshToken, checkAccessToken } = require("../middleware/auth");
const validator = require("../validators");
const genericResponse = require("../helper/generic-response.helper");
const serialization = require("../serialization");
const router = Router();

router.post(
  "/login",
  validator.userValidator.loginSchema,
  controller.User.loginUser,
  genericResponse.sendResponse
);
router.get(
  "/refresh-token",
  checkRefreshToken,
  controller.User.refreshToken,
  genericResponse.sendResponse
);
router.get(
  "/profile",
  checkAccessToken,
  controller.User.userDetail,
  serialization.userSerialization.userDetail,
  genericResponse.sendResponse
);
router.post(
  "/forget-password",
  validator.userValidator.forgetPassword,
  controller.User.forgetPassword,
  genericResponse.sendResponse
);

router.post(
  "/reset-password/:token",
  validator.userValidator.resetPasswordSchemaToken,
  validator.userValidator.resetPasswordSchema,
  controller.User.resetPassword,
  genericResponse.sendResponse
);
module.exports = router;
