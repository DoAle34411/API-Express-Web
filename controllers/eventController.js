const Event = require('../models/Event');

// Middleware for Authorization
const checkAuthorization = (req, res, next) => {
  const authorization = req.headers['authorization'];

  if (authorization !== 'HeSaidSheSaidBu11$!t') {
    return res.status(403).json({ message: 'Forbidden: Invalid authorization header' });
  }

  next();
};

// Create Event
exports.createEvent = [checkAuthorization, async (req, res) => {
  const { name, descripcion, start_date, end_date, genres } = req.body;

  try {
    const newEvent = new Event({
      name,
      descripcion,
      start_date,
      end_date,
      genres: Array.isArray(genres) ? genres : [genres]
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}];

// Get Event by ID
exports.findEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update Event
exports.updateEvent = [checkAuthorization, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}];

// Delete Event
exports.deleteEvent = [checkAuthorization, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}];

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get Current Events
exports.getCurrentEvents = async (req, res) => {
    const now = new Date();
  
    try {
      const events = await Event.find({
        start_date: { $lte: now },
        end_date: { $gte: now }
      });
  
      if (events.length === 0) {
        return res.status(404).json({ message: 'No current events found' });
      }
  
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  