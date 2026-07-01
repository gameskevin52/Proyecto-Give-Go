import { Router } from 'express';
import { DonationController } from '../controllers/donationController';
import { validateMonetaryDonation, validateObjectDonation } from '../validators/donationValidator';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Rutas más específicas PRIMERO para evitar conflictos con :id
router.get('/volunteer/:usuarioId', DonationController.getByVolunteer);
router.get('/organization/:organizacionId', DonationController.getByOrganization);

// Rutas para registrar donaciones
router.post('/monetary', validateMonetaryDonation, DonationController.createMonetary);
router.post('/object', validateObjectDonation, DonationController.createObject);

// Rutas genéricas DESPUÉS
router.get('/:id', DonationController.getById);
router.get('/', DonationController.getAll);

// Actualizar donación
router.put('/:id', DonationController.update);

// Eliminar donaciones
router.delete('/:id', DonationController.delete);

export default router;
