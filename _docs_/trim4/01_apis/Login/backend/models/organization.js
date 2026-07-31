const db = require("../config/config");
const bcrypt = require("bcryptjs");

const Organization = {};

const publicFields = `
  id_organizacion AS id,
  nombre AS name,
  direccion AS address,
  telefono AS phone,
  correo AS email,
  descripcion AS description
`;

const privateFields = `
  ${publicFields},
  password AS password
`;

Organization.findAll = (result) => {
  const sql = `SELECT ${publicFields} FROM organizaciones`;

  db.query(sql, (err, organizations) => {
    if (err) {
      console.log("Error al listar organizaciones: ", err);
      return result(err, null);
    }

    return result(null, organizations);
  });
};

Organization.findById = (id, result) => {
  const sql = `SELECT ${publicFields} FROM organizaciones WHERE id_organizacion = ?`;

  db.query(sql, [id], (err, organizations) => {
    if (err) {
      console.log("Error al consultar organizacion: ", err);
      return result(err, null);
    }

    return result(null, organizations[0]);
  });
};

Organization.findByEmail = (email, result) => {
  const sql = `SELECT ${privateFields} FROM organizaciones WHERE correo = ?`;

  db.query(sql, [email], (err, organizations) => {
    if (err) {
      console.log("Error al consultar organizacion: ", err);
      return result(err, null);
    }

    return result(null, organizations[0]);
  });
};

Organization.create = async (organization, result) => {
  const hash = await bcrypt.hash(organization.password, 10);
  const sql = `
    INSERT INTO organizaciones(
      nombre,
      direccion,
      telefono,
      correo,
      password,
      descripcion
    ) VALUES (?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      organization.name,
      organization.address,
      organization.phone || null,
      organization.email,
      hash,
      organization.description || null,
    ],
    (err, res) => {
      if (err) {
        console.log("Error al crear organizacion: ", err);
        return result(err, null);
      }

      return result(null, {
        id: res.insertId,
        name: organization.name,
        address: organization.address,
        phone: organization.phone || null,
        email: organization.email,
        description: organization.description || null,
      });
    }
  );
};

Organization.update = async (organization, result) => {
  const fields = [];
  const values = [];

  if (organization.name) {
    fields.push("nombre = ?");
    values.push(organization.name);
  }
  if (organization.address) {
    fields.push("direccion = ?");
    values.push(organization.address);
  }
  if (organization.email) {
    fields.push("correo = ?");
    values.push(organization.email);
  }
  if (organization.phone) {
    fields.push("telefono = ?");
    values.push(organization.phone);
  }
  if (organization.description !== undefined) {
    fields.push("descripcion = ?");
    values.push(organization.description || null);
  }
  if (organization.password) {
    const hash = await bcrypt.hash(organization.password, 10);
    fields.push("password = ?");
    values.push(hash);
  }

  if (fields.length === 0) {
    return result(null, { id: organization.id, message: "No hay datos para actualizar" });
  }

  const sql = `UPDATE organizaciones SET ${fields.join(", ")} WHERE id_organizacion = ?`;
  values.push(organization.id);

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log("Error al actualizar organizacion: ", err);
      return result(err, null);
    }

    return result(null, { id: organization.id, affectedRows: res.affectedRows });
  });
};

Organization.delete = (id, result) => {
  const sql = "DELETE FROM organizaciones WHERE id_organizacion = ?";

  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log("Error al eliminar organizacion: ", err);
      return result(err, null);
    }

    return result(null, res);
  });
};

module.exports = Organization;
