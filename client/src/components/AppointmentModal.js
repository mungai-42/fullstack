import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AppointmentModal = ({ appointment, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
    symptoms: ''
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatientsAndDoctors();
    if (appointment) {
      setFormData({
        patient: appointment.patient?._id || '',
        doctor: appointment.doctor?._id || '',
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString().split('T')[0] : '',
        appointmentTime: appointment.appointmentTime || '',
        notes: appointment.notes || '',
        symptoms: appointment.symptoms || ''
      });
    }
  }, [appointment]);

  const fetchPatientsAndDoctors = async () => {
    try {
      setLoading(true);
      const [patientsResponse, doctorsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/patients`),
        axios.get(`${API_BASE_URL}/api/doctors`)
      ]);
      setPatients(patientsResponse.data);
      setDoctors(doctorsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{appointment ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patient">Patient *</label>
            <select
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="doctor">Doctor *</label>
            <select
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="appointmentDate">Date *</label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointmentTime">Time *</label>
            <input
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="symptoms">Symptoms</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="3"
              placeholder="Describe patient symptoms..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {appointment ? 'Update Appointment' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal; 