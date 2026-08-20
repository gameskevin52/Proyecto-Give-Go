//DEFINIR RUTAS DEL MODULO ORGANIZACIONES
import { Router } from 'express';//Ayuda a definir los endpoints
import { OrganizationController } from '../controllers/organizationController';//
import { validateOrgRegister } from '../validators/userValidator';//Validar que los datos enviados al registrarse estén correctos
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';//Estos verifican si el usuario inició sesión y si tiene permiso para realizar ciertas acciones

const router = Router();

router.get('/', OrganizationController.getAll);
router.get('/:id', OrganizationController.getById);
router.post('/', validateOrgRegister, OrganizationController.create);
router.put('/:id', OrganizationController.update);
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), OrganizationController.delete);

export default router;
