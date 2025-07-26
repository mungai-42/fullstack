const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments({ isActive: true }),
      Appointment.countDocuments(),
      Appointment.countDocuments({
        appointmentDate: new Date().toISOString().split('T')[0]
      }),
      Appointment.countDocuments({ status: 'scheduled' }),
      Appointment.countDocuments({ status: 'completed' })
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent appointments
router.get('/recent-appointments', async (req, res) => {
  try {
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(recentAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's appointments
router.get('/today-appointments', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = await Appointment.find({
      appointmentDate: today
    })
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .sort({ appointmentTime: 1 });

    res.json(todayAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments by status
router.get('/appointments-by-status', async (req, res) => {
  try {
    const statusCounts = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(statusCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments by month (last 6 months)
router.get('/appointments-by-month', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAppointments = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json(monthlyAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top doctors by appointment count
router.get('/top-doctors', async (req, res) => {
  try {
    const topDoctors = await Appointment.aggregate([
      {
        $group: {
          _id: '$doctor',
          appointmentCount: { $sum: 1 }
        }
      },
      {
        $sort: { appointmentCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      {
        $unwind: '$doctorInfo'
      },
      {
        $project: {
          doctorName: '$doctorInfo.name',
          specialization: '$doctorInfo.specialization',
          appointmentCount: 1
        }
      }
    ]);

    res.json(topDoctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient demographics
router.get('/patient-demographics', async (req, res) => {
  try {
    const genderStats = await Patient.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    const ageStats = await Patient.aggregate([
      {
        $group: {
          _id: {
            $cond: {
              if: { $lt: ['$age', 18] },
              then: 'Under 18',
              else: {
                $cond: {
                  if: { $lt: ['$age', 30] },
                  then: '18-29',
                  else: {
                    $cond: {
                      if: { $lt: ['$age', 50] },
                      then: '30-49',
                      else: {
                        $cond: {
                          if: { $lt: ['$age', 65] },
                          then: '50-64',
                          else: '65+'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      genderStats,
      ageStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 