const express = require('express');
const router = express.Router();

//Controlador
const userController = require('../Controllers/userController');
// Rutas del controlador
router.post('/user/register', userController.register);
router.get('/user', userController.getAll);
router.get('/user/:ID', userController.getData);
router.put('/user/edit/:id', userController.edit);
router.put('/user/edit/rol/:id', userController.changeRol);

module.exports = router;
