const jwt = require("jsonwebtoken");
const models = require("../models");
const checkAccessToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header ? header.split(" ")[1] : null;
    if (!token) {
      throw new Error("Access denied");
    }

    let decoded_jwt = jwt.verify(token, process.env.SECRET_KEY_ACCESS);
    const user = await models.User.findOne({
      where: {
        id: decoded_jwt.userId,
      },
    });
    if (!user) {
      throw new Error("User Not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const checkRefreshToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const refreshToken = header ? header.split(" ")[1] : null;
    if (!refreshToken) {
      throw new Error("Access denied");
    }
    const decoded_jwt = jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH
    );
    req.body.userId = decoded_jwt.id;
    req.body.token = refreshToken;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkAccessToken,
  checkRefreshToken,
};
