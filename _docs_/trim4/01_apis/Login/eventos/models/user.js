const db = require("../config/config");
const bcrypt = require("bcryptjs");

const User = {};

const publicFields = `
  id_usuario AS id,
  roles AS role,
  nombre1_usuario AS first_name,
  nombre2_usuario AS second_name,
  apellido1_usuario AS first_lastname,
  apellido2_usuario AS second_lastname,
  telefono_usuario AS phone,
  correo_usuario AS email
`;

const privateFields = `
  ${publicFields},
  password_usuario AS password
`;

User.findAll = (result) => {
  const sql = `SELECT ${publicFields} FROM Usuarios`;

  db.query(sql, (err, users) => {
    if (err) {
      console.log("Error al listar usuarios: ", err);
      return result(err, null);
    }

    return result(null, users);
  });
};

User.findById = (id, result) => {
  const sql = `SELECT ${publicFields} FROM Usuarios WHERE id_usuario = ?`;

  db.query(sql, [id], (err, users) => {
    if (err) {
      console.log("Error al consultar usuario: ", err);
      return result(err, null);
    }

    return result(null, users[0]);
  });
};

User.findByEmail = (email, result) => {
  const sql = `SELECT ${privateFields} FROM Usuarios WHERE correo_usuario = ?`;

  db.query(sql, [email], (err, users) => {
    if (err) {
      console.log("Error al consultar usuario: ", err);
      return result(err, null);
    }

    return result(null, users[0]);
  });
};

User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 10);
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
    ) VALUES (?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      user.role,
      user.first_name,
      user.second_name || null,
      user.first_lastname,
      user.second_lastname || null,
      user.phone,
      user.email,
      hash,
    ],
    (err, res) => {
      if (err) {
        console.log("Error al crear usuario: ", err);
        return result(err, null);
      }

      return result(null, {
        id: res.insertId,
        role: user.role,
        first_name: user.first_name,
        second_name: user.second_name || null,
        first_lastname: user.first_lastname,
        second_lastname: user.second_lastname || null,
        phone: user.phone,
        email: user.email,
      });
    }
  );
};

User.update = async (user, result) => {
  const fields = [];
  const values = [];

  if (user.role) {
    fields.push("roles = ?");
    values.push(user.role);
  }
  if (user.first_name) {
    fields.push("nombre1_usuario = ?");
    values.push(user.first_name);
  }
  if (user.second_name !== undefined) {
    fields.push("nombre2_usuario = ?");
    values.push(user.second_name || null);
  }
  if (user.first_lastname) {
    fields.push("apellido1_usuario = ?");
    values.push(user.first_lastname);
  }
  if (user.second_lastname !== undefined) {
    fields.push("apellido2_usuario = ?");
    values.push(user.second_lastname || null);
  }
  if (user.phone) {
    fields.push("telefono_usuario = ?");
    values.push(user.phone);
  }
  if (user.email) {
    fields.push("correo_usuario = ?");
    values.push(user.email);
  }
  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);
    fields.push("password_usuario = ?");
    values.push(hash);
  }

  if (fields.length === 0) {
    return result(null, { id: user.id, message: "No hay datos para actualizar" });
  }

  const sql = `UPDATE Usuarios SET ${fields.join(", ")} WHERE id_usuario = ?`;
  values.push(user.id);

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log("Error al actualizar usuario: ", err);
      return result(err, null);
    }

    return result(null, { id: user.id, affectedRows: res.affectedRows });
  });
};

User.delete = (id, result) => {
  const sql = "DELETE FROM Usuarios WHERE id_usuario = ?";

  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log("Error al eliminar usuario: ", err);
      return result(err, null);
    }

    return result(null, res);
  });
};

module.exports = User;
