const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
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
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 150
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  medicalHistory: {
    type: String,
    default: ''
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema); 