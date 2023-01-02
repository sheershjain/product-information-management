const createUser = async (req, res, next) => {
  const data = res.data || null;
  const response = {
    id: data.dataValues.id,
    name: data.dataValues.name,
    email: data.dataValues.email,
    role: data.dataValues.role,
  };
  res.data = response;
  next();
};
const userDetail = async (req, res, next) => {
  const data = res.data || null;
  const response = {
    id: data.dataValues.id,
    name: data.dataValues.name,
    email: data.dataValues.email,
    role: data.dataValues.role,
  };
  res.data = response;
  next();
}

module.exports = {
  createUser,
  userDetail
}