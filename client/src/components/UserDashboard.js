import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function UserDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor: '', appointmentDate: '', appointmentTime: '', symptoms: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await axios.get(`${API_BASE_URL}/api/appointments`);
        const docRes = await axios.get(`${API_BASE_URL}/api/doctors`);
        setAppointments(apptRes.data);
        setDoctors(docRes.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, form);
      window.location.reload();
    } catch (err) {
      setError('Failed to book appointment');
    }
  };

  if (loading) return <div>Loading user dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>User Dashboard</h2>
      <h3>Book Appointment</h3>
      <form onSubmit={handleSubmit}>
        <select name="doctor" value={form.doctor} onChange={handleChange} required>
          <option value="">Select Doctor</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>
          ))}
        </select>
        <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} required />
        <input type="time" name="appointmentTime" value={form.appointmentTime} onChange={handleChange} required />
        <input type="text" name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="Symptoms (optional)" />
        <button type="submit">Book</button>
      </form>
      <h3>Your Appointments</h3>
      <ul>
        {appointments.map(appt => (
          <li key={appt._id}>
            With Dr. {appt.doctor?.name || 'Unknown'} on {new Date(appt.appointmentDate).toLocaleString()} at {appt.appointmentTime}
          </li>
        ))}
      </ul>
    </div>
  );
} 