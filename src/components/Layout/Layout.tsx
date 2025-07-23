import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { getCurrentUser } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store/store';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Auth check taking too long, redirecting to auth page');
        window.location.href = '/auth';
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CampusConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="p-4 lg:ml-64 pt-20">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'shadow-lg',
          duration: 4000,
        }}
      />
    </div>
  );
};

export default Layout;
