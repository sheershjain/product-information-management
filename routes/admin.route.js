const { Router } = require("express");
const controller = require("../controller");
const { checkAccessToken } = require("../middleware/auth");
const { checkRole } = require("../middleware/check-role");
const validator = require("../validators");
const genericResponse = require("../helper/generic-response.helper");
const serialization = require("../serialization");
const router = Router();

router.post(
  "/email-file",
  checkAccessToken,
  checkRole,
  validator.userValidator.emailFileSchema,
  controller.User.emailFile,
  genericResponse.sendResponse
);

router.get(
  "/get-email-data/:email",
  checkAccessToken,
  checkRole,
  validator.userValidator.mailParse,
  controller.User.mailParse,
  genericResponse.sendResponse
);

router.post(
  "/create-user",
  checkAccessToken,
  checkRole,
  controller.User.createUser,
  serialization.userSerialization.createUser,
  genericResponse.sendResponse
);

router.delete(
  "/deactivate-user",
  checkAccessToken,
  checkRole,
  validator.userValidator.deactivateUserSchema,
  controller.User.deactivateUser,
  genericResponse.sendResponse
);
router.get(
  "/user-details/:id",
  checkAccessToken,
  checkRole,
  controller.User.detailById,
  serialization.userSerialization.userDetail,
  genericResponse.sendResponse
);
router.post(
  "/data",
  checkAccessToken,
  checkRole,
  controller.Map.main,
  genericResponse.sendResponse
);

router.get(
  "/get-all-data",
  checkAccessToken,
  checkRole,
  validator.productValidator.getAllData,
  controller.Product.getAllData,
  genericResponse.sendResponse
);


router.delete(
  "/deactivate-product",
  checkAccessToken,
  checkRole,
  validator.productValidator.deactivateProduct,
  controller.Product.deactivateProduct,
  genericResponse.sendResponse
);

router.patch(
  "/enable-product",
  checkAccessToken,
  checkRole,
  validator.productValidator.enableProduct,
  controller.Product.enableProduct,
  genericResponse.sendResponse
);

router.post(
  "/new-item-field",
  checkAccessToken,
  checkRole,
  validator.itemField.newAttributeAdd,
  controller.itemField.newAttributeAdd,
  genericResponse.sendResponse
);

router.patch(
  "/update-item-field",
  checkAccessToken,
  checkRole,
  validator.itemField.updateAttribute,
  controller.itemField.updateAttribute,
  genericResponse.sendResponse
)
router.delete(
  "/deactivate-item-field",
  checkAccessToken,
  checkRole,
  validator.itemField.commonValidator,
  controller.itemField.deactivateAttribute,
  genericResponse.sendResponse
)
router.patch(
  "/enable-item-field",
  checkAccessToken,
  checkRole,
  validator.itemField.commonValidator,
  controller.itemField.enableAttribute,
  genericResponse.sendResponse
);
module.exports = router;
