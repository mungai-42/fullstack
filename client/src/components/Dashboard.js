import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserMd, FaCalendarAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, appointmentsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/stats`),
        axios.get(`${API_BASE_URL}/api/dashboard/recent-appointments`)
      ]);

      setStats(statsResponse.data);
      setRecentAppointments(appointmentsResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <FaUsers size={24} color="#007bff" />
            <h3>Total Patients</h3>
            <p>{stats.totalPatients}</p>
          </div>
          <div className="stat-card">
            <FaUserMd size={24} color="#28a745" />
            <h3>Total Doctors</h3>
            <p>{stats.totalDoctors}</p>
          </div>
          <div className="stat-card">
            <FaCalendarAlt size={24} color="#ffc107" />
            <h3>Total Appointments</h3>
            <p>{stats.totalAppointments}</p>
          </div>
          <div className="stat-card">
            <FaClock size={24} color="#dc3545" />
            <h3>Today's Appointments</h3>
            <p>{stats.todayAppointments}</p>
          </div>
          <div className="stat-card">
            <FaCalendarAlt size={24} color="#17a2b8" />
            <h3>Pending Appointments</h3>
            <p>{stats.pendingAppointments}</p>
          </div>
          <div className="stat-card">
            <FaCalendarAlt size={24} color="#28a745" />
            <h3>Completed Appointments</h3>
            <p>{stats.completedAppointments}</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Recent Appointments</h2>
        {recentAppointments.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.patient?.name}</td>
                  <td>{appointment.doctor?.name}</td>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td>{formatTime(appointment.appointmentTime)}</td>
                  <td>
                    <span className={`status status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent appointments</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 