const jwt = require("jsonwebtoken");//importa la libreria jsonwebtoken, verifica tokens JWT lee informacion del token.
     const keys = require("../config/keys");//importa el archivo keys.js tiene la clave secreta usada par avalidar tokens.
     
     //funcion verifyToken
     function verifyToken(req, res, next) {//crea la funcion muddleware verifyToken con parametros: req= solicitud cliente, res= respuesta del servidor, next= continua al siguiente middleware o controlador.
       const authHeader = req.headers["authorization"];//obtiene el encabezado authorization de la peticion.
       if (!authHeader) {//verifica si NO existe el encabezado.
         return res.status(403).json({
           success: false,
           message: "No se proporcionó un token",
         });//linea 8 a 11 devuelve error porque no se envio token. 403 = acceso prohibido.
       }
     
       const token = authHeader.split(" ")[1];//divide el texto del encabezado.
       if (!token) {// verifica si el token no existe o esta vacio
         return res.status(403).json({
           success: false,
           message: "Formato de token inválido",
         });//linea 16 a 18 devuelve error porque el token tiene formato incorrecto.
       }
     
       jwt.verify(token, keys.secretOrKey, (err, decoded) => {//verifica si el token es valido con parametros: token= token enviado, keys.secretOrKey=clave secreta,(err, decoded)= resultado de la validacion.
         if (err) {//verifica si ocurrio error al validar el token.
           return res.status(401).json({
             success: false,
             message: "Token inválido o expirado",
             error: err,
           });//linea 24 a 28 devuelve error porque el token es invalido o ya expirio, 401= no autorizo.
         }
         req.user = decoded;//guarda la informacion decodificada del token en  req.user asi como archivos pueden acceder al usuario autenticado.
         next();//continua hacia el siguiente middlerware o controlador, si el token es valido, permite el acceso.
       });
     }
     
     //Funcion authorizeRoles.
     function authorizeRoles(roles) {//crea una funcion para autorizar roles, recibe un arreglo de roles permitidos.
       return (req, res, next) => {// retorna otro middlware ese middleware verificara el rol del usuario.
         if (!req.user || !roles.includes(req.user.role)) {//verifica dos cosas si no existe usuario autenticado, si el rol del usuario no esta permitido. includes() busca si el rol existe en el arreglo.
           return res.status(403).json({
             success: false,
             message: `Acceso denegado: se requiere rol ${roles.join(" o ")}`,
           });//linea 39 a 42 devuelve error de acceso roles.join("o") une los roles.
         }
         next();// sie l usuario da permitos, continua la ejecucion.
       };
     }
     
     module.exports = {//exporta las funciones del archivo.
       verifyToken,//exporta el middleware verifytoken.
       authorizeRoles,//exporta el middleware authorizeRoles.
     };

     //pregunta 1: que hace el archivo? Respuesta: crea middlewares de autenticacion y autorizacion usando JWT, sirve para verificar si un usuario tiene un token valido. Verificar si el usuario tiene permisos o roles especificos.

     //pregunta 2: que funcion cumple en el proyecto? protege rutas privadas del backend, andes de permitir acceso a cuertas funciones: valida el token del usuario, revisa si el usuario inicio sesion, verifica si tiene permisos adecuados.