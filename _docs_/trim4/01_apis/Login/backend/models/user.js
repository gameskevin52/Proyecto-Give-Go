const db = require("../config/config");
const bcrypt = require("bcryptjs");

const User = {};

const publicFields = `
  usuario_id AS id,
  usuario_nombre AS name,
  usuario_apellido AS lastname,
  usuario_direccion AS address,
  usuario_telefono AS phone,
  usuario_estrato AS stratum,
  usuario_correo AS email,
  organizacion_id AS organization_id
`;

const privateFields = `
  ${publicFields},
  usuario_contraseña AS password
`;

User.findAll = (result) => {
  const sql = `SELECT ${publicFields} FROM Usuarios`;

  db.query(sql, (err, users) => {
    if (err) {
      console.log("Error al listar usuarios: ", err);
      return result(err, null);
    }

    console.log("Usuarios encontrados: ", users.length);
    return result(null, users);
  });
};

User.findById = (id, result) => {
  const sql = `SELECT ${privateFields} FROM Usuarios WHERE usuario_id = ?`;

  db.query(sql, [id], (err, users) => {
    if (err) {
      console.log("Error al consultar usuario: ", err);
      return result(err, null);
    }

    console.log("Usuario consultado: ", users[0]);
    return result(null, users[0]);
  });
};

User.findByEmail = (email, result) => {
  const sql = `SELECT ${privateFields} FROM Usuarios WHERE usuario_correo = ?`;

  db.query(sql, [email], (err, users) => {
    if (err) {
      console.log("Error al consultar usuario: ", err);
      return result(err, null);
    }

    console.log("Usuario consultado: ", users[0]);
    return result(null, users[0]);
  });
};

User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 10);
  const sql = `
    INSERT INTO Usuarios(
      usuario_nombre,
      usuario_apellido,
      usuario_direccion,
      usuario_telefono,
      usuario_estrato,
      usuario_correo,
      usuario_contraseña,
      organizacion_id
    ) VALUES (?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      user.name,
      user.lastname,
      user.address,
      user.phone,
      user.stratum,
      user.email,
      hash,
      user.organization_id,
    ],
    (err, res) => {
      if (err) {
        console.log("Error al crear usuario: ", err);
        return result(err, null);
      }

      const createdUser = {
        id: res.insertId,
        name: user.name,
        lastname: user.lastname,
        address: user.address,
        phone: user.phone,
        stratum: user.stratum,
        email: user.email,
        organization_id: user.organization_id,
      };

      console.log("Usuario creado: ", createdUser);
      return result(null, createdUser);
    }
  );
};

User.update = async (user, result) => {
  const fields = [];
  const values = [];

  if (user.name) {
    fields.push("usuario_nombre = ?");
    values.push(user.name);
  }
  if (user.lastname) {
    fields.push("usuario_apellido = ?");
    values.push(user.lastname);
  }
  if (user.address) {
    fields.push("usuario_direccion = ?");
    values.push(user.address);
  }
  if (user.phone) {
    fields.push("usuario_telefono = ?");
    values.push(user.phone);
  }
  if (user.stratum) {
    fields.push("usuario_estrato = ?");
    values.push(user.stratum);
  }
  if (user.email) {
    fields.push("usuario_correo = ?");
    values.push(user.email);
  }
  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);
    fields.push("usuario_contraseña = ?");
    values.push(hash);
  }
  if (user.organization_id) {
    fields.push("organizacion_id = ?");
    values.push(user.organization_id);
  }

  if (fields.length === 0) {
    return result(null, { id: user.id, message: "No hay datos para actualizar" });
  }

  const sql = `UPDATE Usuarios SET ${fields.join(", ")} WHERE usuario_id = ?`;
  values.push(user.id);

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log("Error al actualizar usuario: ", err);
      return result(err, null);
    }

    console.log("Usuario actualizado: ", { id: user.id, ...user });
    return result(null, { id: user.id, affectedRows: res.affectedRows });
  });
};

User.delete = (id, result) => {
  const sql = "DELETE FROM Usuarios WHERE usuario_id = ?";

  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log("Error al eliminar usuario: ", err);
      return result(err, null);
    }

    console.log("Usuario eliminado con id: ", id);
    return result(null, res);
  });
};

module.exports = User;
