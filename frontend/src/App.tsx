import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { MentorProfilePage } from './pages/MentorProfilePage';
import { BookingPage } from './pages/BookingPage';
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
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Single persistent top navbar */}
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Discovery & Information Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/mentors" element={<DiscoveryPage />} />
          <Route path="/mentor/:id" element={<MentorProfilePage />} />
          <Route path="/book/:packageId" element={<BookingPage />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Single persistent footer */}
      <Footer />
    </div>
  );
};

export default App;
