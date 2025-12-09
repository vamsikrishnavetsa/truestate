const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  customerId: String,
  customerName: String,
  phoneNumber: String,
  gender: String,
  age: Number,
  customerRegion: String,
  customerType: String,

  productId: String,
  productName: String,
  brand: String,
  productCategory: String,
  tags: [String],

  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,

  date: { type: Date, index: true },
  paymentMethod: String,
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salespersonId: String,
  employeeName: String
}, { timestamps: true });

// Text index for full text search on customerName + phoneNumber
SaleSchema.index({ customerName: 'text', phoneNumber: 'text' });

// Index common filter fields for performance
SaleSchema.index({ customerRegion: 1 });
SaleSchema.index({ productCategory: 1 });
SaleSchema.index({ tags: 1 });

module.exports = mongoose.model('Sale', SaleSchema);
