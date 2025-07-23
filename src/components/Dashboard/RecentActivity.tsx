import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Users, AlertCircle, ShoppingCart, MessageSquare } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'club' | 'hostel' | 'canteen' | 'marketplace' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'approved' | 'completed' | 'urgent';
}

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'club',
      title: 'Photography Club',
      description: 'Your membership request has been approved',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'approved',
    },
    {
      id: '2',
      type: 'canteen',
      title: 'Order #1234',
      description: 'Your lunch order is ready for pickup',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '3',
      type: 'hostel',
      title: 'Maintenance Request',
      description: 'Plumbing issue in Room 302B - In Progress',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      id: '4',
      type: 'marketplace',
      title: 'New Message',
      description: 'Someone is interested in your Chemistry textbook',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      id: '5',
      type: 'club',
      title: 'Coding Club Event',
      description: 'Hackathon registration closes tomorrow',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'urgent',
    },
  ];

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'club':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'hostel':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'canteen':
        return <ShoppingCart className="w-5 h-5 text-green-500" />;
      case 'marketplace':
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                {activity.status && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;