const { collection, addDoc, getDocs, doc, getDoc } = require("firebase/firestore");
const db = require("../../config");
const { getHamburgerById } = require("./hamburgerModel");
const { getFriesById } = require("./friesModel");
const { getDrinkById } = require("./drinkModel");
const { getMenuById } = require("./menuModel");

exports.createOrder = async (orderData) => {
    try {
        const newOrder = await addDoc(collection(db, "order"), {
            user: orderData.user,
            orderData: orderData.orderData,
            price: orderData.price,
            dateTime: orderData.dateTime
        });

        return { id: newOrder.id, ...orderData };
    } catch (error) {
        console.error("Error al crear la orden:", error);
        throw new Error(`Error al crear la orden: ${error.message}`);
    }
};

exports.getAllorder = async () => {
    try {
        const orderSnapshot = await getDocs(collection(db, "order"));
        const orders = [];

        for (const doc of orderSnapshot.docs) {
            const orderData = doc.data();
            const orderItems = await Promise.all(orderData.orderData.map(async (item) => {
                switch (item.foodType) {
                    case "hamburger":
                        return await getHamburgerById(item.foodID);
                    case "fries":
                        return await getFriesById(item.foodID);
                    case "drink":
                        return await getDrinkById(item.foodID);
                    case "menu":
                        return await getMenuById(item.foodID);
                    default:
                        return {
                            foodType: item.foodType,
                            foodID: item.foodID,
                            foodAmount: item.foodAmount
                        };
                }
            }));

            console.log(orderData.user);

            orders.push({
                id: doc.id,
                user: orderData.user,
                orderData: orderItems,
                price: orderData.price,
                dateTime: orderData.dateTime.toDate()
            });
        }

        return orders;
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        throw new Error(`Error al obtener las órdenes: ${error.message}`);
    }
};

exports.getOrderById = async (id) => {
    try {
        const orderDoc = await getDoc(doc(db, "order", id));

        if (!orderDoc.exists()) {
            return null;
        }

        const orderData = orderDoc.data();
        const orderItems = await Promise.all(orderData.orderData.map(async (item) => {
            switch (item.foodType) {
                case "hamburger":
                    return await getHamburgerById(item.foodID);
                case "fries":
                    return await getFriesById(item.foodID);
                case "drink":
                    return await getDrinkById(item.foodID);
                case "menu":
                    return await getMenuById(item.foodID);
                default:
                    return {
                        foodType: item.foodType,
                        foodID: item.foodID,
                        foodAmount: item.foodAmount
                    };
            }
        }));

        return {
            id: orderDoc.id,
            user: orderData.user,
            orderData: orderItems,
            price: orderData.price,
            dateTime: orderData.dateTime.toDate()
        };
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        throw new Error(`Error al obtener la orden: ${error.message}`);
    }
};