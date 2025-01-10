const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModels = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const path = require('path');  // Required for serving PDF files

// GET: Display registration form
router.get('/', (req, res) => {
  res.render('register');
});

// POST: Handle user registration
router.post('/',    
  body('email').trim().isEmail().isLength({ min: 13 }).withMessage('Please provide a valid email'),
  body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      });
    }

    const { username, email, password } = req.body;

    try {
      const existingUser = await userModels.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: 'Email already in use'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userModels.create({
        email,
        username,
        password: hashedPassword
      });

      res.redirect('/login')
    
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({
        message: 'Server error. Please try again later.'
      });
    }
  });

// GET: Display login form
router.get('/login', (req, res) => {
  res.render('login');
});

// POST: Handle user login
router.post('/login',
  body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      });
    }

    const { username, password } = req.body;

    try {
      const user = await userModels.findOne({ username });
        
      if (!user) {
        return res.status(400).json({
          message: 'Username or password is incorrect'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Username or password is incorrect'
        });
      }

      const token = jwt.sign({
        userId: user._id,
        email: user.email,
        username: user.username
      }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token)
      
      // Redirect to /home page after successful login
      res.redirect('/home');
      
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({
        message: 'Server error. Please try again later.'
      });
    }
  });

// POST: Logout
router.post('/logout',
     (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect('/login');
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      message: 'Error logging out. Please try again later.'
    });
  }
});

// Route to serve PDF
router.get('/view-pdf/:filename', (req, res) => {
  const { filename } = req.params;

  // Define the directory where your PDFs are stored
  const pdfPath = path.join(__dirname, 'uploads', filename);  // Adjust this path based on your storage location

  // Set the correct Content-Type for PDF
  res.setHeader('Content-Type', 'application/pdf');

  // Send the PDF file
  res.sendFile(pdfPath, (err) => {
    if (err) {
      console.error('Error sending PDF:', err);
      res.status(404).json({ message: 'PDF not found' });
    } else {
      console.log('PDF sent successfully');
    }
  });
});

module.exports = router;
