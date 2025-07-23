import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home, Users, Building, UtensilsCrossed, ShoppingBag,
  Settings, Crown, Truck, Shield, X
} from 'lucide-react';
import type { RootState } from '../../store/store';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard', roles: ['student', 'club_head', 'canteen_vendor', 'hostel_admin', 'super_admin'] },
    { name: 'Clubs', icon: Users, path: '/clubs', roles: ['student', 'club_head', 'super_admin'] },
    { name: 'Hostel', icon: Building, path: '/hostel', roles: ['student', 'hostel_admin', 'super_admin'] },
    { name: 'Canteen', icon: UtensilsCrossed, path: '/canteen', roles: ['student', 'canteen_vendor', 'super_admin'] },
    { name: 'Marketplace', icon: ShoppingBag, path: '/marketplace', roles: ['student', 'super_admin'] },
    { name: 'Club Management', icon: Crown, path: '/club-management', roles: ['club_head', 'super_admin'] },
    { name: 'Vendor Portal', icon: Truck, path: '/vendor', roles: ['canteen_vendor', 'super_admin'] },
    { name: 'Admin Panel', icon: Shield, path: '/admin', roles: ['hostel_admin', 'super_admin'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['student', 'club_head', 'canteen_vendor', 'hostel_admin', 'super_admin'] },
  ];

  const filteredItems = menuItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

return (
  <>
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-200 lg:translate-x-0`}
    >
      {/* Close button inside sidebar for mobile */}
      <div className="absolute top-4 right-4 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition-all"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="pt-20 h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center p-3 rounded-lg group transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-900 hover:bg-gray-100 hover:shadow-md'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition duration-75 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-500 group-hover:text-gray-900'
                    }`}
                  />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  </>
);
}

export default Sidebar;
