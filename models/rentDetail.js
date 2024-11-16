const mongoose = require('mongoose');
const { Schema } = mongoose;

const rentDetailSchema = new Schema({
  Id_rent: { type: String, required: true, ref: 'Rent' },
  Id_Book: { type: String, required: true, ref: 'Book' },
  Amount_rented: { type: Number, required: true }
}, { timestamps: true });

const RentDetail = mongoose.model('RentDetail', rentDetailSchema);
module.exports = RentDetail;