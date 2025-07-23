import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Plus, Users } from 'lucide-react';
import { fetchClubs, joinClub, fetchUserClubMemberships } from '../store/slices/clubSlice';
import ClubCard from '../components/Clubs/ClubCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';

type ClubRole = 'club_head' | 'member' | 'secretary' | 'treasurer' | 'event_manager';
const validRoles: ClubRole[] = ['club_head', 'member', 'secretary', 'treasurer', 'event_manager'];
const isValidClubRole = (role: string): role is ClubRole => validRoles.includes(role as ClubRole);

const Clubs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { clubs, loading, userClubMemberships } = useSelector((state: RootState) => state.clubs);
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(fetchClubs());
    if (user?.id) dispatch(fetchUserClubMemberships(user.id));
  }, [dispatch, user?.id]);

  const handleJoinClub = async (clubId: string) => {
    if (!user || !user.id) return;
    try {
      await dispatch(joinClub({ clubId, userId: user.id })).unwrap();
      toast.success('Join request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit join request');
    }
  };

  const handleManageClub = (clubId: string, clubName: string) => {
    navigate(`/club-management?clubId=${clubId}&clubName=${encodeURIComponent(clubName)}`);
  };

  const handleViewClub = (clubId: string, clubName: string) => {
    navigate(`/club/${clubId}?name=${encodeURIComponent(clubName)}`);
  };

  const categories = ['Academic', 'Sports', 'Cultural', 'Technical', 'Social Service', 'Arts'];

  const filteredClubs = clubs.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getMembershipDetails = (clubId: string) => {
    const membership = userClubMemberships?.find(m => m.club_id === clubId);
    const isApproved = membership?.status === 'approved';
    const userRole = isValidClubRole(membership?.position || '') ? (membership?.position as ClubRole) : undefined;
    return { isApproved, userRole, status: membership?.status };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Clubs</h1>
          <p className="text-gray-600 mt-2">Discover and join amazing student organizations</p>
        </div>
        {user?.role === 'club_head' && (
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Club</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{clubs.length}</div>
          <div className="text-gray-600">Total Clubs</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
          <div className="text-gray-600">Categories</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {clubs.reduce((sum, club) => sum + (club.member_count || 0), 0)}
          </div>
          <div className="text-gray-600">Total Members</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map(club => {
          const { isApproved, userRole, status } = getMembershipDetails(club.id);

          return (
            <ClubCard
              key={club.id}
              club={club}
              onJoin={handleJoinClub}
              onManage={() => handleManageClub(club.id, club.name)}
              onView={() => handleViewClub(club.id, club.name)}
              userRole={userRole}
              membershipStatus={status}
              isMember={!!status}
              userId={user?.id}
            />
          );
        })}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Clubs;
