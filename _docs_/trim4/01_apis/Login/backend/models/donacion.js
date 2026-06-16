const db = require("../config/config");
const Donacion = {}; 

const publicFields = `
  id_Donaciones AS id,
  categoria_donaciones AS category,
  tipo_donaciones AS donation_type,
  fecha_donacion AS donation_date,
  id_Organizaciones AS organization_id,
  id_Usuarios AS user_id
`;

Donacion.findAll = (result) => {
  const sql = `
    SELECT ${publicFields}
    FROM Donaciones
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
    FROM Donaciones
    WHERE id_Donaciones = ?
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
    DELETE FROM Donaciones
    WHERE id_Donaciones = ?
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
    INSERT INTO Donaciones(
      categoria_donaciones,
      tipo_donaciones,
      fecha_donacion,
      id_Organizaciones,
      id_Usuarios
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sqlDonacion,
    [
      donation.category,
      donation.donation_type,
      new Date(),
      donation.organization_id,
      donation.user_id
    ],
    (err, res) => {
      if (err) {
        console.log("Error al crear donación:", err);
        return result(err, null);
      }

      const donationId = res.insertId;

      if (donation.donation_type === "Monetario") {
        const sqlMonetary = `
          INSERT INTO Monetarios(
            id_Donaciones,
            tipo_metodo,
            num_cuenta,
            valor_total
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
      }

      else if (donation.donation_type === "Objeto") {
        const sqlObject = `
          INSERT INTO Objetos(
            id_Donaciones,
            categoria_objeto,
            descripcion_de_evento,
            cantidad_total
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
      }

      else {
        return result(
          { message: "Tipo de donación inválido" },
          null
        );
      }
    }
  );
};

module.exports = Donacion;