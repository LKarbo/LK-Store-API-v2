const express = require('express');
const router = express.Router();

const drinkController = require('../Controllers/drinkController');

router.post('/drink', drinkController.create);
router.get('/drink', drinkController.getAll);
router.get('/drink/:id', drinkController.getById);

module.exports = router;