const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, tokenUser }) => {
  const token = createJWT({ payload: tokenUser });
  const date = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    signed: true,
    httpOnly: true,
    expires: new Date(Date.now() + date),
    secure: process.env.NODE_ENV === 'production',
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
