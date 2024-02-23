import { generateInvoice } from "../config/pdf-generator.js";
import { uploadFile, getObjectSignedUrl } from "../config/s3-config.js";
import Order from "../models/order.js";


// creates and order and returns the corresponding invoice
const createOrder = async (req, res) => {
    try {
        const products = req.body;  // array of products
        const order = await Order.create({
            userId: req.userId, 
            products
        });
        const orderDate = getDate(order.orderDate);
        const pdfBuffer = await generateInvoice(products, orderDate);   //generates PDF Buffer
        
        const pdfFileName = "invoice-" + order._id.toString() + ".pdf";
        await uploadFile(pdfBuffer, pdfFileName, "pdf");    // Upload the PDF Buffer to S3 bucket
        order.invoice = pdfFileName;
        order.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        return res.status(201).send(pdfBuffer);
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            message: 'Something went wrong while creating order!',
            err: error.message ? error.message : error
        });
    }
}

// get all invoices of a particular user
const getAllInvoices = async (req, res) => {
    try {
        // Retrieve all orders of a user from the database
        const { userId } = req;
        const orders = await Order.find({ userId });
        
        const urls = [];    // will contains all the invoices
        await Promise.all(orders.map(async (order) => {
            const url = await getObjectSignedUrl(order.invoice);
            urls.push(url);
        }));

        return res.status(200).json({
            success: true,
            message: "Successfully fetched all invoices",
            data: urls,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            message: 'Something went wrong while fetching the invoices!',
            err: error
        });
    }
}

function getDate(timestamp) {
    const year = timestamp.getFullYear();
    const month = timestamp.getMonth() + 1; // Months are zero-based, so we add 1
    const day = timestamp.getDate();
    // Creating a string representation of the date
    const orderDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return orderDate;
}

export {
    createOrder,
    getAllInvoices
}