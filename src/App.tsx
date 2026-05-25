import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { restoreSession } from './store/slices/authSlice';
import { Navbar } from './components/Navbar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { MetersPage } from './pages/MetersPage';
import { MeterDetailPage } from './pages/MeterDetailPage';
import { RequestsPage } from './pages/RequestsPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Breadcrumbs />
      </div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><MetersPage /></ProtectedRoute>} />
        <Route path="/meters/:id" element={<ProtectedRoute><MeterDetailPage /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
        <Route path="/requests/:id" element={<ProtectedRoute><RequestDetailPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;