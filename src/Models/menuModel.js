const { collection, addDoc, getDocs, doc, getDoc } = require("firebase/firestore");
const db = require("../../config");
const { getHamburgerById } = require("./hamburgerModel");
const { getFriesById } = require("./friesModel");
const { getDrinkById } = require("./drinkModel");
const { getDiscountById } = require("./discountModel");

exports.createMenu = async (menuData) => {
    try {
        const hamburger = await getHamburgerById(menuData.hamburger);
        const fries = await getFriesById(menuData.fries);
        const drink = await getDrinkById(menuData.drink);

        const totalPrice = hamburger.finalPrice + fries.finalPrice + drink.finalPrice;
        let discountedPrice = totalPrice;

        if (menuData.isDiscounted && menuData.discount) {
            const discount = await getDiscountById(menuData.discount);
            if (discount && discount.isActive) {
                discountedPrice = totalPrice * (1 - (discount.porcent / 100));
            }
        }

        const docRef = await addDoc(collection(db, "menu"), {
            hamburger: hamburger.id,
            fries: fries.id,
            drink: drink.id,
            isDiscounted: menuData.isDiscounted,
            discount: menuData.discount,
            price: discountedPrice
        });

        return { id: docRef.id, ...menuData, totalPrice, discountedPrice };
    } catch (error) {
        console.error("Error al crear menú:", error);
        throw new Error(`Error al crear el menú: ${error.message}`);
    }
}

exports.getAllMenus = async () => {
    try {
        console.log("Intentando obtener menús de la colección");
        const menusRef = collection(db, "menu");
        
        const snapshot = await getDocs(menusRef);
        console.log("Snapshot obtenido:", snapshot.size, "documentos encontrados");
        
        const menus = [];
        for (const doc of snapshot.docs) {
            const menuData = doc.data();
            const hamburger = await getHamburgerById(menuData.hamburger);
            const fries = await getFriesById(menuData.fries);
            const drink = await getDrinkById(menuData.drink);

            let discountedPrice = hamburger.price + fries.price + drink.price;
            if (menuData.isDiscounted && menuData.discount) {
                const discount = await getDiscountById(menuData.discount);
                if (discount && discount.isActive) {
                    discountedPrice = discountedPrice * (1 - (discount.porcent / 100));
                }
            }

            menus.push({
                id: doc.id,
                hamburger: hamburger,
                fries: fries,
                drink: drink,
                isDiscounted: menuData.isDiscounted,
                discount: menuData.discount,
                totalPrice: hamburger.price + fries.price + drink.price,
                discountedPrice: discountedPrice
            });
        }
        
        return menus;
    } catch (error) {
        console.error("Error en getAllMenus:", error);
        throw new Error(`Error al obtener los menús: ${error.message}`);
    }
}

exports.getMenuById = async (id) => {
    try {
        const docRef = doc(db, "menu", id);
        const menuDoc = await getDoc(docRef);
        
        if (!menuDoc.exists()) {
            return null;
        }
        
        const menuData = menuDoc.data();
        const hamburger = await getHamburgerById(menuData.hamburger);
        const fries = await getFriesById(menuData.fries);
        const drink = await getDrinkById(menuData.drink);

        let discountedPrice = hamburger.price + fries.price + drink.price;
        if (menuData.isDiscounted && menuData.discount) {
            const discount = await getDiscountById(menuData.discount);
            if (discount && discount.isActive) {
                discountedPrice = discountedPrice * (1 - (discount.porcent / 100));
            }
        }

        return {
            id: menuDoc.id,
            hamburger: hamburger,
            fries: fries,
            drink: drink,
            isDiscounted: menuData.isDiscounted,
            discount: menuData.discount,
            totalPrice: hamburger.price + fries.price + drink.price,
            discountedPrice: discountedPrice
        };
    } catch (error) {
        console.error("Error en getMenuById:", error);
        throw new Error(`Error al obtener el menú: ${error.message}`);
    }
}