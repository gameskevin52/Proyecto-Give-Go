const db = require("../config/config");
const bcrypt = require("bcryptjs");

const Organization = {};

const publicFields = `
  id_Organizaciones AS id,
  nombre_organizaciones AS name,
  direccion_organizaciones AS address,
  correo_organizaciones AS email
`;

const privateFields = `
  ${publicFields},
  password_organizaciones AS password
`;

Organization.findAll = (result) => {
  const sql = `SELECT ${publicFields} FROM Organizaciones`;

  db.query(sql, (err, organizations) => {
    if (err) {
      console.log("Error al listar organizaciones: ", err);
      return result(err, null);
    }

    return result(null, organizations);
  });
};

Organization.findById = (id, result) => {
  const sql = `SELECT ${publicFields} FROM Organizaciones WHERE id_Organizaciones = ?`;

  db.query(sql, [id], (err, organizations) => {
    if (err) {
      console.log("Error al consultar organizacion: ", err);
      return result(err, null);
    }

    return result(null, organizations[0]);
  });
};

Organization.findByEmail = (email, result) => {
  const sql = `SELECT ${privateFields} FROM Organizaciones WHERE correo_organizaciones = ?`;

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
    INSERT INTO Organizaciones(
      nombre_organizaciones,
      direccion_organizaciones,
      correo_organizaciones,
      password_organizaciones
    ) VALUES (?,?,?,?)
  `;

  db.query(
    sql,
    [organization.name, organization.address, organization.email, hash],
    (err, res) => {
      if (err) {
        console.log("Error al crear organizacion: ", err);
        return result(err, null);
      }

      return result(null, {
        id: res.insertId,
        name: organization.name,
        address: organization.address,
        email: organization.email,
      });
    }
  );
};

Organization.update = async (organization, result) => {
  const fields = [];
  const values = [];

  if (organization.name) {
    fields.push("nombre_organizaciones = ?");
    values.push(organization.name);
  }
  if (organization.address) {
    fields.push("direccion_organizaciones = ?");
    values.push(organization.address);
  }
  if (organization.email) {
    fields.push("correo_organizaciones = ?");
    values.push(organization.email);
  }
  if (organization.password) {
    const hash = await bcrypt.hash(organization.password, 10);
    fields.push("password_organizaciones = ?");
    values.push(hash);
  }

  if (fields.length === 0) {
    return result(null, { id: organization.id, message: "No hay datos para actualizar" });
  }

  const sql = `UPDATE Organizaciones SET ${fields.join(", ")} WHERE id_Organizaciones = ?`;
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
  const sql = "DELETE FROM Organizaciones WHERE id_Organizaciones = ?";

  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log("Error al eliminar organizacion: ", err);
      return result(err, null);
    }

    return result(null, res);
  });
};

module.exports = Organization;
