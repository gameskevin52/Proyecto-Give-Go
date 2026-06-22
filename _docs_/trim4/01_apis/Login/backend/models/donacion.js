const db = require("../config/config");
const Donacion = {}; 


const publicFields  = ` 
  id_Donaciones AS id,
  categoria_donaciones AS category,
  tipo_donaciones AS donation_type,
  fecha_donacion AS donation_date,
  id_Organizaciones AS organization_id,
  id_Usuarios AS user_id
`; // Campos públicos de la tabla Donaciones

Donacion.findAll = (result) => {
  const sql = `
    SELECT ${publicFields}
    FROM Donaciones
  `; // Consulta SQL para obtener todas las donaciones con los campos públicos

  db.query(sql, (err, donations) => {
    if (err) {
      console.log("Error al listar donaciones:", err);
      return result(err, null);
    }

    return result(null, donations);
  });
}; // Método para obtener todas las donaciones, utilizando los campos públicos definidos en publicFields

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
}; // Método para obtener una donación por su ID, utilizando los campos públicos definidos en publicFields

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
}; // Método para eliminar una donación por su ID


// Método para crear una nueva donación, insertando los datos en la tabla Donaciones y dependiendo del tipo de donación, insertando los datos correspondientes en las tablas Monetarios u Objetos
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
  `; // Consulta SQL para crear una nueva donación, insertando los campos necesarios en la tabla Donaciones


  // Insertar la donación en la tabla Donaciones y obtener el ID generado para luego insertar los datos específicos en las tablas Monetarios u Objetos dependiendo del tipo de donación
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
        `; // Consulta SQL para crear una donación monetaria, insertando los campos necesarios en la tabla Monetarios

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
        `; // Consulta SQL para crear una donación de objetos, insertando los campos necesarios en la tabla Objetos

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
      } // Validación para asegurarse de que el tipo de donación sea válido (Monetario u Objeto)

      else {
        return result(
          { message: "Tipo de donación inválido" },
          null
        );
      }
    }
  );
}; // Método para crear una nueva donación, insertando los datos en la tabla Donaciones y dependiendo del tipo de donación, insertando los datos correspondientes en las tablas Monetarios u Objetos

Donacion.update = (id, donation, result) => {
  const sql = `
    UPDATE Donaciones
    SET
      categoria_donaciones = ?,
      tipo_donaciones = ?,
      id_Organizaciones = ?,
      id_Usuarios = ?
    WHERE id_Donaciones = ?
  `;

  db.query(
    sql,
    [
      donation.category,
      donation.donation_type,
      donation.organization_id,
      donation.user_id,
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
};// Método para actualizar una donación existente, modificando los campos necesarios en la tabla Donaciones


module.exports = Donacion;