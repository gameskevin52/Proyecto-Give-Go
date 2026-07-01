import { Router } from 'express';
import { DonationController } from '../controllers/donationController';
import { validateMonetaryDonation, validateObjectDonation } from '../validators/donationValidator';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', DonationController.getAll);
router.get('/:id', DonationController.getById);
router.get('/volunteer/:usuarioId', DonationController.getByVolunteer);
router.get('/organization/:organizacionId', DonationController.getByOrganization);

// Rutas para registrar donaciones
router.post('/monetary', authenticateJWT, validateMonetaryDonation, DonationController.createMonetary);
router.post('/object', authenticateJWT, validateObjectDonation, DonationController.createObject);

// Eliminar donaciones
router.delete('/:id', authenticateJWT, DonationController.delete);

export default router;
