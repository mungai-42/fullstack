import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import PatientModal from './PatientModal';
import { API_BASE_URL } from '../config';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/patients`);
      setPatients(response.data);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Patients error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patientData) => {
    try {
      await axios.post(`${API_BASE_URL}/api/patients`, patientData);
      fetchPatients();
      setShowModal(false);
    } catch (err) {
      setError('Failed to add patient');
      console.error('Add patient error:', err);
    }
  };

  const handleEditPatient = async (patientData) => {
    try {
              await axios.put(`${API_BASE_URL}/api/patients/${editingPatient._id}`, patientData);
      fetchPatients();
      setShowModal(false);
      setEditingPatient(null);
    } catch (err) {
      setError('Failed to update patient');
      console.error('Update patient error:', err);
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/patients/${id}`);
        fetchPatients();
      } catch (err) {
        setError('Failed to delete patient');
        console.error('Delete patient error:', err);
      }
    }
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingPatient(null);
    setShowModal(true);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Patient Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus style={{ marginRight: '5px' }} />
          Add Patient
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Search patients..."
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
              <th>Age</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    style={{ marginRight: '5px' }}
                    onClick={() => openEditModal(patient)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeletePatient(patient._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
          </p>
        )}
      </div>

      {showModal && (
        <PatientModal
          patient={editingPatient}
          onSave={editingPatient ? handleEditPatient : handleAddPatient}
          onClose={() => {
            setShowModal(false);
            setEditingPatient(null);
          }}
        />
      )}
    </div>
  );
};

export default Patients; 