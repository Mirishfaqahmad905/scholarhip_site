






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
// const allowedOrigins = [
//   'https://scholarhip-site-client.vercel.app',
//   'https://www.scholarshipopertunity.com',
//   // 'http://localhost:5173'
// ];


app.use(cors({
  origin: 'https://www.scholarshipopertunity.com', // ✅ updated domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// const allowedOrigins = [
//   // 'https://scholarhip-site-client.vercel.app',
//   'https://www.scholarshipopertunity.com'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', userRoute);

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is live Now');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
