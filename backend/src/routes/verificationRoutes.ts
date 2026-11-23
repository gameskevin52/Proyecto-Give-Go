import { Router } from 'express';
import { VerificationController } from '../controllers/verificationController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateJWT, authorizeRoles('Admin'), VerificationController.getAll);
router.get('/org/:orgId', authenticateJWT, authorizeRoles('Admin', 'Organizacion'), VerificationController.getOrgStatus);
router.get('/:id', authenticateJWT, authorizeRoles('Admin', 'Organizacion'), VerificationController.getById);
router.post('/request', authenticateJWT, authorizeRoles('Admin', 'Organizacion'), VerificationController.createRequest);
router.put('/:id/respond', authenticateJWT, authorizeRoles('Admin'), VerificationController.respondRequest);
router.put('/:id', authenticateJWT, authorizeRoles('Admin'), VerificationController.update);
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), VerificationController.delete);

export default router;
