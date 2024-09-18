const User = require('../models/Users');
const { StatusCodes } = require('http-status-codes');
const {
  NotFoundError,
  UnauthenticatedError,
  BadRequestError,
} = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

module.exports.getAllUsers = async (req, res, next) => {
  console.log(req.user);

  const users = await User.find({ role: 'user' }).select('-password');

  res.status(StatusCodes.OK).json({ users });
};

module.exports.getSingleUser = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    throw new NotFoundError('Not found');
  }

  const user = await User.findOne({ _id: id }).select('-password');
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
  /*
  const user = await user.findOne({_id:req.params.id}).select('-password');
  if(!user){
    throw new NotFoundError('user not found');
  }
  res.status(StatusCodes.OK).json({ user });
  */
};

module.exports.showCurrentUser = async (req, res, next) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

//update user with user.save()
module.exports.updateUser = async (req, res, next) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequestError('Please provide valid name and email');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser({ user });
  attachCookiesToResponse({ res, tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports.updateUserPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Passwords do not match');
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Passwords do not match');
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Password updated successfully!!' });
};

//UPDATE USER USING FINDONEANDUPDATE
// module.exports.updateUser = async (req, res, next) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new BadRequestError('Please provide valid name and email');
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { name, email },
//     { new: true, runValidators: true }
//   );

//   const tokenUser = createTokenUser({ user });
//   attachCookiesToResponse({ res, tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
