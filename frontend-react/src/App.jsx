import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/patient/BookAppointment';
import Profile from './pages/patient/Profile';
import AuditLogs from './pages/admin/AuditLogs';
import Payments from './pages/admin/Payments';

import DashboardLayout from './layouts/DashboardLayout';
import MyRecords from './pages/patient/MyRecords';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorViewPatientRecords from './pages/doctor/DoctorViewPatientRecords';
import DoctorViewPatientProfile from './pages/doctor/DoctorViewPatientProfile';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Helper to wrap pages in the layout automatically injecting role
const DashboardLayoutWrapper = ({ children }) => {
  const { user } = useAuth();
  return (
    <DashboardLayout role={user?.role}>
      {children}
    </DashboardLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>


        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DashboardLayoutWrapper>
                  <BookAppointment />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/records"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DashboardLayoutWrapper>
                  <MyRecords />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DashboardLayoutWrapper>
                  <Profile />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/schedule"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DashboardLayoutWrapper>
                  <DoctorSchedule />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DashboardLayoutWrapper>
                  <DoctorPatients />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients/:patientId/records"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DashboardLayoutWrapper>
                  <DoctorViewPatientRecords />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients/:patientId/profile"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DashboardLayoutWrapper>
                  <DoctorViewPatientProfile />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayoutWrapper>
                  <AuditLogs />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayoutWrapper>
                  <Payments />
                </DashboardLayoutWrapper>
              </ProtectedRoute>
            }
          />


          <Route path="/unauthorized" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso No Autorizado</h2>
              <p className="text-gray-600 mb-4">No tienes permiso para ver esta página.</p>
              <a href="/dashboard" className="text-indigo-600 hover:text-indigo-500">Volver al Panel</a>
            </div>
          } />

          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">404 No Encontrado</h2>
              <p className="text-gray-600 mb-4">La página que buscas no existe.</p>
              <a href="/dashboard" className="text-indigo-600 hover:text-indigo-500">Volver al Panel</a>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
