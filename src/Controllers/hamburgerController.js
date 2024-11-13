const hamburgerModel = require('../Models/hamburgerModel');

exports.create = async (req, res) => {
    const { name, price, img_url, isDiscounted, discountId } = req.body;
    
    if (!name || price === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: 'El nombre y precio son campos requeridos' 
        });
    }

    try {
        const result = await hamburgerModel.createHamburger({
            name,
            price,
            img_url,
            isDiscounted,
            discountId
        });
        res.json({ success: true, hamburger: result });
    } catch (error) {
        console.error("Error en create:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear la hamburguesa',
            error: error.message 
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const hamburgers = await hamburgerModel.getAllHamburgers();
        res.json({ success: true, hamburgers });
    } catch (error) {
        console.error("Error en getAll:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las hamburguesas',
            error: error.message 
        });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const hamburger = await hamburgerModel.getHamburgerById(id);
        if (!hamburger) {
            return res.status(404).json({ 
                success: false, 
                message: 'Hamburguesa no encontrada' 
            });
        }
        res.json({ success: true, hamburger });
    } catch (error) {
        console.error("Error en getById:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener la hamburguesa',
            error: error.message 
        });
    }
};