import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, Users, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import {
    fetchClubs,
    fetchClubMembers,
    fetchMembershipRequests,
    updateMembershipStatus,
    leaveClub
} from '../store/slices/clubSlice';

const ClubManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const passedClubId = searchParams.get('clubId') || '';
    const passedClubName = searchParams.get('clubName') || '';

    const { user } = useSelector((state: RootState) => state.auth);
    const { clubs, clubMembers, membershipRequests, loading } = useSelector((state: RootState) => state.clubs);

    const [activeTab, setActiveTab] = useState<'members' | 'requests' | 'settings'>('members');
    const [selectedClub, setSelectedClub] = useState<string>(passedClubId);
    const [assignRoles, setAssignRoles] = useState<{ [key: string]: string }>({});

    const isClubHead = user?.role === 'club_head';

    const myClubs = isClubHead
        ? clubs
        : clubs.filter(club =>
            clubMembers.some(
                m => m.user_id === user?.id &&
                    m.club_id === club.id &&
                    m.position === 'secretary'
            )
        );

    useEffect(() => {
        dispatch(fetchClubs());
    }, [dispatch]);

    useEffect(() => {
        if (passedClubId) setSelectedClub(passedClubId);
    }, [passedClubId]);

    useEffect(() => {
        if (selectedClub) {
            dispatch(fetchClubMembers(selectedClub));
            dispatch(fetchMembershipRequests(selectedClub));
        }
    }, [dispatch, selectedClub]);

    const validRoles = ['member', 'secretary', 'treasurer', 'event_manager'] as const;
    type Role = typeof validRoles[number];
    const isValidRole = (role: string): role is Role => validRoles.includes(role as Role);

    const handleApproveRequest = async (requestId: string, role: string) => {
        try {
            console.log('Approving member with requestId:', requestId);
            const position = isValidRole(role) ? role : undefined;
            await dispatch(updateMembershipStatus({ requestId, status: 'approved', position })).unwrap();
            toast.success('Member approved and role assigned!');
        } catch {
            toast.error('Failed to approve member');
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await dispatch(updateMembershipStatus({ requestId, status: 'rejected' })).unwrap();
            toast.success('Request rejected successfully!');
        } catch {
            toast.error('Failed to reject request');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            if (!selectedClub || !user) return;
            await dispatch(leaveClub({ clubId: selectedClub, userId: memberId })).unwrap();
            toast.success('Member removed successfully!');
        } catch {
            toast.error('Failed to remove member');
        }
    };

    const roleOptions = ['member', 'secretary', 'treasurer', 'event_manager'];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Clubs Found</h3>
                <p className="text-gray-600">You are not a club head or secretary of any clubs.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Club Management {passedClubName ? `- ${passedClubName}` : ''}
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your clubs and members</p>
                </div>
                <button
                    onClick={() => navigate('/create-event', { state: { clubId: selectedClub } })}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Event</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Club</label>
                <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select a club</option>
                    {myClubs.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                </select>
            </div>

            {selectedClub && (
                <div className="bg-white rounded-xl shadow-lg">
                    <div className="flex border-b">
                        {['members', 'requests', 'settings'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 px-6 py-4 text-center ${activeTab === tab
                                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'members' && (
                            <div className="space-y-4">
                                {clubMembers.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No members found</p>
                                ) : (
                                    clubMembers.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{member.profile?.full_name ?? 'Unknown Member'}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {member.position} • Joined {new Date(member.joined_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMember(member.user_id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div className="space-y-4">
                                {membershipRequests.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No pending requests</p>
                                ) : (
                                    membershipRequests.map(request => (
                                        <div
                                            key={request.id}
                                            className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg space-y-2 md:space-y-0 md:space-x-4"
                                        >
                                            <div>
                                                <h4 className="font-medium text-gray-900">{request.profile?.full_name ?? 'Unknown Member'}</h4>
                                                <p className="text-sm text-gray-500">
                                                    Requested on {new Date(request.joined_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <select
                                                value={assignRoles[request.id] || 'member'}
                                                onChange={(e) =>
                                                    setAssignRoles(prev => ({ ...prev, [request.id]: e.target.value }))
                                                }
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            >
                                                {roleOptions.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleApproveRequest(request.id, assignRoles[request.id] || 'member')}
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(request.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter club name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        placeholder="Enter club description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="Academic">Academic</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Social Service">Social Service</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubManagement;
