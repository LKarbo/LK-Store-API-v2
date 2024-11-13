const { collection, addDoc, getDocs, doc, getDoc, updateDoc  } = require("firebase/firestore");
const db = require("../../config");

exports.register = async (name, email, password) => {
    try {
        const docRef = await addDoc(collection(db, "USER"), {
            name,
            email,
            password,
            phoneNumber: "",
            address: "",
            isAdmin: false
        });
        return { id: docRef.id, email, name, phoneNumber: "", address: "", isAdmin: false };
    } catch (error) {
        console.error("Error en registro:", error);
        throw new Error(`Error al registrar el usuario: ${error.message}`);
    }
}

exports.getAllUsers = async () => {
    try {
        console.log("Intentando obtener usuarios de la colección USER");
        const usersRef = collection(db, "USER");
        console.log("Referencia a la colección obtenida");
        
        const snapshot = await getDocs(usersRef);
        console.log("Snapshot obtenido:", snapshot.size, "documentos encontrados");
        
        const users = [];
        snapshot.forEach((doc) => {
            const userData = doc.data();
            console.log("Datos del documento:", doc.id, userData);
            users.push({
                id: doc.id,
                name: userData.name,
                email: userData.email,
                address: userData.address,
                phoneNumber: userData.phoneNumber,
                isAdmin: userData.isAdmin
            });
        });
        
        console.log("Total de usuarios procesados:", users.length);
        return users;
    } catch (error) {
        console.error("Error completo en getAllUsers:", error);
        throw new Error(`Error al obtener los usuarios: ${error.stack || error.message}`);
    }
}

exports.getUserById = async (ID) => {
    try {
        const docRef = doc(db, "USER", ID);
        const userDoc = await getDoc(docRef);
        if (!userDoc.exists()) {
            return null;
        }
        return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
        console.error("Error en getUserById:", error);
        throw new Error(`Error al obtener el usuario: ${error.message}`);
    }
}

exports.updateUser = async (id, userData) => {
    try {
        const userRef = doc(db, "USER", id);
        
        await updateDoc(userRef, {
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber || "",
            address: userData.address || ""
        });

        const updatedDoc = await getDoc(userRef);
        return { id: updatedDoc.id, ...updatedDoc.data() };
        
    } catch (error) {
        console.error("Error en updateUser:", error);
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
};