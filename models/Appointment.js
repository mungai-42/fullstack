const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    default: ''
  },
  symptoms: {
    type: String,
    default: ''
  },
  diagnosis: {
    type: String,
    default: ''
  },
  prescription: {
    type: String,
    default: ''
  },
  followUpDate: {
    type: Date
  },
  isEmergency: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema); 