const models = require("../models");
async function checkRole(req, res, next) {
  const id =  req.body.adminId || req.user.id;
  if (id) {
    const user = await models.User.findOne({ where: { id: id } });
    if (user.dataValues.role == "SADM" || user.dataValues.role == "ADM") {
      next();
    } else {
      return res.status(403).json({
        message:
          "You do not have sufficient permissions to perform this action.",
      });
    }
  } else {
    return res.status(400).json({ message: "Invalid Request Parameter" });
  }
}

module.exports = {
  checkRole
};
