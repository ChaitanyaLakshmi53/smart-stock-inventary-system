const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  // Mock inject user into request
  req.user = { _id: 'admin123', name: 'Super Admin', email: 'admin@gmail.com', role: 'Admin' };
  next();
});

let db = {
  products: [
    { _id: 'p1', sku: 'SKU001', name: 'Premium Laptop', category: 'Electronics', supplier: 'TechCorp', price: 999.99, stock: 50, minStock: 5 },
    { _id: 'p2', sku: 'SKU002', name: 'Wireless Mouse', category: 'Accessories', supplier: 'TechCorp', price: 29.99, stock: 120, minStock: 20 },
    { _id: 'p3', sku: 'SKU003', name: 'Desk Chair', category: 'Furniture', supplier: 'OfficeSupplies', price: 149.50, stock: 4, minStock: 10 },
  ],
  transactions: [],
  users: [
    { _id: 'admin123', name: 'Super Admin', email: 'admin@gmail.com', role: 'Admin' }
  ]
};

// ============= MOCK AUTH =============
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@gmail.com' && password === 'admin123') {
    res.json({ token: 'mock-jwt-token', ...db.users[0] });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
app.post('/api/auth/register', (req, res) => res.json({ message: 'Disabled in mock mode' }));

// ============= MOCK PRODUCTS =============
app.get('/api/products', (req, res) => res.json(db.products));
app.post('/api/products', (req, res) => {
  const newProduct = { _id: Date.now().toString(), ...req.body };
  db.products.push(newProduct);
  res.status(201).json(newProduct);
});
app.put('/api/products/:id', (req, res) => {
  const idx = db.products.findIndex(p => p._id === req.params.id);
  if (idx > -1) {
    db.products[idx] = { ...db.products[idx], ...req.body };
    res.json(db.products[idx]);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});
app.delete('/api/products/:id', (req, res) => {
  db.products = db.products.filter(p => p._id !== req.params.id);
  res.json({ message: 'Removed' });
});

// ============= MOCK INVENTORY =============
app.post('/api/inventory/update', (req, res) => {
  const { productId, quantity, type } = req.body;
  const p = db.products.find(x => x._id === productId);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  
  if (type === 'stock-in') p.stock += Number(quantity);
  else {
    if (p.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    p.stock -= Number(quantity);
  }

  const tx = {
    _id: Date.now().toString(),
    product: p, // Send full product object for the populated transaction requirement
    type,
    quantity: Number(quantity),
    user: db.users[0],
    date: new Date().toISOString()
  };
  db.transactions.unshift(tx);
  res.json({ message: 'Success', product: p, transaction: tx });
});

// ============= MOCK TRANSACTIONS =============
app.get('/api/transactions', (req, res) => res.json(db.transactions));

// ============= MOCK REPORTS =============
app.get('/api/reports/dashboard', (req, res) => {
  const totalProducts = db.products.length;
  const totalStockValue = db.products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockItemsCount = db.products.filter(p => p.stock < p.minStock).length;
  
  // Dummy chart data
  const chartData = [
    { date: 'Mon', transactions: 5 }, { date: 'Tue', transactions: 8 },
    { date: 'Wed', transactions: 12 },{ date: 'Thu', transactions: 4 },
    { date: 'Fri', transactions: 15 },{ date: 'Sat', transactions: 1 },
    { date: 'Sun', transactions: 0 }
  ];

  res.json({
    totalProducts, totalStockValue, lowStockItemsCount,
    recentTransactions: db.transactions.slice(0, 5),
    chartData
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`MOCK Backend Server running on port ${PORT}`));
