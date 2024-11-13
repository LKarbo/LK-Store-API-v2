const express = require('express');
const router = express.Router();

const supportController = require('../Controllers/supportController');

router.post('/support', supportController.create);
router.get('/support', supportController.getAll);
router.get('/support/:id', supportController.getById);
router.put('/support/:id/reply', supportController.reply);

module.exports = router;