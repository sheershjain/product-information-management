const { commonErrorHandler } = require("../helper/error-handler.helper");
const  mapperService  = require("../services/mapper.service");


const main = async (req, res, next) => {
  try {
    const data = await mapperService.main();
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};
module.exports={main}