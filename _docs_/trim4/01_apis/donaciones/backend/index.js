const http = require('http');//importa el modulo http de node.js para crear un servidor HTTP.
const app = require('./server');//importa la aplicacion configurada en el archivo server.js, que contiene la logica del backend, las rutas y los middlewares.
const cors = require('cors');//importa el middleware CORS.
const port = process.env.PORT || 3000;//Define el puerto del servidor, usa una variable de entorno si existe o el puerto 3000 por defecto. Esto permite flexibilidad para desplegar la aplicacion en diferentes entornos sin cambiar el codigo.
const host = process.env.HOST || '192.168.137.218';//define la direccion IP donde correra el servidor, usa una variable de entorno si existe o la IP local por defecto. Esto es importante para asegurar que el servidor escuche en la direccion correcta, especialmente en entornos de desarrollo o despliegue.

//configuracion CORS
app.use (cors({// activa CORS con una configuracion perosnalizada para permitir solicitudes desde ciertos origenes, con credenciales y metodos especificos.
    origin: [ //define los origenes permitidos para las solicitudes CORS, en este caso se permiten solicitudes desde la IP local, localhost.
        'http://192.168.137.218',//permite solicitudes desde esa IP local.
        'http://localhost',//permite solicitudes desde localhost.
        'http://127.0.0.1' //permite solicitudes desde la ip local estandar.
    ],
    credentials: true, //permite enviar cookies o credenciales en las solicitudes CORS, lo que es necesario para autenticacion y sesiones.
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],//define los metodos http permitidos para las solicitudes CORS, lo que ayuda a controlar el tipo de operaciones que los clientes pueden realizar en el servidor.
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With']//define los encabezados permitidos.
}));

//Manejar preflight CORS
app.options ('*', cors());//atiende automaticamente las solicitudes OPTIONS que hacen los navegadores antes de ciertas solicitudes CORS, lo que es necesario para que las solicitudes CORS funcionen correctamente.
app.set('port', port);//guarda el puerto dentro de la aplicacion express, lo que permite acceder a esta configuracion desde otros lugares del codigo si es necesario.

const server = http.createServer(app);//crea un servidor http utilizando la aplicacion express como manejador de solicitudes, lo que permite que el servidor responda a las solicitudes HTTP utilizando la logica definida en server.js.

server.listen(port, host, ()=>{//inicia el servidor en el puerto e IP especificados.
    console.log(`Servidor corriendo en http://${host}:${port}`);//muestra un mensaje indicando donde esta funcionando el servidor.
});

//Pregunta1: Que hace el archivo? rta: Inicia el servidor backend, configura CORS y pone la aplicacion a escuchar peticiones en un puerto especifico.

//pregunta2:Que funcion cumple el archivo en el proyecto? rta: El el punto de arranque del proyecto. Toma la aplicacion configurada en server.js, y la ejejcuta para que pueda recibir solicitudes.