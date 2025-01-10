const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  path: { type: String, required: true }, // Cloudinary file URL
  originalname: { type: String, required: true }, // Original file name
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model('File', fileSchema);
