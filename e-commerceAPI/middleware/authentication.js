const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication is invalid');
  }

  try {
    const { name, userId, role } = isTokenValid({ token: token });
    req.user = { name, userId, role };
  } catch (error) {
    console.log(error);
  }
  next();
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError('Only admin can view this route');
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
