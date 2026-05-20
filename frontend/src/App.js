import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminRequests } from './pages/admin/AdminRequests';
import { EmployerDashboard } from './pages/employer/EmployerDashboard';
import { EmployerEmployees } from './pages/employer/EmployerEmployees';
import { EmployerRequests } from './pages/employer/EmployerRequests';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { RequestAdvance } from './pages/employee/RequestAdvance';
import { MyRequests } from './pages/employee/MyRequests';
import './App.css';

// DEMO MODE: Always show landing page at root
const RoleBasedRedirect = () => <LandingPage />;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/enquiries" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEnquiries />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/requests" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRequests />
              </ProtectedRoute>
            } />
            
            {/* Employer Routes */}
            <Route path="/employer" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employer/employees" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerEmployees />
              </ProtectedRoute>
            } />
            <Route path="/employer/requests" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerRequests />
              </ProtectedRoute>
            } />
            
            {/* Employee Routes */}
            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employee/request-advance" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <RequestAdvance />
              </ProtectedRoute>
            } />
            <Route path="/employee/my-requests" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <MyRequests />
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;