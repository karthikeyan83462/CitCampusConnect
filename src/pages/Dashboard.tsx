import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Users, Building, UtensilsCrossed, ShoppingBag, 
  ArrowRight, TrendingUp, Calendar, Bell 
} from 'lucide-react';
import DashboardStats from '../components/Dashboard/DashboardStats';
import RecentActivity from '../components/Dashboard/RecentActivity';
import type { RootState } from '../store/store';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const quickActions = [
    {
      title: 'Browse Clubs',
      description: 'Discover and join student organizations',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      link: '/clubs',
      roles: ['student', 'super_admin'],
    },
    {
      title: 'Hostel Services',
      description: 'Manage room allocation and complaints',
      icon: <Building className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600',
      link: '/hostel',
      roles: ['student', 'hostel_admin', 'super_admin'],
    },
    {
      title: 'Order Food',
      description: 'Browse menu and place canteen orders',
      icon: <UtensilsCrossed className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500',
      link: '/canteen',
      roles: ['student', 'canteen_vendor', 'super_admin'],
    },
    {
      title: 'Marketplace',
      description: 'Buy and sell items with fellow students',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      link: '/marketplace',
      roles: ['student', 'super_admin'],
    },
  ];

  const filteredActions = quickActions.filter(action => 
    user?.role && action.roles.includes(user.role)
  );

  const upcomingEvents = [
    {
      title: 'Tech Fest 2025',
      date: 'March 15-17',
      type: 'Event',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Photography Club Meeting',
      date: 'Tomorrow, 4 PM',
      type: 'Club',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Hostel Maintenance',
      date: 'This Weekend',
      type: 'Notice',
      color: 'bg-orange-100 text-orange-800',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to make the most of your campus experience today?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="group bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{action.description}</p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
              <span className="text-sm font-medium">Get started</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Upcoming Events & Notifications */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{event.date}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${event.color}`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-medium text-blue-900">New club event posted</p>
                <p className="text-xs text-blue-700 mt-1">Photography Club</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-medium text-green-900">Order ready for pickup</p>
                <p className="text-xs text-green-700 mt-1">Canteen Order #1234</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="text-sm font-medium text-orange-900">Maintenance scheduled</p>
                <p className="text-xs text-orange-700 mt-1">Block A - This weekend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;