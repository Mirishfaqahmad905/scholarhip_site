const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connectDb = require('./config/Db');
const userRoute = require('./routes/useRoue.js');

dotenv.config();
connectDb();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow multiple frontend origins
const allowedOrigins = [
  'https://scholarhip-site-client.vercel.app',
  'https://www.scholarshipopertunity.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// ✅ Serve static files from 'uploads' folder
app.use('/uploads', express.static('uploads'));

// ✅ Main API route
app.use('/api', userRoute);

// ✅ Default root route
app.get('/', (req, res) => {
  res.send('✅ Backend is live Now');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
