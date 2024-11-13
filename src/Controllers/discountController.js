const discountModel = require('../Models/discountModel');

exports.create = async (req, res) => {
    const { code, isActive, percent } = req.body;
    
    if (!code || percent === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: 'El código y porcentaje son campos requeridos' 
        });
    }

    try {
        const result = await discountModel.createDiscount({
            code,
            isActive,
            percent
        });
        res.json({ success: true, discount: result });
    } catch (error) {
        console.error("Error en create:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear el descuento',
            error: error.message 
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const discounts = await discountModel.getAllDiscounts();
        res.json({ success: true, discounts });
    } catch (error) {
        console.error("Error en getAll:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener los descuentos',
            error: error.message 
        });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const discount = await discountModel.getDiscountById(id);
        if (!discount) {
            return res.status(404).json({ 
                success: false, 
                message: 'Descuento no encontrado' 
            });
        }
        res.json({ success: true, discount });
    } catch (error) {
        console.error("Error en getById:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener el descuento',
            error: error.message 
        });
    }
};