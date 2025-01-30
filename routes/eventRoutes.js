const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/createEvent', eventController.createEvent); // X
router.get('/', eventController.getAllEvents); // X
router.get('/:id', eventController.findEventById); // X
router.put('/updateEvent/:id', eventController.updateEvent); // X
router.delete('/deleteEvent/:id', eventController.deleteEvent); // X
router.get('/events/currentEvents', eventController.getCurrentEvents); // Fetch books by genre list X
router.post('/events/duplicate/:id', eventController.duplicateEvent);

module.exports = router;
