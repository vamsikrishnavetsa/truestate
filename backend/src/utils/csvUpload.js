const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Sale = require('../models/Sale');

const upload = multer({ dest: 'uploads/' });
const csvUploadRouter = express.Router();

/**
 * POST /api/sales/upload-csv
 * form-data: file
 */
csvUploadRouter.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const path = req.file.path;
  const stream = fs.createReadStream(path).pipe(csv());

  const BULK_SIZE = 5000;
  let buffer = [];
  let inserted = 0;
  try {
    for await (const row of stream) {
      // transform row fields to types like numbers, arrays, date
      // Map CSV column names to model fields — adjust as necessary
      const doc = {
        customerId: row['Customer ID'] || row.customerId,
        customerName: row['Customer Name'] || row.customerName,
        phoneNumber: row['Phone Number'] || row.phoneNumber,
        gender: row['Gender'],
        age: row['Age'] ? Number(row['Age']) : undefined,
        customerRegion: row['Customer Region'],
        customerType: row['Customer Type'],

        productId: row['Product ID'],
        productName: row['Product Name'],
        brand: row['Brand'],
        productCategory: row['Product Category'],
        tags: row['Tags'] ? row['Tags'].split('|').map(t => t.trim()) : [],

        quantity: row['Quantity'] ? Number(row['Quantity']) : 0,
        pricePerUnit: row['Price per Unit'] ? Number(row['Price per Unit']) : 0,
        discountPercentage: row['Discount Percentage'] ? Number(row['Discount Percentage']) : 0,
        totalAmount: row['Total Amount'] ? Number(row['Total Amount']) : 0,
        finalAmount: row['Final Amount'] ? Number(row['Final Amount']) : 0,

        date: row['Date'] ? new Date(row['Date']) : undefined,
        paymentMethod: row['Payment Method'],
        orderStatus: row['Order Status'],
        deliveryType: row['Delivery Type'],
        storeId: row['Store ID'],
        storeLocation: row['Store Location'],
        salespersonId: row['Salesperson ID'],
        employeeName: row['Employee Name']
      };

      buffer.push(doc);

      if (buffer.length >= BULK_SIZE) {
        await Sale.insertMany(buffer, { ordered: false });
        inserted += buffer.length;
        buffer = [];
      }
    }

    if (buffer.length) {
      await Sale.insertMany(buffer, { ordered: false });
      inserted += buffer.length;
    }

    // cleanup
    fs.unlinkSync(path);
    res.json({ inserted });
  } catch (err) {
    console.error('CSV upload error', err);
    fs.unlinkSync(path);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { csvUploadRouter };
