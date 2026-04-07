const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

const updateInventory = async (req, res) => {
  const { productId, quantity, type } = req.body; // type: 'stock-in' | 'stock-out'
  
  if (!productId || quantity === undefined || !type) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let newStock = product.stock;
    if (type === 'stock-in') {
      newStock += Number(quantity);
    } else if (type === 'stock-out') {
      if (newStock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
      newStock -= Number(quantity);
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    product.stock = newStock;
    await product.save();

    const transaction = new Transaction({
      product: productId,
      quantity: Number(quantity),
      type,
      user: req.user._id
    });
    await transaction.save();

    res.json({ message: 'Inventory updated successfully', product, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateInventory };
