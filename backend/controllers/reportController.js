const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find({});
    
    let totalStockValue = 0;
    let lowStockItemsCount = 0;
    
    products.forEach(p => {
      totalStockValue += (p.price * p.stock);
      if (p.stock < p.minStock) lowStockItemsCount++;
    });

    const recentTransactions = await Transaction.find({})
      .populate('product', 'name')
      .sort({ date: -1 })
      .limit(5);

    // Group transactions for chart data (last 7 days logic simplified)
    const tx = await Transaction.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    const chartData = tx.map(t => ({ date: t._id, transactions: t.count }));

    res.json({
      totalProducts,
      totalStockValue,
      lowStockItemsCount,
      recentTransactions,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
