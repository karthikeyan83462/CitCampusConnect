import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, AppDispatch } from './store/store';
import { persistStore } from 'redux-persist';
import { checkSession } from './store/slices/authSlice';
import Layout from './components/Layout/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Hostel from './pages/Hostel';
import Canteen from './pages/Canteen';
import Marketplace from './pages/Marketplace';
import Settings from './pages/Settings';
import ClubManagement from './pages/ClubManagement';
import type { RootState } from './store/store';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // Add timeout for loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached');
        window.location.href = '/auth';
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Loading CampusConnect...</p>
          <p className="text-sm text-gray-500">If this takes too long, you'll be redirected to login</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppContent: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="hostel" element={<Hostel />} />
          <Route path="canteen" element={<Canteen />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="settings" element={<Settings />} />
          <Route path="club-management" element={<ClubManagement />} />
        </Route>
      </Routes>
    </Router>
  );
};

const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;