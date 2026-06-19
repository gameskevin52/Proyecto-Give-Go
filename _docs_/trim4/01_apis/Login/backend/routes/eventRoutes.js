const express = require('express');
const router = express.Router();

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

router.post('/fundaciones/eventos', createEvent);

router.get('/fundaciones/eventos', getEvents);

router.get('/fundaciones/eventos/:id', getEventById);

router.put('/fundaciones/eventos/:id', updateEvent);

router.delete('/fundaciones/eventos/:id', deleteEvent);

module.exports = router;