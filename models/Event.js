const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  descripcion: String,
  start_date: Date,
  end_date: Date,
  genres: [String],
});

// Prototype Pattern: Clone method
eventSchema.methods.clone = function () {
  return new this.constructor({
    name: this.name,
    descripcion: this.descripcion,
    start_date: this.start_date,
    end_date: this.end_date,
    genres: [...this.genres], // Ensure a deep copy of the array
  });
};

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
