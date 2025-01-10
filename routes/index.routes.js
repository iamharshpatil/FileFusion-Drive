const express = require('express');
const multer = require('multer'); // Import multer
const router = express.Router();
const upload = require('../config/multer.config');
const fileModel = require('../models/file.models');
const authMiddleware = require('../middlewares/auth');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// Route: Home - Display User's Files
router.get('/home', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized access, please log in.' });
    }

    const userFiles = await fileModel.find({ user: req.user.userId });

    res.render('home', {
      files: userFiles,
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files', error });
  }
});

// Route: Upload File
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path, originalname, size, mimetype } = req.file;

    // Create file record in the database
    const newFile = await fileModel.create({
      path,
      originalname,
      size,
      mimetype,
      user: req.user.userId,
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        name: originalname,
        size,
        type: mimetype,
        path
      }
    });
  } catch (error) {
    console.error('File upload failed:', error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

// Route: Download File
router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const file = await fileModel.findOne({ _id: id, user: req.user.userId });

    if (!file) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    // Provide download URL based on file storage location
    res.redirect(file.path);  // This could be a direct URL or a Cloud storage link
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error handling download', error });
  }
});


// Delete file route
router.post('/delete/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    // Find the file in your database by its unique identifier (using _id or your custom identifier)
    const file = await fileModel.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete the file from Cloudinary using the public_id
    await cloudinary.uploader.destroy(file.cloudinaryId);

    // Optionally, remove the file from the database
    await file.remove();

    res.status(200).json({ message: 'File deleted successfully' });

  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ message: 'Error deleting file', error: err });
  }
});

module.exports = router;
