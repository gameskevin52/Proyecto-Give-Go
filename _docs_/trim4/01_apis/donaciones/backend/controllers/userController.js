  const User = require("../models/user");//importa el modelo user, permite trabajar con la db de usuarios.
     const bcrypt = require("bcryptjs");//importa bcryptjs. s eusa para comparar contraseñas encriptadas.
     const jwt = require("jsonwebtoken");// importa el jsronwebtoken crea tokens JWT.
     const keys = require("../config/keys");//importa el archivo keys, contiene la clave secreta usada para firmar los tokens.
     
     module.exports = {//exporta un objeto con otras las funciones del controlador. permite usar esats funciones en otros archivos.
       login(req, res) {//crea funcion login. req= datos enviador por cliente. res=respuesta del servidor.
         const email = req.body.email;//obtiene el email enviado desde el fronted.
         const password = req.body.password;//obtiene contraseña enviada.
     
         User.findByEmail(email, async (err, myUser) => {//busca un usuario por email en la db. myuser=uusario encontrado. async perimite usar await.
           if (err) {//verifica si hibo error en la consulta.
             return res.status(501).json({
               success: false,
               message: "Error al consultar el usuario",
               error: err,
             });
           }//linea 13 a 17 devuelve un error en formato JSON 501 error del servidor; success: false= operacion fallida.
     
           if (!myUser) {//verifica si el usuario NO existe "!" significa negacion.
             return res.status(401).json({
               success: false,
               message: "El email no existe en la base de datos",
             });//linea 21 a 24 devuelve error porque el correo no fue encontrado. 401 = no autorizado.
           }
     
           const isPasswordValid = await bcrypt.compare(password, myUser.password);// compara: contraseña escrita por el usuario, con la contraseña encriptada guardada en la db. devuleve true = si coinciden y false= si no.
     
           if (isPasswordValid) {//verifica si la contraseña es correcta.
             const token = jwt.sign(
               { id: myUser.id, email: myUser.email, role: myUser.role },
               keys.secretOrKey,
               { expiresIn: "1h" }
             );//linea 30 a 34 crea un token JWT dentro del token guarda: id, email, rol; ademas usa la clave secreta y exprira en 1 hora.
     
             const data = {//crea un objeto llamado data, aqui se almacenan los datos del usuario.
               id: myUser.id,
               email: myUser.email,
               name: myUser.name,
               lastname: myUser.lastname,
               image: myUser.image,
               phone: myUser.phone,
               role: myUser.role,
               session_token: `JWT ${token}`,// usa template strings para unir texto y variable.
             };// Lineas 37 a 44 guarda info del usuario; sesion_token agrega el token JWT
     
             return res.status(201).json({
               success: true,
               message: "Usuario autenticado",
               data: data,
             });//linea 46 a 51 devuelve respuesta exitosa 201= creado/ exitoso, data contiene los datos del usuario.
           } else {//se ejecuta si la contraseña es incorrecta 
             return res.status(401).json({
               success: false,
               message: "Contraseña o correo incorrecto",
             });// linea 53 a 56 devuele error de autenticacion.
           }
         });
       },
     
       //FUNCION getAllUsers
       getAllUsers(req, res) {//funcion para obtener todos los usuarios.
         User.findAll((err, users) => {//busca todos los usuarios en la db.
           if (err) {//vet¿rifica errores
             return res.status(501).json({
               success: false,
               message: "Error al listar usuarios",
               error: err,
             });//devuelve error si falla la consulta.
           }
           return res.status(200).json({
             success: true,
             message: "Lista de usuarios",
             data: users,
           });//linea 70 a 74 devuelve la lista de usuarios 200= operacion exitosa.
         });
       },
     
       //FUNCION getUserByld 
       getUserById(req, res) {//funcion para buscar usuario por ID.
         const id = req.params.id;//obtiene el ID desde la URL 
         User.findById(id, (err, user) => {//buscar usuario por ID.
           if (err) {//verifica errores.
             return res.status(501).json({
               success: false,
               message: "Error al consultar el usuario",
               error: err,
             });//linea 84 a 88 devuelve error si falla la busqueda.
           }
           if (!user) {//verifica su el usuario no existe.
             return res.status(404).json({
               success: false,
               message: "Usuario no encontrado",
             });//liena 90 a 94 devuelve error 404 =no encontrado.
           }
           return res.status(200).json({
             success: true,
             message: "Usuario encontrado",
             data: user,
           });//linea 96 a 100 devuelve el usuario encontrado.
         });
       },
     
       //funcion register.
       register(req, res) {//funcion para registrar usuarios.
         const user = req.body;//obtiene los datos enviados desde el frontend.
     
         if (!user.role) {//verifica si el usuario no tiene rol.
           user.role = "user";//asigma el rol "user"por defecto.
         }
     
         User.create(user, (err, data) => {//crea el usuario en la db.
           if (err) {//verifica errores.
             return res.status(501).json({
               success: false,
               message: "Error al crear al usuario",
               error: err,
             });//linea 114 a 118 devuelve error si falla el registro.
           } else {//se ejecuta si el usuario fue creado correctamente.
             return res.status(201).json({
               success: true,
               message: "Usuario creado correctamente",
               data: data,
             });//linea 120 a 124 devuelve exito y datos del usuario creado.
           }
         });
       },
     
       //Funcion getUserUpdate.
       getUserUpdate(req, res) {//Funcion para actualizar usuarios.
         const user = req.body;//obtiene datos actualizados.
         User.update(user, (err, data) => {//actualiza el usuario en la db.
           if (err) {
             return res.status(501).json({
               success: false,
               message: "Error al actualizar el usuario",
               error: err,
             });//linea 134 a 138 devuelve error si falla la actualizacion.
           }
           return res.status(200).json({
             success: true,
             message: "Usuario actualizado",
             data: data,
           });//linea 140 a 144 devuelve exito y datos actualizados.
         });
       },
     
       //Funcion getUserDelete
       getUserDelete(req, res) {// funcion para eliminar usuarios.
         const id = req.params.id;//obtiene el ID desde la URL.
         User.delete(id, (err, data) => {//elimina el usuario de la db.
           if (err) {//verifica errores.
             return res.status(501).json({
               success: false,
               message: "Error al eliminar el usuario",
               error: err,
             });//liena 153 a 157 devuelve error si falla la eliminacion.
           }
           return res.status(200).json({
             success: true,
             message: "Usuario eliminado",
             data: data,
           });//linea 159 a 163 devuelve confirmacion de eliminacion.
         });
       },
     };

     //pregunta 1: que hace el archivo? respuesta: controla todas las acciones relacionadas con los usuarios, se manejan funciones como: inicio sesion, registrar usuarios, listar usuarios, buscar usuarios, actualizar usuarios, eliminar usuarios. 

     //pregunta 2: recibe solicitudes del cliente (frontend), procesa la infor y responde con datos o mensajes. es el intermedirario entre las rutas (routes) y el modelo (models/user.js).