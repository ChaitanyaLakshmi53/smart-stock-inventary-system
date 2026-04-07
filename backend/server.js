const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

const startServer = async () => {
  try {
    // 1. Start In-Memory MongoDB Server automatically
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // 2. Connect Mongoose to the memory server
    await mongoose.connect(uri);
    console.log(`Connected to Local Memory Server: ${uri}`);

    // 3. Automatically Seed the Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'Admin'
    });
    console.log('Seeded initial admin user: admin@gmail.com / admin123');

    // 4. Start the Express API
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Smart Inventory Backend running on port ${PORT}`));

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
