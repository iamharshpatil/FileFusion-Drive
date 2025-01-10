const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary'); // Adjust path as necessary
const fileModel = require('../models/file.models'); // Adjust path as necessary
router.post('/delete/:id', async (req, res) => {
    try {
      const fileId = req.params.id;
  
      // Find the file in the database
      const file = await fileModel.findById(fileId);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      // Ensure the cloudinaryId exists in the document
      if (!file.cloudinaryId) {
        return res.status(400).json({ message: 'Cloudinary ID is missing from the file document' });
      }
  
      // Delete the file from Cloudinary
      await cloudinary.uploader.destroy(file.cloudinaryId);
  
      // Remove the file from the database
      await fileModel.findByIdAndDelete(fileId);
  
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      console.error('Error deleting file:', err);
      res.status(500).json({ message: 'Error deleting file', error: err });
    }
  });
  
  module.exports = router;