const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must provide a valid name'],
    minlength: 3,
    maxlength: 40,
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid E-mail',
    },
  },
  password: {
    type: String,
    required: [true, 'Please enter a valid password'],
    minlength: 5,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
