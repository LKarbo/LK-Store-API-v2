const drinkModel = require('../Models/drinkModel');

exports.create = async (req, res) => {
    const { name, price, img_url } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ 
            success: false, 
            message: 'El nombre y precio son campos requeridos' 
        });
    }

    try {
        const result = await drinkModel.createDrink({
            name,
            price,
            img_url
        });
        res.json({ success: true, drink: result });
    } catch (error) {
        console.error("Error en create:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear la bebida',
            error: error.message 
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const drinks = await drinkModel.getAllDrinks();
        res.json({ success: true, drinks });
    } catch (error) {
        console.error("Error en getAll:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las bebidas',
            error: error.message 
        });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const drink = await drinkModel.getDrinkById(id);
        if (!drink) {
            return res.status(404).json({ 
                success: false, 
                message: 'Bebida no encontrada' 
            });
        }
        res.json({ success: true, drink });
    } catch (error) {
        console.error("Error en getById:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener la bebida',
            error: error.message 
        });
    }
};