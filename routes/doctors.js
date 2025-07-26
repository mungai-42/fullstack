const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new doctor
router.post('/', async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    specialization: req.body.specialization,
    experience: req.body.experience,
    qualification: req.body.qualification,
    licenseNumber: req.body.licenseNumber,
    availability: req.body.availability || {},
    isActive: true
  });

  try {
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update doctor
router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    Object.keys(req.body).forEach(key => {
      doctor[key] = req.body[key];
    });

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete doctor (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isActive = false;
    await doctor.save();
    res.json({ message: 'Doctor deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctors by specialization
router.get('/specialization/:spec', async (req, res) => {
  try {
    const doctors = await Doctor.find({
      specialization: { $regex: req.params.spec, $options: 'i' },
      isActive: true
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search doctors
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const doctors = await Doctor.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { specialization: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 