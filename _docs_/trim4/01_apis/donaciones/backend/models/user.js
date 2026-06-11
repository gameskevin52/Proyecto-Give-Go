const db = require('../config/config'); // Importa la conexion a la base de datos desde el archivo config.js
const bcrypt = require ('bcryptjs'); //Importa la libreria bcryptjs. se usa para encriptar contraseñas.
const User ={}; //crea un objeto llamado User, aqui se guardan todas las funciones relacionadas con los usuarios.

//Funcion: LISTAR TODOS LOS USUARIOS
User.findALL=(result)=>{ //Crea una funcion para obtener todos los usuarios.
    const sql= `SELECT id, email, name, lastname, phone, image, role, created_at, updated_at FROM users`; //Consulta SQL que obtiene datos de la tabla users.
    db.query(sql,(err, users)=>{ //Ejecuta la consulta, err guarda errores, user guarda los usuarios encontrados.
        if (err){ // verifica si ocurrio un error.
            console.log('Error al listar usuarios: ',err);//arroja el mensaje a la consola.
            result (err, null);//devuelve el error.
        }else{
            console.log('Usuarios encontrados: ',users.length);//arroja mensaje a la consola.
            result(null, users);//devuelve la lista de usuarios si todo salio bien.
        }
    });
};


//Funcion: BUSCAR USUARIO POR ID
 User.findById =(id, result)=>{ //Busca un susario usando su ID.
    const sql = `SELECT id, email, name, lastname, image, phone, role, password FROM users WHERE id = ?`;//el ? reemplaza el ID enviado. ayuda a evitar inyecciones SQL 
    db.query(sql, [id], (err, user) => {
      if (err) {
        console.log('Error al consultar: ', err);
        result(err, null);
      }
      else {
        console.log('Usuario consultado: ', user[0]);
        result(null, user[0]);//devuelve el primer usuario encontrado.
 }
});
 };

 
//Funcion: BUSCAR USUARIO POR EMAIL
 User.findByEmail=(email, result)=>{//busca un usuario usando el correo electronico.
const sql = `SELECT id, email, name, lastname, image, phone, role, password FROM users WHERE email = ?`;//busac el usuario que tenga ese email.
   db.query(sql, [email], (err, user) => {
         if (err) {
           console.log('Error al consultar: ', err);
           result(err, null);
        }else {
           console.log('Usuario consultado: ',  user[0] );
           result(null, user[0]);

     }
   });
 };


 //funcion: CREAR USUARIO
  User.create = async (user, result)=>{//crea un nuevo usuario en la db.
    const hash = await bcrypt.hash(user.password, 10); //Encripta la contraseña antes de guardarla.
    const validRoles= ['admin', 'seller','customer','user'];//define los oles permitidos.
    const role = validRoles.includes(user.role)? user.role: 'user';//verifica si el rol es valido. si no lo es, asigna user por defecto 
    const sql = `INSERT INTO users(
      name,
      lastname,
      email,
      password,
      phone,
      image,
      role,
      created_at,
      updated_at
    )VALUES (?,?,?,?,?,?,?,?,?)`;// Incerta un nuevo usuario en la base de datos.
    db.query(sql,
        [
            user.name,
            user.lastname,
            user.email,
            hash,
            user.phone,
            user.image,
            role,
            new Date(),//guarda la fecha y hora actual.
            new Date()
        ], (err, res)=>{
            if(err){
                console.log('Error al crear Usuario: ', err);
                result(err,null);
            }else{
                console.log('Usuario creado: ',{id: res.insertId, ...user});// Obtiene el ID del usuario recien creado.
            }
        }
    );
  };


  //Funcion: ACTUALIZAR USUARIO
  User.update = async (user, result) => {//actualiza informacion de un usuario 
       let fields = [];//guardan los campos y valores que se actualizaran.
       let values = []; //guardan los campos y valores que se actualizaran.
     
       if (user.password) { // verifica su el susario envio nueva contraseña.
         const hash = await bcrypt.hash(user.password, 10);
        fields.push("password = ?"); // agrega el campo a actualizar.
        values.push(hash); //guardar el nuevo valor.
      } 
    
      if (user.email) {
        fields.push("email = ?");// agrega el campo a actualizar.
        values.push(user.email);//guardar el nuevo valor.
      }

      if (user.name) {
        fields.push("name = ?");// agrega el campo a actualizar.
        values.push(user.name);//guardar el nuevo valor.
      }
      if (user.lastname) {
        fields.push("lastname = ?");// agrega el campo a actualizar.
        values.push(user.lastname);//guardar el nuevo valor.
      }
      if (user.phone) {
        fields.push("phone = ?");// agrega el campo a actualizar.
        values.push(user.phone);//guardar el nuevo valor.
      }
      if (user.image) {
        fields.push("image = ?");// agrega el campo a actualizar.
        values.push(user.image);//guardar el nuevo valor.
      }
      if (user.role) {
        fields.push("role = ?");// agrega el campo a actualizar.
        values.push(user.role);//guardar el nuevo valor.
      }
   

    fields.push("updated_at = ?");
    values.push(new Date());

    const sql= `UPDATE users SET ${fields.join(", ")} WHERE id = ? `;//une todos los campos para crear el UPDATE.
    values.push(user.id);//Actualiza los datos del usuario en la tabla.

    db.query(sql, values, (err,res)=>{
        if(err){
            console.log('Error al actualizar usuario: ',err);
            result(err,null);
        }else{
            console.log('Usuario actualizado: ',{id: user.id, ...user});
            result(null, {id: user.id, ...user});
        }
    });
     
};

//Funcion: ELIMINAR USUARIO
User.delete = (id, result)=>{//elimina un suario por ID.
    const sql = `DELETE FROM users WHERE id=?`;// borra el usuario con ese id.
    db.query(sql,[id], (err, res)=>{
        if (err){
            console.log('Error al eliminar usuario: ',err);
            result(err, null);
        }else{
            console.log ('Usuario eliminado con id: ', id );
            result(null, res);//devuelve el resultado si la eliminacion fue exitosa.
        }

    });
};
module.exports= User;// exporta el objeto USER, permite usar estas funciones en otros archivos. 

//pregunta 1: Que hace el archivo? respuesta:Contiene  las funciones para administrar usuarios en la db, como crear, buscar, actualizar, listar y eliminar usuarios.

//pregunta 2: Que funcion cumple el archivo en el proyecto? respuesta: maneja toda la logica relacionada con los usarios y la comunicacion con la db, premite organizar y reutilizar las operaciones CRUD del proyecto.

