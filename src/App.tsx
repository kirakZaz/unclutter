import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { restoreSessionThunk } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import ExchangePage from './pages/exchange/ExchangePage';
import CommunitiesPage from './pages/communities/CommunitiesPage';
import ChallengesPage from './pages/challenges/ChallengesPage';
import DonationsPage from './pages/donations/DonationsPage';
import SupportPage from './pages/support/SupportPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const dispatch = useAppDispatch();
  const [isRestoringSession, setIsRestoringSession] = React.useState(true);

  useEffect(() => {
    dispatch(restoreSessionThunk()).finally(() => setIsRestoringSession(false));
  }, [dispatch]);

  if (isRestoringSession) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="exchange" element={<ExchangePage />} />
        <Route path="communities" element={<CommunitiesPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="support" element={<SupportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
