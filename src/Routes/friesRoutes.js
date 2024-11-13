const express = require('express');
const router = express.Router();

const friesController = require('../Controllers/friesController');

router.post('/fries', friesController.create);
router.get('/fries', friesController.getAll);
router.get('/fries/:id', friesController.getById);

module.exports = router;