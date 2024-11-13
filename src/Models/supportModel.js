const { collection, addDoc, getDocs, doc, getDoc, updateDoc } = require("firebase/firestore");
const db = require("../../config");

exports.createSupport = async (supportData) => {
    try {
        const docRef = await addDoc(collection(db, "support"), {
            userId: supportData.userId,
            consulta: supportData.consulta,
            email: supportData.email,
            fecha: new Date()
        });

        return { id: docRef.id, ...supportData, fecha: new Date() };
    } catch (error) {
        console.error("Error al crear soporte:", error);
        throw new Error(`Error al crear el soporte: ${error.message}`);
    }
};

exports.getAllSupport = async () => {
    try {
        const supportsRef = collection(db, "support");
        const snapshot = await getDocs(supportsRef);
        
        const supports = [];
        for (const doc of snapshot.docs) {
            const supportData = doc.data();
            supports.push({ 
                id: doc.id, 
                ...supportData, 
                fecha: supportData.fecha ? supportData.fecha.toDate() : null, 
                fechaRespuesta: supportData.fechaRespuesta ? supportData.fechaRespuesta.toDate() : null 
            });
        }
        
        return supports;
    } catch (error) {
        console.error("Error en getAllSupport:", error);
        throw new Error(`Error al obtener los soportes: ${error.message}`);
    }
};

exports.getSupportById = async (id) => {
    try {
        const docRef = doc(db, "support", id);
        const supportDoc = await getDoc(docRef);

        if (!supportDoc.exists()) {
            return null;
        }

        const supportData = supportDoc.data();
        return { 
            id: supportDoc.id, 
            ...supportData, 
            fecha: supportData.fecha ? supportData.fecha.toDate() : null, 
            fechaRespuesta: supportData.fechaRespuesta ? supportData.fechaRespuesta.toDate() : null 
        };
    } catch (error) {
        console.error("Error en getSupportById:", error);
        throw new Error(`Error al obtener el soporte: ${error.message}`);
    }
};

exports.replySupport = async (id, respuesta) => {
    try {
        const docRef = doc(db, "support", id);
        await updateDoc(docRef, {
            respuesta: respuesta,
            fechaRespuesta: new Date()
        });
    } catch (error) {
        console.error("Error en replySupport:", error);
        throw new Error(`Error al responder el soporte: ${error.message}`);
    }
};