const db = require("../config/config");
const bcrypt = require("bcryptjs");

const Organization = {};

const publicFields = `
  organizacion_id AS id,
  organizacion_nombre AS name,
  organizacion_direccion AS address,
  organizacion_correo AS email
`;

const privateFields = `
  ${publicFields},
  organizacion_contraseña AS password
`;

Organization.findAll = (result) => {
  const sql = `SELECT ${publicFields} FROM Organizaciones`;

  db.query(sql, (err, organizations) => {
    if (err) {
      console.log("Error al listar organizaciones: ", err);
      return result(err, null);
    }

    console.log("Organizaciones encontradas: ", organizations.length);
    return result(null, organizations);
  });
};

Organization.findById = (id, result) => {
  const sql = `SELECT ${privateFields} FROM Organizaciones WHERE organizacion_id = ?`;

  db.query(sql, [id], (err, organizations) => {
    if (err) {
      console.log("Error al consultar organizacion: ", err);
      return result(err, null);
    }

    console.log("Organizacion consultada: ", organizations[0]);
    return result(null, organizations[0]);
  });
};

Organization.findByEmail = (email, result) => {
  const sql = `SELECT ${privateFields} FROM Organizaciones WHERE organizacion_correo = ?`;

  db.query(sql, [email], (err, organizations) => {
    if (err) {
      console.log("Error al consultar organizacion: ", err);
      return result(err, null);
    }

    console.log("Organizacion consultada: ", organizations[0]);
    return result(null, organizations[0]);
  });
};

Organization.create = async (organization, result) => {
  const hash = await bcrypt.hash(organization.password, 10);
  const sql = `
    INSERT INTO Organizaciones(
      organizacion_nombre,
      organizacion_direccion,
      organizacion_correo,
      organizacion_contraseña
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

      const createdOrganization = {
        id: res.insertId,
        name: organization.name,
        address: organization.address,
        email: organization.email,
      };

      console.log("Organizacion creada: ", createdOrganization);
      return result(null, createdOrganization);
    }
  );
};

Organization.update = async (organization, result) => {
  const fields = [];
  const values = [];

  if (organization.name) {
    fields.push("organizacion_nombre = ?");
    values.push(organization.name);
  }
  if (organization.address) {
    fields.push("organizacion_direccion = ?");
    values.push(organization.address);
  }
  if (organization.email) {
    fields.push("organizacion_correo = ?");
    values.push(organization.email);
  }
  if (organization.password) {
    const hash = await bcrypt.hash(organization.password, 10);
    fields.push("organizacion_contraseña = ?");
    values.push(hash);
  }

  if (fields.length === 0) {
    return result(null, { id: organization.id, message: "No hay datos para actualizar" });
  }

  const sql = `UPDATE Organizaciones SET ${fields.join(", ")} WHERE organizacion_id = ?`;
  values.push(organization.id);

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log("Error al actualizar organizacion: ", err);
      return result(err, null);
    }

    console.log("Organizacion actualizada: ", { id: organization.id, ...organization });
    return result(null, { id: organization.id, affectedRows: res.affectedRows });
  });
};

Organization.delete = (id, result) => {
  const sql = "DELETE FROM Organizaciones WHERE organizacion_id = ?";

  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log("Error al eliminar organizacion: ", err);
      return result(err, null);
    }

    console.log("Organizacion eliminada con id: ", id);
    return result(null, res);
  });
};

module.exports = Organization;
