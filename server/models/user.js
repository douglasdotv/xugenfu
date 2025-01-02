const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: String,
  teamId: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.hashedPassword;
    delete returnedObject.isAdmin;
  },
});

module.exports = mongoose.model('User', userSchema);
