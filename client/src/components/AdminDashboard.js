import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get(`${API_BASE_URL}/api/users`);
        const apptRes = await axios.get(`${API_BASE_URL}/api/appointments`);
        setUsers(usersRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Registered Users</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} ({user.email})</li>
        ))}
      </ul>
      <h3>All Appointments</h3>
      <ul>
        {appointments.map(appt => (
          <li key={appt._id}>
            {appt.user?.name || 'Unknown User'} booked with Dr. {appt.doctor?.name || 'Unknown Doctor'} on {new Date(appt.appointmentDate).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
} 