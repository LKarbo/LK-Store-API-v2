const { collection, addDoc, getDocs, doc, getDoc } = require("firebase/firestore");
const db = require("../../config");

exports.createDiscount = async (discountData) => {
    try {
        const docRef = await addDoc(collection(db, "discount"), {
            code: discountData.code,
            isActive: discountData.isActive || true,
            porcent: discountData.porcent
        });
        return { id: docRef.id, ...discountData };
    } catch (error) {
        console.error("Error al crear descuento:", error);
        throw new Error(`Error al crear el descuento: ${error.message}`);
    }
}

exports.getAllDiscounts = async () => {
    try {
        console.log("Intentando obtener descuentos de la colección");
        const discountsRef = collection(db, "discount");
        
        const snapshot = await getDocs(discountsRef);
        console.log("Snapshot obtenido:", snapshot.size, "documentos encontrados");
        
        const discounts = [];
        snapshot.forEach((doc) => {
            const discountData = doc.data();
            discounts.push({
                id: doc.id,
                code: discountData.code,
                isActive: discountData.isActive,
                porcent: discountData.porcent
            });
        });
        
        return discounts;
    } catch (error) {
        console.error("Error en getAllDiscounts:", error);
        throw new Error(`Error al obtener los descuentos: ${error.message}`);
    }
}

exports.getDiscountById = async (id) => {
    try {
        const docRef = doc(db, "discount", id);
        const discountDoc = await getDoc(docRef);
        
        if (!discountDoc.exists()) {
            return null;
        }
        
        return { id: discountDoc.id, ...discountDoc.data() };
    } catch (error) {
        console.error("Error en getDiscountById:", error);
        throw new Error(`Error al obtener el descuento: ${error.message}`);
    }
}