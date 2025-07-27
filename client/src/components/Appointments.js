import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import AppointmentModal from './AppointmentModal';
import { API_BASE_URL } from '../config';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/appointments`);
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Appointments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (appointmentData) => {
    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, appointmentData);
      fetchAppointments();
      setShowModal(false);
    } catch (err) {
      setError('Failed to schedule appointment');
      console.error('Add appointment error:', err);
    }
  };

  const handleEditAppointment = async (appointmentData) => {
    try {
      await axios.put(`${API_BASE_URL}/api/appointments/${editingAppointment._id}`, appointmentData);
      fetchAppointments();
      setShowModal(false);
      setEditingAppointment(null);
    } catch (err) {
      setError('Failed to update appointment');
      console.error('Update appointment error:', err);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/appointments/${id}`);
        fetchAppointments();
      } catch (err) {
        setError('Failed to delete appointment');
        console.error('Delete appointment error:', err);
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/appointments/${id}`, { status });
      fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment status');
      console.error('Status update error:', err);
    }
  };

  const openEditModal = (appointment) => {
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingAppointment(null);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return '#ffc107';
      case 'confirmed':
        return '#17a2b8';
      case 'completed':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      case 'no-show':
        return '#6c757d';
      default:
        return '#666';
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Appointment Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus style={{ marginRight: '5px' }} />
          Schedule Appointment
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '35px' }}
              className="form-group input"
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.patient?.name}</td>
                <td>{appointment.doctor?.name}</td>
                <td>{formatDate(appointment.appointmentDate)}</td>
                <td>{formatTime(appointment.appointmentTime)}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: getStatusColor(appointment.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                    style={{ marginRight: '5px', padding: '4px', fontSize: '12px' }}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                  <button
                    className="btn btn-secondary"
                    style={{ marginRight: '5px' }}
                    onClick={() => openEditModal(appointment)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteAppointment(appointment._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAppointments.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            {searchTerm ? 'No appointments found matching your search.' : 'No appointments found.'}
          </p>
        )}
      </div>

      {showModal && (
        <AppointmentModal
          appointment={editingAppointment}
          onSave={editingAppointment ? handleEditAppointment : handleAddAppointment}
          onClose={() => {
            setShowModal(false);
            setEditingAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default Appointments; 