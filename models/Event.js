const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId() }, // MongoDBUUID
  name: { type: String, required: true },
  descripcion: { type: String, required: true },
  start_date: { type: Date, required:true },
  end_date: { type: Date, required:true },
  genres: { type: Array, required: true },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;