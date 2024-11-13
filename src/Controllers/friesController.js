const friesModel = require('../Models/friesModel');

exports.create = async (req, res) => {
    const { name, price, img_url, isDiscounted, discountId } = req.body;
    
    if (!name || price === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: 'El nombre y precio son campos requeridos' 
        });
    }

    try {
        const result = await friesModel.createFries({
            name,
            price,
            img_url,
            isDiscounted,
            discountId
        });
        res.json({ success: true, fries: result });
    } catch (error) {
        console.error("Error en create:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear las papas',
            error: error.message 
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const fries = await friesModel.getAllFries();
        res.json({ success: true, fries });
    } catch (error) {
        console.error("Error en getAll:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las papas',
            error: error.message 
        });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const fries = await friesModel.getFriesById(id);
        if (!fries) {
            return res.status(404).json({ 
                success: false, 
                message: 'Papas no encontradas' 
            });
        }
        res.json({ success: true, fries });
    } catch (error) {
        console.error("Error en getById:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las papas',
            error: error.message 
        });
    }
};