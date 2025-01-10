const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name should be at least 3 characters long'],
    maxlength: [50, 'Name should not exceed 50 characters'],
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password should be at least 6 characters long'],
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;
