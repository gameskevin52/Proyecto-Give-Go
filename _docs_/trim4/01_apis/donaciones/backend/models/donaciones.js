const db = require('../config/db');

const Donaciones = {

    getAll: (callback) => {
        const sql = `
            SELECT *
            FROM Donaciones
        `;
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = `
            SELECT *
            FROM Donaciones
            WHERE id_Donaciones = ?
        `;
        db.query(sql, [id], callback);
    },

    create: (data, callback) => {
        const sql = `
            INSERT INTO Donaciones (
                categoria_donaciones,
                tipo_donaciones,
                fecha_donacion,
                id_Organizaciones,
                id_Usuarios
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                data.categoria_donaciones,
                data.tipo_donaciones,
                data.fecha_donacion,
                data.id_Organizaciones,
                data.id_Usuarios
            ],
            callback
        );
    },

    update: (id, data, callback) => {
        const sql = `
            UPDATE Donaciones
            SET categoria_donaciones = ?,
                tipo_donaciones = ?,
                fecha_donacion = ?,
                id_Organizaciones = ?,
                id_Usuarios = ?
            WHERE id_Donaciones = ?
        `;

        db.query(
            sql,
            [
                data.categoria_donaciones,
                data.tipo_donaciones,
                data.fecha_donacion,
                data.id_Organizaciones,
                data.id_Usuarios,
                id
            ],
            callback
        );
    },

    delete: (id, callback) => {
        const sql = `
            DELETE FROM Donaciones
            WHERE id_Donaciones = ?
        `;

        db.query(sql, [id], callback);
    }

};

module.exports = Donaciones;