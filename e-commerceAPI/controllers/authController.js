const { StatusCodes } = require('http-status-codes');
const User = require('../models/Users');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

module.exports.register = async (req, res, next) => {
  const { email, password, name } = req.body;
  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  //alternative way to setUp admin role
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ email, password, name, role });
  const tokenUser = createTokenUser({ user });
  attachCookiesToResponse({ res, tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide valid credentials');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const tokenUser = createTokenUser({ user });
  attachCookiesToResponse({ res, tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports.logout = async (req, res, next) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
};
