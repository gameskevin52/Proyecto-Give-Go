require ('dotenv').config(); //importa la libreria dotenv, .config() carga las variables del archivo .env.

module.exports ={ //exporta un objeto, hace que el archivo pueda ser utilizado en otras partes del proyecto.
    secretOrKey: process.env.JWT_SECRET// Crea una propiedad llamada secretOrKey guarda la clave secreta en JWT_SECRET del archivo .env, esta clave es para generar tokens JWT, validarlos y proteger la autenticacion.
};

//pregunta 1: que hace el archivo? respuesta: obtiene y exporta la clave secreta almacenada en el archivo .emv para utilizarla en la generacion y validacion de tokens JWT.

//pregunta 2: ¿Qué hace el archivo? y ¿Qué función cumple el archivo en el proyecto? Respuesta: centraliza y protege la clave secreta utilizada en la autenticacion del sistema, permitiendo reutilizarla de forma organizada.