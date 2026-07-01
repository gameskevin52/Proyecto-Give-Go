import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateLogin, validateRegister } from '../validators/userValidator';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Rutas de autenticación pública
router.post('/login', validateLogin, UserController.login);
router.post('/register', validateRegister, UserController.register);

// Rutas de perfil autenticado
router.get('/profile', authenticateJWT, UserController.getProfile);
router.put('/profile', authenticateJWT, UserController.updateProfile);

// Rutas de consultas por Email
router.get('/by-email/:email', UserController.getByEmail);
router.get('/stats/volunteers-count', UserController.getVolunteersCount);

// CRUD de Usuarios Administrativos (Admin)
router.get('/', authenticateJWT, UserController.getAll);
router.get('/:id', authenticateJWT, UserController.getById);
router.post('/', authenticateJWT, authorizeRoles('Admin'), UserController.create);
router.put('/:id', authenticateJWT, UserController.update);
router.delete('/:id', authenticateJWT, UserController.delete);

export default router;
