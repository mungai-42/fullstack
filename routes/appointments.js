const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get all appointments (admin) or user's appointments (user)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone age gender')
      .populate('doctor', 'name specialization qualification');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone age gender')
      .populate('doctor', 'name specialization qualification');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    // Check if patient and doctor exist
    const patient = await Patient.findById(req.body.patient);
    const doctor = await Doctor.findById(req.body.doctor);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for appointment conflicts
    const existingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      status: { $nin: ['cancelled', 'no-show'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const appointment = new Appointment({
      patient: req.body.patient,
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      notes: req.body.notes || '',
      symptoms: req.body.symptoms || '',
      isEmergency: req.body.isEmergency || false
    });

    const newAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    Object.keys(req.body).forEach(key => {
      appointment[key] = req.body[key];
    });

    const updatedAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');

    res.json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = req.body.status;
    if (req.body.diagnosis) appointment.diagnosis = req.body.diagnosis;
    if (req.body.prescription) appointment.prescription = req.body.prescription;
    if (req.body.followUpDate) appointment.followUpDate = req.body.followUpDate;

    const updatedAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');

    res.json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments by date
router.get('/date/:date', async (req, res) => {
  try {
    const appointments = await Appointment.find({
      appointmentDate: req.params.date
    })
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .sort({ appointmentTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments by doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId
    })
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .sort({ appointmentDate: 1, appointmentTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.params.patientId
    })
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .sort({ appointmentDate: -1, appointmentTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;