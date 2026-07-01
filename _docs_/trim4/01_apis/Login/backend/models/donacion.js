const db = require("../config/config");
const Donacion = {};

const publicFields = `
  id_donacion AS id,
  categoria,
  tipo AS donation_type,
  fecha,
  usuario_id AS user_id,
  organizacion_id AS organization_id,
  estado,
  observaciones
`;

Donacion.findAll = (result) => {
  const sql = `
    SELECT ${publicFields}
    FROM donaciones
  `;

  db.query(sql, (err, donations) => {
    if (err) {
      console.log("Error al listar donaciones:", err);
      return result(err, null);
    }

    return result(null, donations);
  });
};

Donacion.findById = (id, result) => {
  const sql = `
    SELECT ${publicFields}
    FROM donaciones
    WHERE id_donacion = ?
  `;

  db.query(sql, [id], (err, donations) => {
    if (err) {
      console.log("Error al consultar donación:", err);
      return result(err, null);
    }

    return result(null, donations[0]);
  });
};

Donacion.delete = (id, result) => {
  const sql = `
    DELETE FROM donaciones
    WHERE id_donacion = ?
  `;

  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log("Error al eliminar donación:", err);
      return result(err, null);
    }

    return result(null, res);
  });
};

Donacion.create = (donation, result) => {
  const sqlDonacion = `
    INSERT INTO donaciones(
      categoria,
      tipo,
      fecha,
      usuario_id,
      organizacion_id,
      estado,
      observaciones
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const state = donation.estado !== undefined ? donation.estado : 1;
  const observations = donation.observations || donation.observaciones || null;

  db.query(
    sqlDonacion,
    [
      donation.category,
      donation.donation_type,
      new Date(),
      donation.user_id,
      donation.organization_id,
      state,
      observations
    ],
    (err, res) => {
      if (err) {
        console.log("Error al crear donación:", err);
        return result(err, null);
      }

      const donationId = res.insertId;

      if (donation.donation_type === "Monetaria") {
        const sqlMonetary = `
          INSERT INTO donaciones_monetarias(
            donacion_id,
            metodo,
            cuenta,
            valor
          )
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          sqlMonetary,
          [
            donationId,
            donation.payment_method,
            donation.account_number,
            donation.total_value
          ],
          (err) => {
            if (err) {
              console.log("Error al crear donación monetaria:", err);
              return result(err, null);
            }

            return result(null, {
              id: donationId,
              category: donation.category,
              donation_type: donation.donation_type,
              organization_id: donation.organization_id,
              user_id: donation.user_id
            });
          }
        );
      } else if (donation.donation_type === "Objeto") {
        const sqlObject = `
          INSERT INTO donaciones_objetos(
            donacion_id,
            categoria,
            descripcion,
            cantidad
          )
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          sqlObject,
          [
            donationId,
            donation.object_category,
            donation.description,
            donation.quantity
          ],
          (err) => {
            if (err) {
              console.log("Error al crear donación de objetos:", err);
              return result(err, null);
            }

            return result(null, {
              id: donationId,
              category: donation.category,
              donation_type: donation.donation_type,
              organization_id: donation.organization_id,
              user_id: donation.user_id
            });
          }
        );
      } else {
        return result(
          { message: "Tipo de donación inválido" },
          null
        );
      }
    }
  );
};

Donacion.update = (id, donation, result) => {
  const sql = `
    UPDATE donaciones
    SET
      categoria = ?,
      tipo = ?,
      usuario_id = ?,
      organizacion_id = ?,
      estado = ?,
      observaciones = ?
    WHERE id_donacion = ?
  `;

  db.query(
    sql,
    [
      donation.category,
      donation.donation_type,
      donation.user_id,
      donation.organization_id,
      donation.estado,
      donation.observations || donation.observaciones || null,
      id
    ],
    (err, res) => {
      if (err) {
        console.log("Error al actualizar donación:", err);
        return result(err, null);
      }

      return result(null, res);
    }
  );
};

module.exports = Donacion;