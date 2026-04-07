const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    supplier: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, required: true, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
