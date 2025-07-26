import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const DoctorModal = ({ doctor, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    licenseNumber: ''
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialization: doctor.specialization || '',
        experience: doctor.experience || '',
        qualification: doctor.qualification || '',
        licenseNumber: doctor.licenseNumber || ''
      });
    }
  }, [doctor]);

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

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{doctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization *</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience (years) *</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="qualification">Qualification *</label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="licenseNumber">License Number *</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {doctor ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal; 