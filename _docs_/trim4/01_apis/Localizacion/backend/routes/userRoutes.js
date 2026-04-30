         const express = require('express');
         const router = express.Router();
         const userController = require('../controllers/userController');
         const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
    
         // Rutas públicas
         router.post('/create', userController.register);
         router.post('/login', userController.login);
    
             // Rutas protegidas
             router.get('/', verifyToken, authorizeRoles(['admin', 'seller']), userController.getAllUsers);// preguntarle al profesor que la authorizacion para eliminar y actualizar las organizaciones solo lo podrian hacer si son unicamente en su organizacion 
             router.get('/:id', verifyToken, authorizeRoles(['admin', 'seller']), userController.getUserById);
             router.put('/:id', verifyToken, authorizeRoles(['admin', 'seller']), userController.getUserUpdate);
             router.delete('/delete/:id', verifyToken, authorizeRoles(['admin']), userController.getUserDelete);
        
             module.exports = router;