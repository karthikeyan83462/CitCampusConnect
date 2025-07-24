import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import ClubManagement from './pages/ClubManagement';
import ViewClub from './pages/ViewClub';
import Canteen from './pages/Canteen';
import Hostel from './pages/Hostel';
import Marketplace from './pages/Marketplace';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import { ThemeProvider } from './contexts/ThemeContext';
import { checkSession } from './store/slices/authSlice';
import type { RootState, AppDispatch } from './store/store';
import './index.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check session on app load
    dispatch(checkSession());
  }, [dispatch]);

  // Only show loading if we're actually checking auth and have no user
  if (loading && !user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '1.125rem',
        color: '#64748b'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
            {user ? (
              <Route path="/*" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="clubs" element={<Clubs />} />
                <Route path="club-management" element={<ClubManagement />} />
                <Route path="view-club/:clubId" element={<ViewClub />} />
                <Route path="canteen" element={<Canteen />} />
                <Route path="hostel" element={<Hostel />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/auth" />} />
            )}
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;