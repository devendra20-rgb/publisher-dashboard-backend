const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { handleError } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const publisherRoutes = require('./routes/publisher.routes');
const offerRoutes = require('./routes/offer.routes');
const exportRoutes = require('./routes/export.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const { loadEnv } = require('./config/env');

loadEnv();

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'https://publisher-dashboard-frontend.onrender.com/')
  .split(',')
  .map((origin) => origin.trim());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/publishers', publisherRoutes);
app.use('/offers', offerRoutes);
app.use('/export', exportRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Publisher Dashboard API is running' });
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found', errors: [] }));
app.use(handleError);

module.exports = app;
