import Order from "../models/order.js";

const createOrder = async (req, res) => {
    try {
        const products = req.body;  // array of products
        const order = await Order.create({
            userId: req.userId, 
            products
        });
        return res.status(201).json({
            success: true,
            message: "Successfuly created your order",
            data: order,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            message: 'Something went wrong while creating order!',
            err
        });
    }
}

export {
    createOrder,
}