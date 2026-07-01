import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', authenticateJWT,  CategoryController.create);
router.put('/:id', authenticateJWT,  CategoryController.update);
router.delete('/:id', authenticateJWT,  CategoryController.delete);

export default router;
