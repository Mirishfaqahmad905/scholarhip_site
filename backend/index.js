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

<<<<<<< HEAD
// app.use(cors({
//   origin: 'https://www.scholarshipopertunity.com', // ✅ updated domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

const allowedOrigins = [
  'https://scholarhip-site-client.vercel.app',
  'https://www.scholarshipopertunity.com'
];

=======
>>>>>>> 27c39c83aad9bb2dcf77d381d83f80753066735c
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
<<<<<<< HEAD
      callback(new Error('Not allowed by CORS'));
=======
      callback(new Error('❌ Not allowed by CORS'));
>>>>>>> 27c39c83aad9bb2dcf77d381d83f80753066735c
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
<<<<<<< HEAD
=======

>>>>>>> 27c39c83aad9bb2dcf77d381d83f80753066735c
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
