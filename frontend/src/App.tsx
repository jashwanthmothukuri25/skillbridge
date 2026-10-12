import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { MentorProfilePage } from './pages/MentorProfilePage';
import { BookingPage } from './pages/BookingPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SessionRoomPage } from './pages/session/SessionRoomPage';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { useApp } from './context/AppContext';

// Simple route guard for protected dashboard areas
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: ('student' | 'mentor' | 'admin')[];
}> = ({ children, allowedRoles }) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const location = useLocation();
  const isVideoRoom = location.pathname.startsWith('/session');

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Hide persistent navbar/footer when in full-screen video classroom */}
      {!isVideoRoom && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Discovery & Information Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/mentors" element={<DiscoveryPage />} />
          <Route path="/discover" element={<DiscoveryPage />} />
          <Route path="/mentor/:id" element={<MentorProfilePage />} />
          <Route path="/book/:packageId" element={<BookingPage />} />

          {/* Dashboards */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <DashboardLayout>
                  <StudentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor"
            element={
              <ProtectedRoute allowedRoles={['mentor', 'admin']}>
                <DashboardLayout>
                  <MentorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* WebRTC Video Classroom */}
          <Route
            path="/session/:sessionId"
            element={
              <ProtectedRoute>
                <SessionRoomPage />
              </ProtectedRoute>
            }
          />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isVideoRoom && <Footer />}
    </div>
  );
};

export default App;
