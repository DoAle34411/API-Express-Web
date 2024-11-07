const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId() }, // MongoDBUUID
  name: { type: String, required: true },
  editorial: { type: String, required: true },
  edition: { type: String, required: true },
  status: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  pages: { type: Number, required: true },
  amountAvailable: { type: Number, required: true },
  amountTotal: { type: Number, required: true },
  amountRented: { type: Number, default: 0 },
  synopsis: { type: String }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;