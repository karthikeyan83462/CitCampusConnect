import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { RootState } from '../../store/store';
import styled from 'styled-components';

interface CreateClubProps {
  onSuccess?: () => void;
}

const CreateClubContainer = styled.div`
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CreateClubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const FormInput = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #1d4ed8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const ButtonIcon = styled(PlusCircle)`
  width: 1.25rem;
  height: 1.25rem;
`;

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
    <CreateClubContainer>
      <CreateClubTitle>Create a New Club</CreateClubTitle>

      <FormInput
        type="text"
        placeholder="Club Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <FormTextarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <FormSelect
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Academic">Academic</option>
        <option value="Sports">Sports</option>
        <option value="Cultural">Cultural</option>
        <option value="Technical">Technical</option>
        <option value="Social Service">Social Service</option>
        <option value="Arts">Arts</option>
      </FormSelect>

      <CreateButton
        onClick={handleCreateClub}
        disabled={loading}
      >
        <ButtonIcon />
        {loading ? 'Creating...' : 'Create Club'}
      </CreateButton>
    </CreateClubContainer>
  );
};

export default CreateClub;
