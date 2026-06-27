const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const usersRoutes = require("./routes/userRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const donacionRoutes = require("./routes/donacionRoutes");

const app = express();

// ============================================
// CONFIGURACIÓN CORS MEJORADA PARA SWAGGER
// ============================================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ============================================
// MIDDLEWARES NORMALES
// ============================================
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DOCUMENTACIÓN SWAGGER
// ============================================
const swaggerOptions = {  
  swaggerOptions: {
    docExpansion: 'list',           
    defaultModelsExpandDepth: -1,   
    defaultModelExpandDepth: 1,     
    displayRequestDuration: true,   
    filter: false,                  
    layout: 'BaseLayout',  
    showExtensions: true,
    showCommonExtensions: true,
    deepLinking: true,         
    persistAuthorization: true,
    tagsSorter: 'alpha',       
    operationsSorter: function(a, b) {
      const methodOrder = { 'post': 1, 'get': 2, 'put': 3, 'delete': 4 };
      return methodOrder[a.get('method')] - methodOrder[b.get('method')];
    }  
  }  
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// ============================================
// RUTAS DE LA API
// ============================================
app.use("/api/users", usersRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/donaciones", donacionRoutes);

app.get("/", (req, res) => {
  res.send("Ruta raiz del Backend");
});

app.get("/test", (req, res) => {
  res.send("Ruta TEST");
});

// ============================================
// MANEJADOR DE ERRORES
// ============================================
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

console.log('📚 Swagger disponible en: http://192.168.1.8:3000/api-docs');
module.exports = app;