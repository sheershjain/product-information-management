const { Router } = require("express");
const controller = require("../controller");
const { checkAccessToken } = require("../middleware/auth");
const { checkRole } = require("../middleware/check-role");
const validator = require("../validators");
const genericResponse = require("../helper/generic-response.helper");
const serialization = require("../serialization");
const router = Router();

router.get(
  "/profile/:id",
  checkAccessToken,
  checkRole,
  controller.User.userDetailById,
  serialization.userSerialization.userDetail,
  genericResponse.sendResponse
);


module.exports = router;
