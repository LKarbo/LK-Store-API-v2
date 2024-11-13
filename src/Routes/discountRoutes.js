const express = require('express');
const router = express.Router();

const discountController = require('../Controllers/discountController');

router.post('/discount', discountController.create);
router.get('/discount', discountController.getAll);
router.get('/discount/:id', discountController.getById);

module.exports = router;