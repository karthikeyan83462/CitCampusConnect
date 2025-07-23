import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import type { RootState, AppDispatch } from '../store/store';
import {
  setTheme,
  setEmailNotifications,
  setPushNotifications,
  updateProfile,
} from '../store/slices/settingsSlice';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.settings);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(updateProfile({ 
        displayName: user.full_name || '', 
        email: user.email || '' 
      }));
    }
  }, [dispatch, user]);

  const handleSaveChanges = () => {
    // In a real application, you would make API calls here to update the user's settings
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Profile Settings Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Name</label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => dispatch(updateProfile({ 
                  ...settings,
                  displayName: e.target.value 
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => dispatch(updateProfile({ 
                  ...settings,
                  email: e.target.value 
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your email"
              />
            </div>
          </div>
        </section>

        {/* Notification Settings Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => dispatch(setEmailNotifications(e.target.checked))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={settings.pushNotifications}
                onChange={(e) => dispatch(setPushNotifications(e.target.checked))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
                Push Notifications
              </label>
            </div>
          </div>
        </section>

        {/* Theme Settings Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select 
              value={settings.theme}
              onChange={(e) => dispatch(setTheme(e.target.value as 'light' | 'dark' | 'system'))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveChanges}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
