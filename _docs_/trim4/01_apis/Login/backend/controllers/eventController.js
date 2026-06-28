const util = require("util");
const db = require("../config/config");

const query = util.promisify(db.query).bind(db);

const normalizeEvent = (row) => ({
    id: row.id_eventos,
    nombre_eventos: row.nombre_eventos,
    categoria_eventos: row.categoria_eventos,
    descripcion_eventos: row.descripcion_eventos,
    fecha_evento: row.fecha_evento,
    estado_evento: row.estado_evento,
    id_Organizaciones: row.id_Organizaciones
});

// ======================
// Crear Evento
// ======================
exports.createEvent = async (req, res) => {
    try {

        const {
            nombre_eventos,
            categoria_eventos,
            descripcion_eventos,
            fecha_evento,
            estado_evento,
            id_Organizaciones
        } = req.body;

        // Validar campos obligatorios
        if (
            !nombre_eventos ||
            !categoria_eventos ||
            !descripcion_eventos ||
            !fecha_evento ||
            estado_evento === undefined ||
            !id_Organizaciones
        ) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios."
            });
        }

        // Validar estado
        if (![0, 1].includes(Number(estado_evento))) {
            return res.status(400).json({
                success: false,
                message: "El estado del evento debe ser 0 (Inactivo) o 1 (Activo)."
            });
        }

        // Validar fecha
        if (isNaN(new Date(fecha_evento).getTime())) {
            return res.status(400).json({
                success: false,
                message: "La fecha del evento no tiene un formato válido."
            });
        }

        // Validar id de organización
        if (
            !Number.isInteger(Number(id_Organizaciones)) ||
            Number(id_Organizaciones) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "El id de la organización debe ser un número entero positivo."
            });
        }

        // Verificar que exista la organización
        const organizacion = await query(
            "SELECT * FROM Organizaciones WHERE id_Organizaciones = ?",
            [id_Organizaciones]
        );

        if (!organizacion.length) {
            return res.status(404).json({
                success: false,
                message: "La organización indicada no existe."
            });
        }

        const result = await query(
            `INSERT INTO Eventos
            (nombre_eventos, categoria_eventos, descripcion_eventos, fecha_evento, estado_evento, id_Organizaciones)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nombre_eventos,
                categoria_eventos,
                descripcion_eventos,
                fecha_evento,
                estado_evento,
                id_Organizaciones
            ]
        );

        const rows = await query(
            "SELECT * FROM Eventos WHERE id_eventos = ?",
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Evento creado correctamente.",
            data: normalizeEvent(rows[0])
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error al crear el evento.",
            details: error.message
        });
    }
};

// ======================
// Obtener todos los eventos
// ======================
exports.getEvents = async (req, res) => {
    try {

        const rows = await query(
            "SELECT * FROM Eventos ORDER BY id_eventos DESC"
        );

        res.status(200).json({
            success: true,
            data: rows.map(normalizeEvent)
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error al listar los eventos.",
            details: error.message
        });

    }
};

// ======================
// Obtener evento por ID
// ======================
exports.getEventById = async (req, res) => {
    try {

        const rows = await query(
            "SELECT * FROM Eventos WHERE id_eventos = ?",
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Evento no encontrado."
            });
        }

        res.status(200).json({
            success: true,
            data: normalizeEvent(rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error al consultar el evento.",
            details: error.message
        });

    }
};

// ======================
// Actualizar evento
// ======================
exports.updateEvent = async (req, res) => {
    try {

        const rows = await query(
            "SELECT * FROM Eventos WHERE id_eventos = ?",
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Evento no encontrado."
            });
        }

        const {
            nombre_eventos,
            categoria_eventos,
            descripcion_eventos,
            fecha_evento,
            estado_evento
        } = req.body;

        await query(
            `UPDATE Eventos
            SET nombre_eventos = ?,
                categoria_eventos = ?,
                descripcion_eventos = ?,
                fecha_evento = ?,
                estado_evento = ?
            WHERE id_eventos = ?`,
            [
                nombre_eventos,
                categoria_eventos,
                descripcion_eventos,
                fecha_evento,
                estado_evento,
                req.params.id
            ]
        );

        const updatedRows = await query(
            "SELECT * FROM Eventos WHERE id_eventos = ?",
            [req.params.id]
        );

        res.status(200).json({
            success: true,
            message: "Evento actualizado correctamente.",
            data: normalizeEvent(updatedRows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error al actualizar el evento.",
            details: error.message
        });

    }
};

// ======================
// Eliminar evento
// ======================
exports.deleteEvent = async (req, res) => {
    try {

        const rows = await query(
            "SELECT * FROM Eventos WHERE id_eventos = ?",
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Evento no encontrado."
            });
        }

        await query(
            "DELETE FROM Eventos WHERE id_eventos = ?",
            [req.params.id]
        );

        res.status(200).json({
            success: true,
            message: "Evento eliminado correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error al eliminar el evento.",
            details: error.message
        });

    }
};