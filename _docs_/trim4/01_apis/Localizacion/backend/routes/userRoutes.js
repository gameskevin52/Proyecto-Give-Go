         const express = require('express');
         const router = express.Router();
         const userController = require('../controllers/userController');
         const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
    
         // Rutas públicas
         router.post('/create', userController.register);
         router.post('/login', userController.login);
    
             // Rutas protegidas
             router.get('/', verifyToken, authorizeRoles(['admin', 'organization']), userController.getAllUsers); 
             router.get('/:id', verifyToken, authorizeRoles(['admin', 'organization']), userController.getUserById);
             router.put('/:id', verifyToken, authorizeRoles(['admin', 'organization']), userController.getUserUpdate);
             router.delete('/delete/:id', verifyToken, authorizeRoles(['admin']), userController.getUserDelete);
        
             module.exports = router;