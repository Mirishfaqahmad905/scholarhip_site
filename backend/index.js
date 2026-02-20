const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/appConfig');
const connectDb = require('./config/Db');
const userRoute = require('./routes/useRoue.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const allowedOrigins = new Set(config.corsOrigins);

const corsOptions = {
  origin(origin, callback) {
    const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin || '');
    if (!origin || allowedOrigins.has(origin) || isVercelPreview) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', userRoute);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'OK' });
});

app.get('/', (req, res) => {
  res.send('Backend is live now');
});

app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  try {
    await connectDb();
    if (!config.isVercel) {
      const server = app.listen(config.port, () => {
        console.log(`Server running on http://localhost:${config.port}`);
      });
      server.on('error', (error) => {
        console.error(`Server startup error on port ${config.port}:`, error.message);
        process.exit(1);
      });
    }
  } catch (error) {
    console.error('Failed to bootstrap server:', error.message);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

bootstrap();

module.exports = app;
