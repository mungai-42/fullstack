import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import DoctorModal from './DoctorModal';
import { API_BASE_URL } from '../config';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/doctors`);
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to load doctors');
      console.error('Doctors error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (doctorData) => {
    try {
      await axios.post('/api/doctors', doctorData);
      fetchDoctors();
      setShowModal(false);
    } catch (err) {
      setError('Failed to add doctor');
      console.error('Add doctor error:', err);
    }
  };

  const handleEditDoctor = async (doctorData) => {
    try {
      await axios.put(`/api/doctors/${editingDoctor._id}`, doctorData);
      fetchDoctors();
      setShowModal(false);
      setEditingDoctor(null);
    } catch (err) {
      setError('Failed to update doctor');
      console.error('Update doctor error:', err);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this doctor?')) {
      try {
        await axios.delete(`/api/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        setError('Failed to deactivate doctor');
        console.error('Delete doctor error:', err);
      }
    }
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    setShowModal(true);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Doctor Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus style={{ marginRight: '5px' }} />
          Add Doctor
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Search doctors..."
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Experience (years)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.experience}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    style={{ marginRight: '5px' }}
                    onClick={() => openEditModal(doctor)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteDoctor(doctor._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDoctors.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            {searchTerm ? 'No doctors found matching your search.' : 'No doctors found.'}
          </p>
        )}
      </div>

      {showModal && (
        <DoctorModal
          doctor={editingDoctor}
          onSave={editingDoctor ? handleEditDoctor : handleAddDoctor}
          onClose={() => {
            setShowModal(false);
            setEditingDoctor(null);
          }}
        />
      )}
    </div>
  );
};

export default Doctors; 