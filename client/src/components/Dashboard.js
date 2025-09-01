import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUserMd, 
  FaCalendarAlt, 
  FaClock, 
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaTimes,
  FaEye,
  FaStethoscope,
  FaHeartbeat,
  FaAmbulance,
  FaUserInjured,
  FaCalendarCheck,
  FaChartPie,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [appointmentsByStatus, setAppointmentsByStatus] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsResponse, 
        appointmentsResponse, 
        todayResponse,
        statusResponse,
        topDoctorsResponse
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/stats`),
        axios.get(`${API_BASE_URL}/api/dashboard/recent-appointments`),
        axios.get(`${API_BASE_URL}/api/dashboard/today-appointments`),
        axios.get(`${API_BASE_URL}/api/dashboard/appointments-by-status`),
        axios.get(`${API_BASE_URL}/api/dashboard/top-doctors`)
      ]);

      setStats(statsResponse.data);
      setRecentAppointments(appointmentsResponse.data);
      setTodayAppointments(todayResponse.data);
      setAppointmentsByStatus(statusResponse.data);
      setTopDoctors(topDoctorsResponse.data);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="status-icon completed" />;
      case 'scheduled': return <FaHourglassHalf className="status-icon scheduled" />;
      case 'confirmed': return <FaCalendarCheck className="status-icon confirmed" />;
      case 'cancelled': return <FaTimes className="status-icon cancelled" />;
      case 'no-show': return <FaExclamationTriangle className="status-icon no-show" />;
      default: return <FaClock className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'scheduled': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      case 'no-show': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">
          <FaHeartbeat className="page-icon" />
          Healthcare Dashboard
        </h1>
        <p className="dashboard-subtitle">Monitor your healthcare system at a glance</p>
      </div>
      
      {/* Main Stats Cards */}
      {stats && (
        <div className="stats-grid enhanced">
          <div className="stat-card primary">
            <div className="stat-icon">
              <FaUserInjured size={32} />
            </div>
            <div className="stat-content">
              <h3>Total Patients</h3>
              <p className="stat-number">{stats.totalPatients}</p>
              <span className="stat-trend">
                <FaArrowUp size={12} /> Active Records
              </span>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">
              <FaStethoscope size={32} />
            </div>
            <div className="stat-content">
              <h3>Active Doctors</h3>
              <p className="stat-number">{stats.totalDoctors}</p>
              <span className="stat-trend">
                <FaHeartbeat size={12} /> Available
              </span>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <FaCalendarAlt size={32} />
            </div>
            <div className="stat-content">
              <h3>Total Appointments</h3>
              <p className="stat-number">{stats.totalAppointments}</p>
              <span className="stat-trend">
                <FaChartLine size={12} /> All Time
              </span>
            </div>
          </div>
          
          <div className="stat-card danger">
            <div className="stat-icon">
              <FaAmbulance size={32} />
            </div>
            <div className="stat-content">
              <h3>Today's Schedule</h3>
              <p className="stat-number">{stats.todayAppointments}</p>
              <span className="stat-trend">
                <FaClock size={12} /> Active Today
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Stats */}
      {stats && (
        <div className="secondary-stats">
          <div className="stat-card-small pending">
            <FaHourglassHalf size={20} />
            <div>
              <h4>Pending</h4>
              <span>{stats.pendingAppointments}</span>
            </div>
          </div>
          <div className="stat-card-small completed">
            <FaCheckCircle size={20} />
            <div>
              <h4>Completed</h4>
              <span>{stats.completedAppointments}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Today's Appointments */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <FaCalendarCheck className="card-icon" />
              Today's Appointments
            </h2>
            <span className="card-badge">{todayAppointments.length}</span>
          </div>
          <div className="card-content">
            {todayAppointments.length > 0 ? (
              <div className="appointment-list">
                {todayAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment._id} className="appointment-item">
                    <div className="appointment-info">
                      <div className="appointment-patient">
                        <FaUsers size={16} />
                        <strong>{appointment.patient?.name}</strong>
                      </div>
                      <div className="appointment-doctor">
                        <FaUserMd size={16} />
                        Dr. {appointment.doctor?.name}
                      </div>
                      <div className="appointment-time">
                        <FaClock size={14} />
                        {formatTime(appointment.appointmentTime)}
                      </div>
                    </div>
                    <div className="appointment-status">
                      {getStatusIcon(appointment.status)}
                    </div>
                  </div>
                ))}
                {todayAppointments.length > 5 && (
                  <div className="view-more">
                    <FaEye size={14} />
                    +{todayAppointments.length - 5} more appointments
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <FaCalendarAlt size={48} color="#ddd" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Status Overview */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <FaChartPie className="card-icon" />
              Appointment Status
            </h2>
          </div>
          <div className="card-content">
            {appointmentsByStatus.length > 0 ? (
              <div className="status-overview">
                {appointmentsByStatus.map((item) => (
                  <div key={item._id} className="status-item">
                    <div className="status-info">
                      {getStatusIcon(item._id)}
                      <span className="status-label">{item._id}</span>
                    </div>
                    <span className="status-count">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaChartPie size={48} color="#ddd" />
                <p>No appointment data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Doctors */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <FaUserMd className="card-icon" />
              Top Doctors
            </h2>
            <span className="card-subtitle">By appointment count</span>
          </div>
          <div className="card-content">
            {topDoctors.length > 0 ? (
              <div className="doctors-list">
                {topDoctors.map((doctor, index) => (
                  <div key={doctor._id} className="doctor-item">
                    <div className="doctor-rank">#{index + 1}</div>
                    <div className="doctor-info">
                      <div className="doctor-name">
                        <FaStethoscope size={16} />
                        Dr. {doctor.doctorName}
                      </div>
                      <div className="doctor-spec">{doctor.specialization}</div>
                    </div>
                    <div className="doctor-count">
                      <span>{doctor.appointmentCount}</span>
                      <small>appointments</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaUserMd size={48} color="#ddd" />
                <p>No doctor data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h2>
              <FaChartLine className="card-icon" />
              Recent Appointments
            </h2>
            <span className="card-badge">{recentAppointments.length}</span>
          </div>
          <div className="card-content">
            {recentAppointments.length > 0 ? (
              <div className="appointments-table-container">
                <table className="enhanced-table">
                  <thead>
                    <tr>
                      <th><FaUsers size={14} /> Patient</th>
                      <th><FaUserMd size={14} /> Doctor</th>
                      <th><FaCalendarAlt size={14} /> Date</th>
                      <th><FaClock size={14} /> Time</th>
                      <th><FaEye size={14} /> Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment._id} className="appointment-row">
                        <td>
                          <div className="patient-cell">
                            <FaUserInjured size={16} color="#007bff" />
                            <span>{appointment.patient?.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="doctor-cell">
                            <FaStethoscope size={16} color="#28a745" />
                            <span>Dr. {appointment.doctor?.name}</span>
                          </div>
                        </td>
                        <td>{formatDate(appointment.appointmentDate)}</td>
                        <td>
                          <span className="time-badge">
                            <FaClock size={12} />
                            {formatTime(appointment.appointmentTime)}
                          </span>
                        </td>
                        <td>
                          <span 
                            className={`enhanced-status status-${appointment.status}`}
                            style={{ color: getStatusColor(appointment.status) }}
                          >
                            {getStatusIcon(appointment.status)}
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <FaCalendarAlt size={48} color="#ddd" />
                <p>No recent appointments</p>
                <small>Appointments will appear here once scheduled</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 