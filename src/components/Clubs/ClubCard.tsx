import React from 'react';
import { Users, Crown, Clock } from 'lucide-react';
import type { Database } from '../../lib/supabase';

type Club = Database['public']['Tables']['clubs']['Row'];

interface ClubCardProps {
  club: Club;
  onJoin?: (clubId: string) => void;
  onManage?: (clubId: string) => void;
  userRole?: string;
  userId?: string;
  isMember?: boolean;
  membershipStatus?: 'pending' | 'approved' | 'rejected';
}

const ClubCard: React.FC<ClubCardProps> = ({ 
  club, 
  onJoin, 
  onManage, 
  userRole, 
  userId,
  isMember,
  membershipStatus 
}) => {
  const getButtonContent = () => {
    if (isMember) {
      if (membershipStatus === 'pending') {
        return (
          <button className="w-full bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
            <Clock className="w-4 h-4 inline mr-2" />
            Pending Approval
          </button>
        );
      }
      return (
        <button className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
          ✓ Member
        </button>
      );
    }

    if (userRole === 'club_head' && club.club_head_id === userId) {
      return (
        <button
          onClick={() => onManage?.(club.id)}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all"
        >
          <Crown className="w-4 h-4 inline mr-2" />
          Manage Club
        </button>
      );
    }

    return (
      <button
        onClick={() => onJoin?.(club.id)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        Join Club
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
            {club.category}
          </span>
        </div>
        <div className="flex items-center text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm">{club.member_count}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-6 line-clamp-3">{club.description}</p>

      <div className="space-y-3">
        {getButtonContent()}
      </div>
    </div>
  );
};

export default ClubCard;
