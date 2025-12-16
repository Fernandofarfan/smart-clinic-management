import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/patient/BookAppointment';

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

          <Route path="/unauthorized" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h2>
              <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
              <a href="/dashboard" className="text-indigo-600 hover:text-indigo-500">Return to Dashboard</a>
            </div>
          } />

          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
