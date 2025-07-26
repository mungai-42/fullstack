# Simple Healthcare Management System

A full-stack healthcare management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **Patient Management**: Add, edit, delete, and search patients
- **Doctor Management**: Manage doctor profiles with specializations
- **Appointment Scheduling**: Schedule and manage appointments
- **Dashboard**: View statistics and recent activities
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Styling

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthcare-system
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/healthcare-system
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If you're using MongoDB locally:
   ```bash
   mongod
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the React frontend** (in a new terminal)
   ```bash
   cd client
   npm start
   ```
   The frontend will start on `http://localhost:3000`

### Production Mode

1. **Build the React app**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search/:query` - Search patients

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Deactivate doctor
- `GET /api/doctors/specialization/:spec` - Get doctors by specialization
- `GET /api/doctors/search/:query` - Search doctors

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/date/:date` - Get appointments by date
- `GET /api/appointments/doctor/:doctorId` - Get appointments by doctor
- `GET /api/appointments/patient/:patientId` - Get appointments by patient

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-appointments` - Get recent appointments
- `GET /api/dashboard/today-appointments` - Get today's appointments
- `GET /api/dashboard/appointments-by-status` - Get appointments by status
- `GET /api/dashboard/appointments-by-month` - Get monthly appointment trends
- `GET /api/dashboard/top-doctors` - Get top doctors by appointment count
- `GET /api/dashboard/patient-demographics` - Get patient demographics

## Database Schema

### Patient Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  age: Number (required),
  gender: String (enum: ['Male', 'Female', 'Other']),
  address: String (required),
  medicalHistory: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  specialization: String (required),
  experience: Number (required),
  qualification: String (required),
  licenseNumber: String (required, unique),
  availability: Object,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Schema
```javascript
{
  patient: ObjectId (ref: 'Patient', required),
  doctor: ObjectId (ref: 'Doctor', required),
  appointmentDate: Date (required),
  appointmentTime: String (required),
  status: String (enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']),
  notes: String,
  symptoms: String,
  diagnosis: String,
  prescription: String,
  followUpDate: Date,
  isEmergency: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

1. **Access the application** at `http://localhost:3000`

2. **Dashboard**: View system statistics and recent appointments

3. **Patients**: 
   - Add new patients with their details
   - Search and filter patients
   - Edit patient information
   - Delete patients

4. **Doctors**:
   - Add new doctors with specializations
   - Manage doctor profiles
   - Search doctors by specialization
   - Deactivate doctors

5. **Appointments**:
   - Schedule new appointments
   - Select patients and doctors
   - Update appointment status
   - View appointment history

## Features

- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Changes reflect immediately
- **Search Functionality**: Search across all entities
- **Status Management**: Track appointment statuses
- **Data Validation**: Form validation and error handling
- **Modern UI**: Clean and intuitive interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 