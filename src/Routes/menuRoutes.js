const express = require('express');
const router = express.Router();

const menuController = require('../Controllers/menuController');

router.post('/menu', menuController.create);
router.get('/menu', menuController.getAll);
router.get('/menu/:id', menuController.getById);

module.exports = router;