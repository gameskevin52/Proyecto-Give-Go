const swaggerJsdoc = require("swagger-jsdoc");
const path = require('path');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Give Go",
      version: "1.0.0",
      description: "Documentación de la API REST",
      contact: {
        name: "Zharick Rodriguez",
        email: "zharick2809@gmail.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local - Desarrollo",
      },
      {
        url: "http://127.0.0.1:3000",
        description: "Servidor local - Alternativo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object", nullable: true },
          },
        },
        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
          },
          example: {
            email: "zharick2809@gmail.com",
            password: "12345",
          },
        },
        User: {
          type: "object",
          required: ["first_name", "first_lastname", "phone", "email", "password"],
          properties: {
            id: { type: "integer", example: 1, readOnly: true },
            role: {
              type: "string",
              enum: ["Admin", "Voluntario", "Beneficiario"],
              example: "Voluntario",
            },
            first_name: { type: "string", example: "Zharick" },
            second_name: { type: "string", example: "Sofia", nullable: true },
            first_lastname: { type: "string", example: "Rodriguez" },
            second_lastname: { type: "string", example: "Gutierrez", nullable: true },
            phone: { type: "string", example: "3223347010", pattern: "^[0-9]{10}$" },
            email: { type: "string", format: "email", example: "zharick2809@gmail.com" },
            password: { 
              type: "string", 
              format: "password",
              minLength: 6,
              writeOnly: true
            },
          },
        },
        Organization: {
          type: "object",
          required: ["name", "address", "email", "password"],
          properties: {
            id: { type: "integer", example: 1, readOnly: true },
            name: { type: "string", example: "Fundacion Give Go" },
            address: { type: "string", example: "Calle 123 #45-67" },
            email: { type: "string", format: "email", example: "contacto@givego.com" },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              writeOnly: true,
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            error: { type: "object" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Auth", description: "Autenticación" },
      { name: "Users", description: "Gestión de usuarios" },
      { name: "Organizations", description: "Gestión de organizaciones" },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/userRoutes.js'),
    path.join(__dirname, '../routes/organizationRoutes.js')
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;