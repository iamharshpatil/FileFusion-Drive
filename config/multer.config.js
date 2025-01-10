const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // Import Cloudinary config


// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Grive', // Name of the folder in Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg', 'pdf', 'docx'], // Allowed file types
  },
});

// Add limits for file size (1 MB max)
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
  fileFilter: (req, file, cb) => {
    // Optional: Additional file validation
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, PDF, and DOCX are allowed.')); // Reject file
    }
  },
});

module.exports = upload;
