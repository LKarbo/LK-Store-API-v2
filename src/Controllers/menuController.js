const menuModel = require('../Models/menuModel');

exports.create = async (req, res) => {
    const { discount, drink, fries, hamburger, isDiscounted, price } = req.body;
    
    if (!hamburger || !drink || !fries || !price) {
        return res.status(400).json({ 
            success: false, 
            message: 'Hamburguesa, bebida, papas y precio son campos requeridos' 
        });
    }

    try {
        const result = await menuModel.createMenu({
            discount,
            drink,
            fries,
            hamburger,
            isDiscounted,
            price
        });
        res.json({ success: true, menu: result });
    } catch (error) {
        console.error("Error en create:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear el menú',
            error: error.message 
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const menus = await menuModel.getAllMenus();
        res.json({ success: true, menus });
    } catch (error) {
        console.error("Error en getAll:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener los menús',
            error: error.message 
        });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const menu = await menuModel.getMenuById(id);
        if (!menu) {
            return res.status(404).json({ 
                success: false, 
                message: 'Menú no encontrado' 
            });
        }
        res.json({ success: true, menu });
    } catch (error) {
        console.error("Error en getById:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener el menú',
            error: error.message 
        });
    }
};