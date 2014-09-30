// Controls user creation
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  pass: String,
  email: String,
  fname: String,
  avatar: String
});

module.exports = mongoose.model('User', UserSchema);
