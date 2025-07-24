import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createItem } from '../../store/slices/marketplaceSlice';
import { X, Package, Tag, DollarSign, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import type { AppDispatch } from '../../store/store';
import styled from 'styled-components';

interface SellItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  max-width: 32rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitleText = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#475569' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
`;

const CloseIcon = styled(X)`
  width: 1.5rem;
  height: 1.5rem;
`;

const ModalForm = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  min-height: 6rem;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled(Package)`
  width: 1.25rem;
  height: 1.25rem;
`;

const SellItemModal: React.FC<SellItemModalProps> = ({ isOpen, onClose, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '' as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
    images: [] as string[],
  });

  const categories = ['Books', 'Electronics', 'Clothing', 'Furniture', 'Sports', 'Other'];
  const conditions: Array<'new' | 'like_new' | 'good' | 'fair' | 'poor'> = ['new', 'like_new', 'good', 'fair', 'poor'];
  const conditionLabels: Record<typeof conditions[number], string> = {
    'new': 'New',
    'like_new': 'Like New',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        seller_id: userId,
        is_available: true,
        // If no image URL is provided, set an empty array
        images: formData.images.length > 0 ? formData.images : []
      };

      await dispatch(createItem(submitData)).unwrap();
      toast.success('Item listed successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to list item');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <ModalTitleText>Sell an Item</ModalTitleText>
            <CloseButton onClick={onClose}>
              <CloseIcon />
            </CloseButton>
          </ModalTitle>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Title</FormLabel>
            <FormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter item title"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe your item..."
            />
          </FormGroup>

          <FormGrid>
            <FormGroup>
              <FormLabel>Price (₹)</FormLabel>
              <FormInput
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Category</FormLabel>
              <FormSelect
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </FormSelect>
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup>
              <FormLabel>Condition</FormLabel>
              <FormSelect
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{conditionLabels[condition]}</option>
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel>Image URL</FormLabel>
              <FormInput
                type="url"
                name="imageUrl"
                placeholder="https://..."
                onChange={(e) => {
                  const url = e.target.value.trim();
                  if (url) {
                    setFormData(prev => ({
                      ...prev,
                      images: [url]
                    }));
                  }
                }}
              />
            </FormGroup>
          </FormGrid>

          <SubmitButton type="submit">
            <ButtonIcon />
            List Item for Sale
          </SubmitButton>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SellItemModal;
