const userModel = require('../Models/userModel');

exports.register = async (id, name, email, password) => {
    try {
        const userCollection = collection(db, "USER");
        
        const docRef = doc(userCollection, id);
        
        await setDoc(docRef, {
            name,
            email,
            password,
            phoneNumber: "",
            address: "",
            isAdmin: false
        });
        
        return { id, email, name, phoneNumber: "", address: "", isAdmin: false };
    } catch (error) {
        console.error("Error en registro:", error);
        throw new Error(`Error al registrar el usuario: ${error.message}`);
    }
}

exports.getAll = async (req, res) => {
    try {
        console.log("Iniciando getAll");
        const users = await userModel.getAllUsers();
        console.log("Usuarios obtenidos:", users);
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error completo en getAll:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener los usuarios',
            error: error.message 
        });
    }
};

exports.getData = async (req, res) => {
    const { ID } = req.params;
    try {
        const user = await userModel.getUserById(ID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error("Error completo en getData:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener el usuario',
            error: error.message 
        });
    }
};

exports.edit = async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, address } = req.body;

    if (!name || !email) {
        return res.status(400).json({ 
            success: false, 
            message: 'El nombre y email son campos requeridos' 
        });
    }

    try {
        const existingUser = await userModel.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }

        const updatedUser = await userModel.updateUser(id, {
            name,
            email,
            phoneNumber,
            address
        });

        res.json({ 
            success: true, 
            message: 'Usuario actualizado correctamente',
            user: updatedUser 
        });

    } catch (error) {
        console.error("Error completo en edit:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar el usuario',
            error: error.message 
        });
    }
};