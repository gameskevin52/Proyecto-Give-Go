const Event = require('../models/event');

// crear eventos nuevos
exports.createEvent = async (req, res) => {
    try {

        const { titulo, fecha, descripcion } = req.body;

        const evento = await Event.create({
            titulo,
            fecha,
            descripcion
        });

        res.status(201).json(evento);

    } catch (error) {

        res.status(500).json({
            error: 'Error al crear evento'
        });

    }
};

// Lista de eventos 
exports.getEvents = async (req, res) => {

    try {

        const eventos = await Event.findAll();

        res.status(200).json(eventos);

    } catch (error) {

        res.status(500).json({
            error: 'Error al listar eventos'
        });

    }

};

// evento x id 
exports.getEventById = async (req, res) => {

    try {

        const evento = await Event.findByPk(req.params.id);

        if (!evento) {
            return res.status(404).json({
                error: 'Evento no encontrado'
            });
        }

        res.status(200).json(evento);

    } catch (error) {

        res.status(500).json({
            error: 'Error al obtener evento'
        });

    }

};

// Actualizar evento
exports.updateEvent = async (req, res) => {

    try {

        const evento = await Event.findByPk(req.params.id);

        if (!evento) {
            return res.status(404).json({
                error: 'Evento no encontrado'
            });
        }

        const { titulo, fecha, descripcion } = req.body;

        await evento.update({
            titulo,
            fecha,
            descripcion
        });

        res.status(200).json(evento);

    } catch (error) {

        res.status(500).json({
            error: 'Error al actualizar evento'
        });

    }

};

// Eliminar evento
exports.deleteEvent = async (req, res) => {

    try {

        const evento = await Event.findByPk(req.params.id);

        if (!evento) {
            return res.status(404).json({
                error: 'Evento no encontrado'
            });
        }

        await evento.destroy();

        res.status(200).json({
            mensaje: 'Evento eliminado correctamente'
        });

    } catch (error) {

        res.status(500).json({
            error: 'Error al eliminar evento'
        });

    }

};