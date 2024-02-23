import puppeteer from "puppeteer";

export const generateInvoice = async (products, orderDate) => {
    // Create a HTML string for the invoice
    const html = generateInvoiceHTML(products, orderDate);

    // Launch a headless browser using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content to the page
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    // Close the browser
    await browser.close();
    return pdfBuffer;
};

function generateInvoiceHTML(products, orderDate) {

    //calculate the total amout of products
    const sumReducer = (totalCost, product) => {
        const productCost = product.quantity * product.price;
        return totalCost + productCost;
    }
    const totalPrice = products.reduce(sumReducer, 0);
    const gstAmount = (totalPrice * 18) / 100;  //gst is 18%
    const grandTotal = totalPrice + gstAmount;

    // Customize this HTML template based on your needs
    return `
    <!DOCTYPE html>
    <html>
    
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <title>Invoice.pdf</title>
      <style>
        body {
          font-family: Arial;
          box-sizing: border-box;
          margin: 30px;
          padding: 0;
          
          background-color: #f2f2f2;
        }
    
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
    
        .left-part {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
    
        #title {
          margin-top: 0px;
          margin-bottom: 0px;
        }
    
        #sub-title {
          margin-top: 6px;
          color: #5e5e5e;
          font-weight: 300;
        }
    
        img {
          height: 50px;
        }
    
        .main {
          margin-top: 70px;
        }
    
        .table-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          width: 100%;
        }
    
        .h-left {
          font-weight: bold;
          width: 45%;
        }
    
        .h-right {
          display: flex;
          justify-content: space-between;
          width: 55%;
        }
    
        .th {
          font-weight: bold;
          width: 33%;
        }
    
        #border {
          border-bottom: 2px solid #bdbbbb;
          width: 100%;
        }
    
        .table-row {
          display: flex;
          justify-content: space-between;
          margin: 25px 0 25px 0;
          width: 100%;
        }
    
        .row-left {
          width: 45%;
        }
    
        .row-right {
          display: flex;
          justify-content: space-between;
          width: 55%;
        }
    
        .r-d {
          width: 33%;
        }
    
        .calculation {
          margin-top: 30px;
          width: 50%;
          margin-left: auto;
        }
    
        .total,
        .gst,
        .grand_total {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          width: 100%;
        }
    
        .grand_total {
          margin-top: 20px;
        }
    
        .total span:nth-child(1),
        .grand_total span:nth-child(1) {
          font-weight: bold;
        }
    
        .grand_total span:nth-child(2) {
          color: blue;
        }
        .info {
          margin-top: 200px;
        }
        .footer {
          margin-top: 200px;
          padding: 20px;
          padding-left: 60px;
          background-color: black;
          color: white;
          border-radius: 40px;
        }
        .sm-text {
          font-size: 10px;
        }
        .footer-strong-text {
          font-size: 12px;
        }
      </style>
    </head>
    
    <body>
     
      <div class="header">
        <div class="left-part">
          <h2 id="title">INVOICE GENERATOR</h2>
          <p id="sub-title">Sample output should be this</p>
        </div>
        <div class="right-part">
          <img src="https://rb.gy/g11bw6" />
        </div>
      </div>
    
      
      <div class="main">
        <div class="table-header">
          <div class="h-left">Product</div>
          <div class="h-right">
            <div class="th">Qty</div>
            <div class="th">Rate</div>
            <div class="th">Total</div>
          </div>
        </div>
        <div id="border"></div>
        ${generateProductList(products)}
        
    
        <div id="border"></div>
    
        <div class="calculation">
          <div class="total">
            <span>Total</span>
            <span>INR ${totalPrice}</span>
          </div>
          <div class="gst">
            <small>GST</small>
            <small>18%</small>
          </div>
          <div id="border"></div>
          <div class="grand_total">
            <span>Grand Total</span>
            <span>₹ ${grandTotal}</span>
          </div>
          <div id="border"></div>
        </div>
      </div>
    
    
      <div class="info">
        <p>
          <small>
            Order Date: <strong>${orderDate}</strong>
          </small>
        </p>
      </div>
    
      
      <div class="footer">
        <strong class="footer-strong-text">Terms and Condition:</strong>
        <br/>
        <small class="sm-text">we are happy to supply any furthur information you may need and trust that you call on us to fill your order.</small>
        <br/>
        <small class="sm-text">Which will receive our prompt and careful attention</small>
      </div>
    </body>
    
    </html>
    `;
}

// generate row for each product
function generateProductList(products) {
    return products.map((product) => `
        <div class="table-row">
            <div class="row-left">${product.name}</div>
            <div class="row-right">
                <div class="r-d">${product.quantity}</div>
                <div class="r-d">${product.price}</div>
                <div class="r-d">₹ ${product.quantity * product.price}</div>
            </div>
        </div>
    `).join('');
}