const express = require('express');
const router = express.Router();

const orderController = require('../Controllers/orderController');

router.post('/order', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/order/:id', orderController.getOrderById);

module.exports = router;