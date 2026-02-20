const mongoose=require('mongoose');
const config = require('./appConfig');

let isConnected = false;

const connectDb=async()=>{
    if (isConnected || mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const mongoUri = config.mongoUri;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in backend/.env');
    }

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      });
      isConnected = true;
      console.log("Database connected successfully");
      return conn;
    } catch (error) {
      console.error("Database connection failed.");
      if (error?.code === 'ENOTFOUND' || String(error?.message || '').includes('querySrv ENOTFOUND')) {
        console.error("MongoDB DNS lookup failed. Check MONGO_URI cluster host in backend/.env.");
        console.error("Use the exact Atlas URI from Connect > Drivers, for example:");
        console.error("mongodb+srv://<username>:<password>@<cluster-host>/... ");
      }
      throw error;
    }
}
module.exports=connectDb;
