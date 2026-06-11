const JwtStrategy = require('passport-jwt').Strategy;// Importa la estrategia JWT de la libreria passport -jwt; Require() sirve para importar modulos; .Strategy obtiene la estrategia que passport usara para validar tokens.
 const ExtractJwt = require('passport-jwt').ExtractJwt;//Importa la funcion que extrae el token JWT desde la peticion del usuario.
 const passport = require('passport');//Passport es una libreria que maneja autenticacion en Node.js
 const Keys = require('./keys');//Importa el archivo Keys.js, que contiene la clave secreta usada para validar los tokens JWT.
 const User = require('../models/user');//Importa el modelo user, permite buscar usuarios en la db.
 
 const opts = { //crea un objeto
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//Indica donde se obtendra el token; fromAuthHeaderAsBearerToken() significa: Buscar el token en el encabezado Authorization, usar formato Bearer Token.
       secretOrKey: Keys.secretOrKey//define la clave secreta que se usara para verificar el token.
 
 };
 
 passport.use(new JwtStrategy(opts, (jwt_payload, done) => {//new JwtStrategy(): crea una nueva estrategia; opts: son las configuraciones; jwt:payload contiene la info guardada dentro del token.; done: es una funcion que indica si la autenticacion fue correcta o no.
       User.findById(jwt_payload.id, (err, user) => {// jwt_payload.id: ID del usuario; err: error si ocurre algo; user: usuario encontrado.
         if (err) {// verifica si ocurrio un error durante la busqueda.
           return done(err, false);// si hay un error: devuelve el error y la autenticacion falla (false.)
 
     }
     if (user) {// verifica si el usuario si existe en la db.
           return done(null, user);// si el usuario existe: null significa "sin errores", user significa autenticacion exitosa; passport permitira el acceso.
 
     }
     else{// si no existe el usuario, entra al else.
           return done(null, false);//no hubo error (null), pero la autenticacion fallo(false); el acceso sera denegado.
 
     }
   });
 }));
 
 module.exports = passport; // Exporta passport para poder usar esta configuracion en otros archivos del proyecto.

 //pregunta 1: Que hace el archivo? respuesta: Este archivo configura la utenticacion con JWT usando passport.js, verifica si el token enviado por el usuario es valido y si el usuario existe en la db.

 //pregunta 2: que funcion cumple en el proyecto? respuesta: Este archivo sirve para proteger rutas privadas del backend, cuando un usuario inicia sesion y obtiene un token, el archivo se encarga de leer el token, verificar si es correcto, busvar el usuario en la db y permitir o negar el acceso.