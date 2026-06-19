const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Gestión de organizaciones
 */

/**
 * @swagger
 * /api/organizations/create:
 *   post:
 *     summary: Crear organización
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       201:
 *         description: Organización creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/create", organizationController.register);

/**
 * @swagger
 * /api/organizations/login:
 *   post:
 *     summary: Iniciar sesión de organización
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Organización autenticada
 *       401:
 *         description: Credenciales incorrectas
 */
router.post("/login", organizationController.login);

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Listar organizaciones
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de organizaciones
 */
router.get("/", verifyToken, authorizeRoles(["Admin", "Organizacion"]), organizationController.getAllOrganizations);

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Consultar organización por ID
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Organización encontrada
 *       404:
 *         description: Organización no encontrada
 */
router.get("/:id", verifyToken, authorizeRoles(["Admin", "Organizacion"]), organizationController.getOrganizationById);

/**
 * @swagger
 * /api/organizations/{id}:
 *   put:
 *     summary: Actualizar organización
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       200:
 *         description: Organización actualizada
 */
router.put("/:id", verifyToken, authorizeRoles(["Admin", "Organizacion"]), organizationController.getOrganizationUpdate);

/**
 * @swagger
 * /api/organizations/delete/{id}:
 *   delete:
 *     summary: Eliminar organización
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Organización eliminada
 */
router.delete("/delete/:id", verifyToken, authorizeRoles(["Admin"]), organizationController.getOrganizationDelete);

module.exports = router;