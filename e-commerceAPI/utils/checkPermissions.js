const CustomErr = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomErr.UnauthorizedError('only admin access for this route');
};

module.exports = {
  checkPermissions,
};
