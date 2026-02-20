const dotenv = require('dotenv');

dotenv.config();

const toArray = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const requireInProduction = (key) => {
  if (process.env.NODE_ENV === 'production' && !process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
};

requireInProduction('MONGO_URI');

const defaultCorsOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://scholarhip-site-client.vercel.app',
  'https://www.scholarshipopertunity.com',
  'https://scholarshipopertunity.com',
];

const appConfig = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 9000,
  isVercel: process.env.VERCEL === '1',
  mongoUri: process.env.MONGO_URI || '',
  frontendUrl: process.env.FRONTEND_URL || 'https://www.scholarshipopertunity.com',
  backendPublicUrl: process.env.BACKEND_PUBLIC_URL || '',
  corsOrigins: [...new Set([...defaultCorsOrigins, ...toArray(process.env.CORS_ORIGINS)])],
  mail: {
    user: process.env.GMAIL || '',
    pass: process.env.APP_PASSWORD || '',
  },
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
});

module.exports = appConfig;
