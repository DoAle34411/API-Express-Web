const mongoose = require('mongoose');
const { Schema } = mongoose;

const rentSchema = new Schema({
  rent_id: { type: String, default: () => new mongoose.Types.ObjectId() },
  user_id: { type: String, required: true, ref: 'User' },
  start_date: { type: Date, default: Date.now },
  max_end_date: { type: Date, default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
  return_date: { type: Date, default: null },
  late: { type: Boolean, default: false }
}, { timestamps: true });

const Rent = mongoose.model('Rent', rentSchema);
module.exports = Rent;