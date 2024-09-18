const CustomErr = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomErr.UnauthenticatedError('Invalid Token');
  }

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name: name, userId: userId, role: role };
    next();
  } catch (error) {
    throw new CustomErr.UnauthenticatedError('Invalid Token');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErr.UnauthorizedError('Unauthroized route');
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
