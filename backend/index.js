// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDb = require('./config/Db');
// const body_parser=require('body-parser');
// const userRoute = require('./routes/useRoue.js'); // Make sure the filename matches
// const PORT = process.env.PORT || 3000;
// dotenv.config();
// console.log(`${process.env.GMAIL}`);  ;
// console.log(`${process.env.APP_PASSWORD}`); ;
// const app = express();
// // Connect to the database
// connectDb();
// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(body_parser.json());
// // Routes
// app.use('/uploads', express.static('uploads'));

// app.use('/api', userRoute); // Use '/api' or another prefix for clarity
// userRoute.get('/',(req,res)=>{
//    res.send("message get")
// })
// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const morgan = require('morgan'); // optional for logging
// const bodyParser = require('body-parser');
// const connectDb = require('./config/Db');
// const userRoute = require('./routes/useRoue.js'); // Make sure this path is correct

// // Initialize dotenv
// dotenv.config();

// // Connect MongoDB
// connectDb();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(morgan('dev')); // optional logging

// // Serve uploaded images statically
// app.use('/uploads', express.static('uploads'));

// // API Routes
// app.use('/api', userRoute);

// app.use(cors({
//   origin: 'https://scholarhip-site-client.vercel.app', // Your frontend on Vercel
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true // only if you're using cookies
// }));
// // Root route (optional)
// app.get('/', (req, res) => {
//   res.send('✅ API server is running...');
// });

// // Email env check (optional for debug)
// console.log('GMAIL:', process.env.GMAIL);
// console.log('APP_PASSWORD:', process.env.APP_PASSWORD);

// // Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });









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

// ✅ Correct CORS Setup
// app.use(cors({
//   origin: 'https://www.scholarshipopertunity.com', // ✅ updated domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
const allowedOrigins = [
  // 'https://scholarhip-site-client.vercel.app',
  'https://www.scholarshipopertunity.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
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
