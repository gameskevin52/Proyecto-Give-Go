import { Router } from 'express';
import { VerificationController } from '../controllers/verificationController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', VerificationController.getAll);
router.get('/org/:orgId', VerificationController.getOrgStatus);
router.get('/:id', VerificationController.getById);
router.post('/request', VerificationController.createRequest);
router.put('/:id/respond', VerificationController.respondRequest);
router.put('/:id', VerificationController.update);
router.delete('/:id', VerificationController.delete);

export default router;
