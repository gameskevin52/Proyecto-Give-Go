const db = require('../config/config');
const bcrypt = require('bcryptjs');
const User = {};
const Organization = {};

Organization.findAllOrganizaciones = (result) => {
  const sql = `SELECT organizacion_id, organizacion_nombre, organizacion_categoria, organizacion_direccion, organizacion_correo, organizacion_contraseña FROM Organizaciones`;
  db.query(sql, (err, organizaciones) => {
    if (err) {
      console.log('Error al listar organizaciones: ', err);
      result(err, null);
    } else if (Organizaciones) {
      console.log('Organizaciones encontradas: ', Organizaciones.length);
      result(null, Organizaciones);
    }
  });
};

User.findAllUsuarios = (result) => {
  const sql = `SELECT usuario_id, usuario_nombre, usuario_apellido, usuario_direccion, usuario_telefono, usuario_estrato, usuario_correo, usuario_contraseña FROM Usuarios`;
  db.query(sql, (err, usuarios) => {
    if (err) {
      console.log('Error al listar usuarios: ', err);
      result(err, null);
    } else if (Usuarios) {
      console.log('Usuarios encontrados: ', Usuarios.length);
      result(null, Usuarios);
    }
  });
};

Organization.findById = (id, result) => {
  const sql = `SELECT organizacion_id, organizacion_nombre, organizacion_categoria, organizacion_direccion, organizacion_correo, organizacion_contraseña FROM Organizaciones WHERE organizacion_id = ?`;
  db.query(sql, [id], (err, user) => {
    if (err) {
      console.log('Error al consultar: ', err);
      result(err, null);
    }
    else {
      console.log('Organizacion consultada: ',  user[0] );
      result(null, user[0]);
    }
  });
};

User.findById = (id, result) => {
  const sql = `SELECT usuario_id, usuario_nombre, usuario_apellido, usuario_direccion, usuario_telefono, usuario_estrato, usuario_correo, usuario_contraseña FROM Usuarios WHERE usuario_id = ?`;
  db.query(sql, [id], (err, user) => {
    if (err) {
      console.log('Error al consultar: ', err);
      result(err, null);
    }
    else {
      console.log('Usuario consultado: ',  user[0] );
      result(null, user[0]);
    }
  });
};

Organization.findByEmail = (email, result) => {
  const sql = `SELECT organizacion_id, organizacion_nombre, organizacion_categoria, organizacion_direccion, organizacion_correo,  organizacion_contraseña FROM Organizaciones WHERE organizacion_correo = ?`;
  db.query(sql, [email], (err, user) => {
    if (err) {
      console.log('Error al consultar: ', err);
      result(err, null);
    }
    else {
      console.log('Organizacion consultada: ',  user[0] );
      result(null, user[0]);
    }
  });
};

User.findByEmail = (email, result) => {
  const sql = `SELECT usuario_id, usuario_nombre, usuario_apellido, usuario_direccion, usuario_telefono, usuario_estrato, usuario_correo, usuario_contraseña FROM Usuarios WHERE usuario_correo = ?`;
  db.query(sql, [email], (err, user) => {
    if (err) {
      console.log('Error al consultar: ', err);
      result(err, null);
    }
    else {
      console.log('Usuario consultado: ',  user[0] );
      result(null, user[0]);
    }
  });
};

Organization.create = async (organization, result) => {
  const hash = await bcrypt.hash(organization.password, 45);  
  const validRoles = ['admin', 'Organization'];
  const role = validRoles.includes(organization.role) ? organization.role : 'user';
  const sql = `INSERT INTO Organizaciones(
                organizacion_nombre,
                organizacion_categoria,
                organizacion_direccion,
                organizacion_correo,
                organizacion_contraseña
              ) VALUES (?,?,?,?,?)`;
  db.query(sql, [
    organization.name,
    organization.category,
    organization.address,
    organization.email,
    hash
  ], (err, res) => {
    if (err) {
      console.log('Error al crear organización: ', err);
      result(err, null);
    } else {
      console.log('Organización creada: ', { id: res.insertId, ...organization });
      result(null, { id: res.insertId, ...organization });
    }
  });
};

User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 45);  
  const validRoles = ['admin', 'Organization', 'user', 'Voluntario', 'Bemeficiario'];
  const role = validRoles.includes(user.role) ? user.role : 'user';
  const sql = `INSERT INTO Usuarios(
                usuario_id, 
                usuario_nombre,
                usuario_apellido, 
                usuario_direccion, 
                usuario_telefono, 
                usuario_estrato, 
                usuario_contraseña 
              ) VALUES (?,?,?,?,?,?,?)`;
  db.query(sql,
    [
      user.name,
      user.lastname,
      user.email,
      hash,
      user.phone,
      user.image,
      role,
      new Date(),
      new Date()
    ], (err, res) => {
      if (err) {
        console.log('Error al crear al Usuario: ', err);
        result(err, null);
      } else {
        console.log('Usuario creado: ', {id: res.insertId, ...user});
        result(null, {id: res.insertId, ...user});
      }
    }
  );
};

Organization.update = async (organization, result) => {
  let fields = [];
  let values = [];

  if (organization.password) {
    const hash = await bcrypt.hash(organization.password, 10);
    fields.push("password = ?");
    values.push(hash);
  }

  if (organization.email) {
    fields.push("email = ?");
    values.push(organization.email);
  }
  if (organization.name) {
    fields.push("name = ?");
    values.push(organization.name);
  }
  if (organization.lastname) {
    fields.push("lastname = ?");
    values.push(organization.lastname);
  }
  if (organization.phone) {
    fields.push("phone = ?");
    values.push(organization.phone);
  }
  if (organization.image) {
    fields.push("image = ?");
    values.push(organization.image);
  }
  if (organization.role) {
    fields.push("role = ?");
    values.push(organization.role);
  }

  fields.push("updated_at = ?");
  values.push(new Date());

  const sql = `UPDATE organizations SET ${fields.join(", ")} WHERE id = ?`;
  values.push(organization.id);

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log('Error al actualizar organización: ', err);
      result(err, null);
    } else {
      console.log('Organización actualizada: ', { id: organization.id, ...organization });
      result(null, { id: organization.id, ...organization });
    }
  });
};

User.update = async (user, result) => {
  let fields = [];
  let values = [];

  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);
    fields.push("password = ?");
    values.push(hash);
  }

  if (user.email) {
    fields.push("email = ?");
    values.push(user.email);
  }
  if (user.name) {
    fields.push("name = ?");
    values.push(user.name);
  }
  if (user.lastname) {
    fields.push("lastname = ?");
    values.push(user.lastname);
  }
  if (user.phone) {
    fields.push("phone = ?");
    values.push(user.phone);
  }
  if (user.image) {
    fields.push("image = ?");
    values.push(user.image);
  }
  if (user.role) {
    fields.push("role = ?");
    values.push(user.role);
  }

  fields.push("updated_at = ?");
  values.push(new Date());

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  values.push(user.id);

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log('Error al actualizar usuario: ', err);
      result(err, null);
    } else {
      console.log('Usuario actualizado: ', { id: user.id, ...user });
      result(null, { id: user.id, ...user });
    }
  });
};

User.delete = (id, result) => {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log('Error al eliminar usuario: ', err);
      result(err, null);
    } else {
      console.log('Usuario eliminado con id: ', id);
      result(null, res);
    }
  });
};

module.exports = User;