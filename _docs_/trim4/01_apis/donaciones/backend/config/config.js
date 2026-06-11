 require ('dotenv').config(); // importa la libreria dotenv; .config() carga las variables del archivo .env para que puedan usarse en el proyecto.
 const mysql = require('mysql'); //importa libreria mysql la cual permite concetar el node.js con una base de datos mysql.
 const db = mysql.createConnection({ //crea una conexion hacia la db, la info de conexion se configura dentro de {}.
  host: process.env.DB_HOST,// Obtiene el valor de DB_HOST desde el .env, indica donde se encuentra el servidor de la db.
  user: process.env.DB_USER,//obtiene un usuario de mysql desde el .env, se usa para inicar sesion en la db.
  password: process.env.DB_PASSWORD,//obtiene la contraseña del usuario de mysql desde el .env.
  database: process.env.DB_NAME,//obtiene el nombre de la base de datos que utilizara el proyecto.
  port: process.env.DB_PORT// obtiene el puerto donde mysql recibe conexiones, el puerto es 3306.     
});
db.connect(function(err){ //conecta la aplicacion con la db, err almacena cualquier error que ocurra durante la conexion.
    if (err)throw err; //si ocurre un error, lo muestra y detiene la ejecucion del programa.
    console.log('Base de datos conectada')//muestra un mensaje en consola indicando que la conexion fue exitosa.

});
module.exports = db;//exporta la conexion db. permite usar la conexion a la db en otroa archivos del proyecto.

// pregunta 1: que hace el archivo? respuesta: el archivo configura y establece la conexion entre la aplicacion node.js y la db.

//prgeunta 2: que funcion cumple el archivo en el proyecto? respuesta:centraliza la conexion de la db, permitiendo que otros archivos del proyecto puedan reutilizar la misma conexion de manera organizada, segura y eficiente.