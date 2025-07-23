import React from 'react';
import { Users, Building, UtensilsCrossed, ShoppingBag } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1">+{change} from last month</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Active Clubs',
      value: '24',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '2',
    },
    {
      title: 'Hostel Occupancy',
      value: '87%',
      icon: <Building className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      change: '5%',
    },
    {
      title: 'Canteen Orders',
      value: '156',
      icon: <UtensilsCrossed className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500',
      change: '23',
    },
    {
      title: 'Marketplace Items',
      value: '89',
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '12',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;