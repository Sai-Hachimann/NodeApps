const jwt = require('jsonwebtoken');

module.exports.createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

module.exports.isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports.attachCookiesToResponse = ({ res, tokenUser }) => {
  const token = this.createJWT({ payload: tokenUser });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};
