import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { validateEvent } from '../validators/eventValidator';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);
router.post('/', authenticateJWT, authorizeRoles('Admin', 'Organizacion'), validateEvent, EventController.create);
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'Organizacion'), EventController.update);
router.delete('/:id', authenticateJWT, authorizeRoles('Admin', 'Organizacion'), EventController.delete);

// Rutas de seguimiento/participación en eventos
router.get('/:id/participants', EventController.getParticipants);
router.post('/:id/register', authenticateJWT, EventController.registerParticipant);
router.post('/:id/unregister', authenticateJWT, EventController.unregisterParticipant);
router.get('/volunteer/:usuarioId', EventController.getEventsByVolunteer);

export default router;
