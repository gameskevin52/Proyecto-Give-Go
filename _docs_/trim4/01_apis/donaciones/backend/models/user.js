// ====================================================
// MODELO: USER
// ====================================================

// Importa la configuración de la base de datos
const db = require('../config/config');

// Librería para encriptar contraseñas
const bcrypt = require('bcryptjs');

// Objeto del modelo User
const User = {};

// ====================================================
// LISTAR TODOS LOS USUARIOS
// ====================================================
User.findAll = (result) => {

    // Consulta SQL para obtener todos los usuarios
    const sql = `
        SELECT
            id_usuario AS id,
            correo_usuario AS email,
            nombre1_usuario AS name,
            apellido1_usuario AS lastname,
            telefono_usuario AS phone,
            roles AS role
        FROM Usuarios
    `;

    // Ejecuta la consulta
    db.query(sql, (err, users) => {

        // Validación de error
        if (err) {
            console.log('Error al listar usuarios: ', err);
            result(err, null);

        } else {

            // Usuarios encontrados
            console.log('Usuarios encontrados: ', users.length);
            result(null, users);
        }
    });
};

// ====================================================
// BUSCAR USUARIO POR ID
// ====================================================
User.findById = (id, result) => {

    // Consulta SQL
    const sql = `
        SELECT
            id_usuario AS id,
            correo_usuario AS email,
            nombre1_usuario AS name,
            apellido1_usuario AS lastname,
            telefono_usuario AS phone,
            roles AS role,
            password_usuario AS password
        FROM Usuarios
        WHERE id_usuario = ?
    `;

    // Ejecuta la consulta
    db.query(sql, [id], (err, user) => {

        // Validación de error
        if (err) {

            console.log('Error al consultar: ', err);
            result(err, null);

        } else {

            // Usuario encontrado
            console.log('Usuario consultado: ', user[0]);
            result(null, user[0]);
        }
    });
};

// ====================================================
// BUSCAR USUARIO POR EMAIL
// ====================================================
User.findByEmail = (email, result) => {

    // Consulta SQL
    const sql = `
        SELECT
            id_usuario AS id,
            correo_usuario AS email,
            nombre1_usuario AS name,
            apellido1_usuario AS lastname,
            telefono_usuario AS phone,
            roles AS role,
            password_usuario AS password
        FROM Usuarios
        WHERE correo_usuario = ?
    `;

    // Ejecuta la consulta
    db.query(sql, [email], (err, user) => {

        // Validación de error
        if (err) {

            console.log('Error al consultar: ', err);
            result(err, null);

        } else {

            // Usuario encontrado
            console.log('Usuario consultado: ', user[0]);
            result(null, user[0]);
        }
    });
};

// ====================================================
// CREAR USUARIO
// ====================================================
User.create = async (user, result) => {

    // Encripta la contraseña antes de guardarla
    const hash = await bcrypt.hash(user.password, 10);

    // Roles válidos del sistema
    const validRoles = [
        'Admin',
        'Voluntario',
        'Beneficiario'
    ];

    // Asigna un rol válido o el rol por defecto
    const role = validRoles.includes(user.role)
        ? user.role
        : 'Beneficiario';

    // Consulta SQL
    const sql = `
        INSERT INTO Usuarios(
            roles,
            nombre1_usuario,
            nombre2_usuario,
            apellido1_usuario,
            apellido2_usuario,
            telefono_usuario,
            correo_usuario,
            password_usuario
        )
        VALUES (?,?,?,?,?,?,?,?)
    `;

    // Ejecuta la consulta
    db.query(
        sql,
        [
            role,
            user.name,
            user.second_name || null,
            user.lastname,
            user.second_lastname || null,
            user.phone,
            user.email,
            hash
        ],
        (err, res) => {

            // Validación de error
            if (err) {

                console.log('Error al crear usuario: ', err);
                result(err, null);

            } else {

                // Objeto del usuario creado
                const newUser = {
                    id: res.insertId,
                    email: user.email,
                    name: user.name,
                    lastname: user.lastname,
                    phone: user.phone,
                    role: role
                };

                console.log('Usuario creado: ', newUser);
                result(null, newUser);
            }
        }
    );
};

// ====================================================
// ACTUALIZAR USUARIO
// ====================================================
User.update = async (user, result) => {

    // Arrays para construir la consulta dinámicamente
    let fields = [];
    let values = [];

    // Actualizar contraseña
    if (user.password) {

        const hash = await bcrypt.hash(user.password, 10);

        fields.push("password_usuario = ?");
        values.push(hash);
    }

    // Actualizar correo
    if (user.email) {
        fields.push("correo_usuario = ?");
        values.push(user.email);
    }

    // Actualizar primer nombre
    if (user.name) {
        fields.push("nombre1_usuario = ?");
        values.push(user.name);
    }

    // Actualizar segundo nombre
    if (user.second_name) {
        fields.push("nombre2_usuario = ?");
        values.push(user.second_name);
    }

    // Actualizar primer apellido
    if (user.lastname) {
        fields.push("apellido1_usuario = ?");
        values.push(user.lastname);
    }

    // Actualizar segundo apellido
    if (user.second_lastname) {
        fields.push("apellido2_usuario = ?");
        values.push(user.second_lastname);
    }

    // Actualizar teléfono
    if (user.phone) {
        fields.push("telefono_usuario = ?");
        values.push(user.phone);
    }

    // Actualizar rol
    if (user.role) {
        fields.push("roles = ?");
        values.push(user.role);
    }

    // Consulta SQL dinámica
    const sql = `
        UPDATE Usuarios
        SET ${fields.join(", ")}
        WHERE id_usuario = ?
    `;

    // Agrega el ID al final
    values.push(user.id);

    // Ejecuta la consulta
    db.query(sql, values, (err, res) => {

        // Validación de error
        if (err) {

            console.log('Error al actualizar usuario: ', err);
            result(err, null);

        } else {

            console.log('Usuario actualizado: ', user.id);
            result(null, user);
        }
    });
};

// ====================================================
// ELIMINAR USUARIO
// ====================================================
User.delete = (id, result) => {

    // Consulta SQL
    const sql = `
        DELETE FROM Usuarios
        WHERE id_usuario = ?
    `;

    // Ejecuta la consulta
    db.query(sql, [id], (err, res) => {

        // Validación de error
        if (err) {

            console.log('Error al eliminar usuario: ', err);
            result(err, null);

        } else {

            console.log('Usuario eliminado con id: ', id);
            result(null, res);
        }
    });
};

// ====================================================
// EXPORTAR MODELO
// ====================================================
module.exports = User;