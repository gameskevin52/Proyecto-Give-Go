import { Router } from 'express';

import { EventController } from '../controllers/eventController';
import { validateEvent } from '../validators/eventValidator';
import {
  authenticateJWT,
  authorizeRoles
} from '../middlewares/authMiddleware';

const router = Router();

/**
 * =========================================================
 * EVENTOS
 * =========================================================
 */

// Consultar todos los eventos
router.get(
  '/',
  EventController.getAll
);

// Consultar detalle de un evento
router.get(
  '/:id',
  EventController.getById
);

/**
 * =========================================================
 * CREAR EVENTO
 * =========================================================
 */

// Crear evento
// Solo las organizaciones autenticadas pueden crear eventos
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('Organizacion'),
  validateEvent,
  EventController.create
);

/**
 * =========================================================
 * ACTUALIZAR EVENTO
 * =========================================================
 */

// Actualizar evento
// Requiere autenticación y rol de organización
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('Organizacion'),
  validateEvent,
  EventController.update
);

/**
 * =========================================================
 * ELIMINAR EVENTO
 * =========================================================
 */

// Eliminar evento
// Requiere autenticación y rol de organización
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('Organizacion'),
  EventController.delete
);

/**
 * =========================================================
 * PARTICIPANTES
 * =========================================================
 */

// Consultar participantes de un evento
router.get(
  '/:id/participants',
  authenticateJWT,
  EventController.getParticipants
);

// Registrar participante
router.post(
  '/:id/participants',
  authenticateJWT,
  EventController.registerParticipant
);

// Cancelar inscripción
router.delete(
  '/:id/participants',
  authenticateJWT,
  EventController.unregisterParticipant
);

/**
 * =========================================================
 * EVENTOS DE UN VOLUNTARIO
 * =========================================================
 */

// Consultar eventos inscritos de un voluntario
router.get(
  '/volunteer/:usuarioId',
  authenticateJWT,
  EventController.getEventsByVolunteer
);

export default router;