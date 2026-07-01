import { Router } from 'express';
import { OrganizationController } from '../controllers/organizationController';
import { validateOrgRegister } from '../validators/userValidator';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', OrganizationController.login);
router.get('/', OrganizationController.getAll);
router.get('/:id', OrganizationController.getById);
router.post('/', validateOrgRegister, OrganizationController.create);
router.put('/:id', authenticateJWT, OrganizationController.update);
router.delete('/:id', authenticateJWT, OrganizationController.delete);

export default router;
