import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Pages
import Onboarding from './pages/Onboarding';
import Register from './pages/Register';
import Login from './pages/Login';
import LiveID from './pages/LiveID';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0f1c] text-white">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/verify-live" element={
            <ProtectedRoute><LiveID /></ProtectedRoute>
          } />
          <Route path="/setup-profile" element={
            <ProtectedRoute><ProfileSetup /></ProtectedRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />
          <Route path="/chat/:matchId" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><Admin /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
