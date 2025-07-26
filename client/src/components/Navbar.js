import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHospital, FaUsers, FaUserMd, FaCalendarAlt } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <FaHospital style={{ marginRight: '10px' }} />
            Healthcare System
          </Link>
          <ul className="navbar-nav">
            <li>
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/patients" className={`nav-link ${isActive('/patients')}`}>
                <FaUsers style={{ marginRight: '5px' }} />
                Patients
              </Link>
            </li>
            <li>
              <Link to="/doctors" className={`nav-link ${isActive('/doctors')}`}>
                <FaUserMd style={{ marginRight: '5px' }} />
                Doctors
              </Link>
            </li>
            <li>
              <Link to="/appointments" className={`nav-link ${isActive('/appointments')}`}>
                <FaCalendarAlt style={{ marginRight: '5px' }} />
                Appointments
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 