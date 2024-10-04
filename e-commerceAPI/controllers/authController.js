const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomErr = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    throw new CustomErr.BadRequestError('Email already inuse');
  }
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? 'admin' : 'user';
  const user = await User.create({
    name: name,
    email: email,
    password: password,
    role: role,
  });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, tokenUser: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomErr.BadRequestError('Please provide valid credentials');
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomErr.UnauthenticatedError('Invalid credentials');
  }
  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    throw new CustomErr.UnauthenticatedError('Invalid credentials');
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, tokenUser: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const logout = async (req, res) => {
  res.cookie('token', 'user logged out', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'User Logged out' });
};

module.exports = {
  register,
  login,
  logout,
};
