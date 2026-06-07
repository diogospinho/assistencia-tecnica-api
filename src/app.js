require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const serviceOrderRoutes = require('./routes/serviceOrders');
const partRoutes = require('./routes/parts');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/service-orders', serviceOrderRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

module.exports = app;
