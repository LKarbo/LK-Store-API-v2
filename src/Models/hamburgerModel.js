const { collection, addDoc, getDocs, doc, getDoc } = require("firebase/firestore");
const db = require("../../config");
const { getDiscountById } = require("./discountModel");

exports.createHamburger = async (hamburgerData) => {
    try {
        const docRef = await addDoc(collection(db, "hamburger"), {
            name: hamburgerData.name,
            price: hamburgerData.price,
            img_url: hamburgerData.img_url || "",
            isDiscounted: hamburgerData.isDiscounted || false,
            discountId: hamburgerData.discountId || null
        });
        return { id: docRef.id, ...hamburgerData };
    } catch (error) {
        console.error("Error al crear hamburguesa:", error);
        throw new Error(`Error al crear la hamburguesa: ${error.message}`);
    }
}

exports.getAllHamburgers = async () => {
    try {
        const hamburgersRef = collection(db, "hamburger");
        const snapshot = await getDocs(hamburgersRef);
        
        const hamburgers = [];
        for (const doc of snapshot.docs) {
            const hamburgerData = doc.data();
            let finalPrice = hamburgerData.price;

            // Mejorado el manejo de descuentos
            if (hamburgerData.isDiscounted && hamburgerData.discountId) {
                try {
                    const discount = await getDiscountById(hamburgerData.discountId);
                    console.log(`Descuento encontrado para ${hamburgerData.name}:`, discount);
                    
                    if (discount && discount.isActive && discount.porcent) {
                        finalPrice = finalPrice * (1 - (discount.porcent / 100));
                        console.log(`Precio original: ${hamburgerData.price}, Descuento: ${discount.porcent}%, Precio final: ${finalPrice}`);
                    } else {
                        console.log(`Descuento no aplicable para ${hamburgerData.name}:`, 
                            !discount ? 'No existe' : 
                            !discount.isActive ? 'No está activo' : 
                            'No tiene porcentaje definido');
                    }
                } catch (discountError) {
                    console.error(`Error al obtener descuento para ${hamburgerData.name}:`, discountError);
                    // Si hay error al obtener el descuento, mantenemos el precio original
                }
            }

            hamburgers.push({
                id: doc.id,
                name: hamburgerData.name,
                originalPrice: hamburgerData.price,
                finalPrice: Number(finalPrice.toFixed(2)),
                img_url: hamburgerData.img_url || "",
                isDiscounted: hamburgerData.isDiscounted,
                discountId: hamburgerData.discountId,
                discountApplied: finalPrice !== hamburgerData.price // Nuevo campo para verificar si se aplicó el descuento
            });
        }
        
        return hamburgers;
    } catch (error) {
        console.error("Error en getAllHamburgers:", error);
        throw new Error(`Error al obtener las hamburguesas: ${error.message}`);
    }
}

exports.getHamburgerById = async (id) => {
    try {
        
        const docRef = doc(db, "hamburger", id);
        const hamburgerDoc = await getDoc(docRef);
        
        if (!hamburgerDoc.exists()) {
            return null;
        }

        const hamburgerData = hamburgerDoc.data();
        let finalPrice = hamburgerData.price;
        let discountApplied = false;

        // Mejorado el manejo de descuentos
        if (hamburgerData.isDiscounted && hamburgerData.discountId) {
            try {
                const discount = await getDiscountById(hamburgerData.discountId);
                console.log(`Descuento encontrado:`, discount);
                
                if (discount && discount.isActive && discount.porcent) {
                    finalPrice = finalPrice * (1 - (discount.porcent / 100));
                    discountApplied = true;
                    console.log(`Precio original: ${hamburgerData.price}, Descuento: ${discount.porcent}%, Precio final: ${finalPrice}`);
                } else {
                    console.log('Descuento no aplicable:', 
                        !discount ? 'No existe' : 
                        !discount.isActive ? 'No está activo' : 
                        'No tiene porcentaje definido');
                }
            } catch (discountError) {
                console.error("Error al obtener descuento:", discountError);
                // Si hay error al obtener el descuento, mantenemos el precio original
            }
        }

        return {
            id: hamburgerDoc.id,
            ...hamburgerData,
            originalPrice: hamburgerData.price,
            finalPrice: Number(finalPrice.toFixed(2)),
            discountApplied // Nuevo campo para verificar si se aplicó el descuento
        };
    } catch (error) {
        console.error("Error en getHamburgerById:", error);
        throw new Error(`Error al obtener la hamburguesa: ${error.message}`);
    }
}