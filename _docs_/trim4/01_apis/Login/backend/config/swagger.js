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
        Donacion: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, readOnly: true },
            category: { type: "string", example: "Educacion" },
            donation_type: {
              type: "string",
              enum: ["Monetario", "Objeto"],
              example: "Monetario",
            },
            donation_date: { 
              type: "string", 
              format: "date-time",
              example: "2026-06-26T10:30:00Z"
            },
            organization_id: { type: "integer", example: 1 },
            user_id: { type: "integer", example: 1 },
          },
        },
        CreateDonacion: {
          type: "object",
          required: ["category", "donation_type", "organization_id", "user_id"],
          properties: {
            category: { 
              type: "string", 
              example: "Educacion",
              description: "Categoría de la donación"
            },
            donation_type: {
              type: "string",
              enum: ["Monetario", "Objeto"],
              example: "Monetario",
              description: "Tipo de donación"
            },
            organization_id: { 
              type: "integer", 
              example: 1,
              description: "ID de la organización receptora"
            },
            user_id: { 
              type: "integer", 
              example: 1,
              description: "ID del usuario donador"
            },
            payment_method: {
              type: "string",
              example: "Tarjeta",
              description: "Método de pago (solo para Monetario)"
            },
            account_number: {
              type: "string",
              example: "12345678",
              description: "Número de cuenta (opcional para Monetario)"
            },
            total_value: {
              type: "number",
              example: 50000,
              description: "Valor total de la donación monetaria"
            },
            object_category: {
              type: "string",
              example: "Alimentos",
              description: "Categoría del objeto (para Objeto)"
            },
            description: {
              type: "string",
              example: "Descripción del evento",
              description: "Descripción de la donación de objetos"
            },
            quantity: {
              type: "integer",
              example: 10,
              description: "Cantidad de objetos donados"
            },
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
      { name: "Donaciones", description: "Gestión de donaciones" },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/userRoutes.js'),
    path.join(__dirname, '../routes/organizationRoutes.js'),
    path.join(__dirname, '../routes/donacionRoutes.js')
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;