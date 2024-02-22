import { generateInvoice } from "../config/pdf-generator.js";
import Order from "../models/order.js";

const createOrder = async (req, res) => {
    try {
        const products = req.body;  // array of products
        const order = await Order.create({
            userId: req.userId, 
            products
        });
        const invoice_pdf = await generateInvoice(products);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        return res.status(201).send(invoice_pdf);
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            message: 'Something went wrong while creating order!',
            err: error.message ? error.message : error
        });
    }
}

export {
    createOrder,
}