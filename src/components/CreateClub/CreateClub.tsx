import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { RootState } from '../../store/store';

interface CreateClubProps {
  onSuccess?: () => void;
}

const CreateClub: React.FC<CreateClubProps> = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [loading, setLoading] = useState(false);

  const handleCreateClub = async () => {
    if (!user?.id) return toast.error('You must be logged in');
    if (!name.trim()) return toast.error('Club name is required');

    setLoading(true);
    const { data, error } = await supabase.from('clubs').insert({
      name,
      description,
      category,
      is_active: true,
      club_head_id: user.id
    });

    setLoading(false);

    if (error) {
      toast.error('Failed to create club');
      console.error(error);
    } else {
      toast.success('Club created successfully');
      setName('');
      setDescription('');
      setCategory('Academic');
      onSuccess?.(); // ✅ Notify parent on success
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold mb-2">Create a New Club</h2>

      <input
        type="text"
        placeholder="Club Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      >
        <option value="Academic">Academic</option>
        <option value="Sports">Sports</option>
        <option value="Cultural">Cultural</option>
        <option value="Technical">Technical</option>
        <option value="Social Service">Social Service</option>
        <option value="Arts">Arts</option>
      </select>

      <button
        onClick={handleCreateClub}
        disabled={loading}
        className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        {loading ? 'Creating...' : 'Create Club'}
      </button>
    </div>
  );
};

export default CreateClub;
