const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const { checkPermissions } = require('./checkPermissions');
const { createTokenUser } = require('./createTokenUser');
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
};
