const express = require('express');
const router = express.Router();

const hamburgerController = require('../Controllers/hamburgerController');

router.post('/hamburger', hamburgerController.create);
router.get('/hamburger', hamburgerController.getAll);
router.get('/hamburger/:id', hamburgerController.getById);

module.exports = router;