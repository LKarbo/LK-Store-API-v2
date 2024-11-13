const orderModel = require('../Models/orderModel');

exports.createOrder = async (req, res) => {
    const { user, orderData, price } = req.body;

    try {
        const newOrder = await orderModel.createOrder({
            user,
            orderData,
            price,
            dateTime: new Date()
        });

        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ success: false, message: "Error al crear la orden", error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.getAllorder();
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        res.status(500).json({ success: false, message: "Error al obtener las órdenes", error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await orderModel.getOrderById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Orden no encontrada" });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        res.status(500).json({ success: false, message: "Error al obtener la orden", error: error.message });
    }
};