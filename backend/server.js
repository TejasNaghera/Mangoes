const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Local imports
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Admin routes
const adminAuthRoutes = require('./routes/Admin/authroutesadmin');
const adminRoutes = require('./routes/Admin/allgetodera');
//revawy
const  revawy = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes); // Place order
// app.use('/api/admin', adminOrderRoutes); // Admin order routes
app.use('/api', paymentRoutes);

// Admin Auth
app.use('/admenapi', adminAuthRoutes);

app.use('/api/admin', adminRoutes); 
// Error handling middleware (should come after all routes)

//is reviewe
app.use('/api/reviews',revawy);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect DB & Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
 app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://192.168.1.163:${PORT}`);
});
});
