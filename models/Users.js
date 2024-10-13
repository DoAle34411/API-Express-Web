const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId() }, // MongoDBUUID
  cedula: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;