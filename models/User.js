const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userId: String,
  encryptedPrivateKey: String,
  publicKey: String,
  viewKey: String,
  language: String,
  notificationsEnabled: Boolean,
});

userSchema.methods.encryptPrivateKey = function (privateKey) {
  const salt = bcrypt.genSaltSync(10);
  this.encryptedPrivateKey = bcrypt.hashSync(privateKey, salt);
};

userSchema.methods.validatePrivateKey = function (privateKey) {
  return bcrypt.compareSync(privateKey, this.encryptedPrivateKey);
};

module.exports = mongoose.model('User', userSchema);