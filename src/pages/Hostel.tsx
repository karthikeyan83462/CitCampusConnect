import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Building, AlertTriangle, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchComplaints, submitComplaint } from '../store/slices/hostelSlice';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../store/store';
import type { Database } from '../lib/supabase';

type ComplaintFormData = Database['public']['Tables']['hostel_complaints']['Insert'];

const Hostel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, loading } = useSelector((state: RootState) => state.hostel);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComplaintFormData>();

  useEffect(() => {
    if (user) {
      dispatch(fetchComplaints(user.id));
    }
  }, [dispatch, user]);

  const onSubmitComplaint = async (data: ComplaintFormData) => {
    if (!user) return;

    try {
      await dispatch(submitComplaint({
        ...data,
        user_id: user.id,
        status: 'open',
        priority: 'medium',
      })).unwrap();
      
      toast.success('Complaint submitted successfully!');
      reset();
      setShowComplaintForm(false);
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Services</h1>
          <p className="text-gray-600 mt-2">Manage your room allocation and submit maintenance requests</p>
        </div>
        
        <button
          onClick={() => setShowComplaintForm(true)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Submit Complaint</span>
        </button>
      </div>

      {/* Room Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Room Details</h3>
            <Building className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Block: <span className="font-medium text-gray-900">{user?.hostel_block || 'Not Assigned'}</span></p>
            <p className="text-gray-600">Room: <span className="font-medium text-gray-900">{user?.room_number || 'Not Assigned'}</span></p>
            <p className="text-gray-600">Occupancy: <span className="font-medium text-green-600">Active</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-2">
            <p className="text-gray-600">Total Complaints: <span className="font-medium text-gray-900">{complaints.length}</span></p>
            <p className="text-gray-600">Open: <span className="font-medium text-yellow-600">{complaints.filter(c => c.status === 'open').length}</span></p>
            <p className="text-gray-600">Resolved: <span className="font-medium text-green-600">{complaints.filter(c => c.status === 'resolved').length}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hostel Rules</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Quiet hours: 10 PM - 6 AM</p>
            <p>• No outside visitors after 9 PM</p>
            <p>• Keep common areas clean</p>
            <p>• Report maintenance issues promptly</p>
          </div>
        </div>
      </div>

      {/* Complaints */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">My Complaints</h3>
        
        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No complaints submitted</h4>
            <p className="text-gray-600">Submit your first maintenance request to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map(complaint => (
              <div key={complaint.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(complaint.status)}
                      <h4 className="text-lg font-medium text-gray-900">{complaint.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{complaint.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {complaint.category}</span>
                      <span>Created: {new Date(complaint.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      complaint.status === 'resolved' 
                        ? 'bg-green-100 text-green-800'
                        : complaint.status === 'in_progress'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Submit Complaint</h3>
                <button
                  onClick={() => setShowComplaintForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitComplaint)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Brief description of the issue"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Detailed description of the issue"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hostel;