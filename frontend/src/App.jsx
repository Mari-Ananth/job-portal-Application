import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerProfile from './pages/seeker/SeekerProfile';
import MyApplications from './pages/seeker/MyApplications';

import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from './pages/employer/EmployerProfile';
import PostJob from './pages/employer/PostJob';
import EmployerJobs from './pages/employer/EmployerJobs';
import Applicants from './pages/employer/Applicants';

import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Seeker Protected Routes */}
              <Route path="/seeker/dashboard" element={
                <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                  <SeekerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/seeker/profile" element={
                <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                  <SeekerProfile />
                </ProtectedRoute>
              } />
              <Route path="/seeker/applications" element={
                <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                  <MyApplications />
                </ProtectedRoute>
              } />

              {/* Employer Protected Routes */}
              <Route path="/employer/dashboard" element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/employer/profile" element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <EmployerProfile />
                </ProtectedRoute>
              } />
              <Route path="/employer/post-job" element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <PostJob />
                </ProtectedRoute>
              } />
              <Route path="/employer/jobs" element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <EmployerJobs />
                </ProtectedRoute>
              } />
              <Route path="/employer/jobs/:jobId/applicants" element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <Applicants />
                </ProtectedRoute>
              } />

              {/* Admin Protected Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
