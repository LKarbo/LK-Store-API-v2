const { collection, addDoc, getDocs, doc, getDoc } = require("firebase/firestore");
const db = require("../../config");

exports.createDrink = async (drinkData) => {
    try {
        const docRef = await addDoc(collection(db, "drink"), {
            name: drinkData.name,
            price: drinkData.price,
            img_url: drinkData.img_url || ""
        });
        return { id: docRef.id, ...drinkData };
    } catch (error) {
        console.error("Error al crear bebida:", error);
        throw new Error(`Error al crear la bebida: ${error.message}`);
    }
}

exports.getAllDrinks = async () => {
    try {
        console.log("Intentando obtener bebidas de la colección");
        const drinksRef = collection(db, "drink");
        
        const snapshot = await getDocs(drinksRef);
        console.log("Snapshot obtenido:", snapshot.size, "documentos encontrados");
        
        const drinks = [];
        snapshot.forEach((doc) => {
            const drinkData = doc.data();
            drinks.push({
                id: doc.id,
                name: drinkData.name,
                price: drinkData.price,
                img_url: drinkData.img_url
            });
        });
        
        return drinks;
    } catch (error) {
        console.error("Error en getAllDrinks:", error);
        throw new Error(`Error al obtener las bebidas: ${error.message}`);
    }
}

exports.getDrinkById = async (id) => {
    try {
        const docRef = doc(db, "drink", id);
        const drinkDoc = await getDoc(docRef);
        
        if (!drinkDoc.exists()) {
            return null;
        }
        
        return { id: drinkDoc.id, ...drinkDoc.data() };
    } catch (error) {
        console.error("Error en getDrinkById:", error);
        throw new Error(`Error al obtener la bebida: ${error.message}`);
    }
}
