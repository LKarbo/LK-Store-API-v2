const { collection, addDoc, getDocs, doc, getDoc } = require("firebase/firestore");
const db = require("../../config");
const { getDiscountById } = require("./discountModel");

exports.createFries = async (friesData) => {
    try {
        const docRef = await addDoc(collection(db, "fries"), {
            name: friesData.name,
            price: friesData.price,
            img_url: friesData.img_url || "",
            isDiscounted: friesData.isDiscounted || false,
            discountId: friesData.discountId || null
        });
        return { id: docRef.id, ...friesData };
    } catch (error) {
        console.error("Error al crear papas:", error);
        throw new Error(`Error al crear las papas: ${error.message}`);
    }
}

exports.getAllFries = async () => {
    try {
        const friesRef = collection(db, "fries");
        const snapshot = await getDocs(friesRef);
        
        const friesList = [];
        for (const doc of snapshot.docs) {
            const friesData = doc.data();
            let finalPrice = Number(friesData.price);

            if (friesData.isDiscounted && friesData.discountId) {
                const discount = await getDiscountById(friesData.discountId);
                if (discount && discount.isActive) {
                    finalPrice = finalPrice * (1 - discount.porcent / 100);
                }
            }

            friesList.push({
                id: doc.id,
                name: friesData.name,
                originalPrice: friesData.price,
                finalPrice: Math.round(finalPrice * 100) / 100,
                img_url: friesData.img_url,
                isDiscounted: friesData.isDiscounted,
                discountId: friesData.discountId
            });
        }
        
        return friesList;
    } catch (error) {
        console.error("Error en getAllFries:", error);
        throw new Error(`Error al obtener las papas: ${error.message}`);
    }
}

exports.getFriesById = async (id) => {
    try {
        const docRef = doc(db, "fries", id);
        const friesDoc = await getDoc(docRef);
        
        if (!friesDoc.exists()) {
            return null;
        }

        const friesData = friesDoc.data();
        let finalPrice = friesData.price;

        if (friesData.isDiscounted && friesData.discountId) {
            const discount = await getDiscountById(friesData.discountId);
            if (discount && discount.isActive) {
                finalPrice = finalPrice * (1 - discount.porcent / 100);
            }
        }

        return {
            id: friesDoc.id,
            ...friesData,
            originalPrice: friesData.price,
            finalPrice: Math.round(finalPrice * 100) / 100
        };
    } catch (error) {
        console.error("Error en getFriesById:", error);
        throw new Error(`Error al obtener las papas: ${error.message}`);
    }
}