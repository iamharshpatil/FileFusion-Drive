const mongoose = require('mongoose');
require('dotenv').config();


const connectToDB = () => {
  const dbURI = process.env.MONGODB_URI;

  mongoose.connect(dbURI)  
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
};

module.exports = connectToDB;
