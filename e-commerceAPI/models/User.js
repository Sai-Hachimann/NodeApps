const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A user must have a name'],
    minlength: 3,
    maxlength: 45,
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    defaul: 'user',
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
