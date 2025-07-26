const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  availability: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema); 