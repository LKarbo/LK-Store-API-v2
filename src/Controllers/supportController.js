const supportModel = require('../Models/supportModel');

exports.create = async (req, res) => {
    const { userId, consulta, email } = req.body;
    
    if (!userId || !consulta || !email) {
        return res.status(400).json({ 
            success: false, 
            message: 'UserId, email y consulta son campos requeridos' 
        });
    }

    try {
        const result = await supportModel.createSupport({
            userId,
            consulta,
            email
        });
        res.json({ success: true, support: result });
    } catch (error) {
        console.error("Error en create:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear la consulta/support',
            error: error.message 
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const supports = await supportModel.getAllSupport();
        res.json({ success: true, supports });
    } catch (error) {
        console.error("Error en getAll:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las consultas/support',
            error: error.message 
        });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const support = await supportModel.getSupportById(id);
        if (!support) {
            return res.status(404).json({ 
                success: false, 
                message: 'Consulta/Support no encontrada' 
            });
        }
        res.json({ success: true, support });
    } catch (error) {
        console.error("Error en getById:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener la consulta/support',
            error: error.message 
        });
    }
};

exports.reply = async (req, res) => {
    const { id } = req.params;
    const { respuesta } = req.body;

    try {
        await supportModel.replySupport(id, respuesta);
        res.json({ success: true, message: 'Consulta respondida' });
    } catch (error) {
        console.error("Error en reply:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al responder la consulta/support',
            error: error.message 
        });
    }
};