import React from 'react';
import { Plus, Minus, UtensilsCrossed } from 'lucide-react';
import type { Database } from '../../lib/supabase';
import styled from 'styled-components';

type CanteenItem = Database['public']['Tables']['canteen_items']['Row'];

interface FoodItemCardProps {
  item: CanteenItem;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const CardContainer = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  height: 12rem;
  background: linear-gradient(135deg, #fb923c, #ef4444);
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 640px) {
    height: 14rem;
  }
`;

const FoodImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fb923c, #ef4444);
`;

const PlaceholderText = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: 700;
  
  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  background-color: #fed7aa;
  color: #ea580c;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
`;

const PriceContainer = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const ItemDescription = styled.p`
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuantityButton = styled.button<{ variant: 'add' | 'remove' }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  
  ${props => props.variant === 'add' ? `
    background-color: #f59e0b;
    color: white;
    
    &:hover {
      background-color: #ea580c;
    }
  ` : `
    background-color: #e2e8f0;
    color: #64748b;
    
    &:hover:not(:disabled) {
      background-color: #cbd5e1;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`;

const ButtonIcon = styled.div`
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MinusIcon = styled(Minus)`
  width: 1rem;
  height: 1rem;
`;

const PlusIcon = styled(Plus)`
  width: 1rem;
  height: 1rem;
`;

const QuantityDisplay = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  min-width: 2rem;
  text-align: center;
  color: #1e293b;
`;

const TotalContainer = styled.div`
  text-align: right;
`;

const TotalLabel = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
`;

const TotalAmount = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: #f59e0b;
  margin: 0;
`;

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, quantity, onQuantityChange }) => {
  return (
    <CardContainer>
      <ImageContainer>
        {item.image_url ? (
          <FoodImage 
            src={item.image_url} 
            alt={item.name}
          />
        ) : (
          <PlaceholderImage>
            <PlaceholderText>
              {item.name.charAt(0)}
            </PlaceholderText>
          </PlaceholderImage>
        )}
      </ImageContainer>
      
      <CardContent>
        <CardHeader>
          <ItemInfo>
            <ItemName>{item.name}</ItemName>
            <CategoryBadge>{item.category}</CategoryBadge>
          </ItemInfo>
          <PriceContainer>
            <Price>₹{item.price}</Price>
          </PriceContainer>
        </CardHeader>
        
        <ItemDescription>{item.description}</ItemDescription>
        
        <CardFooter>
          <QuantityControls>
            <QuantityButton
              variant="remove"
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              disabled={quantity === 0}
            >
              <ButtonIcon>
                <MinusIcon />
              </ButtonIcon>
            </QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton
              variant="add"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <ButtonIcon>
                <PlusIcon />
              </ButtonIcon>
            </QuantityButton>
          </QuantityControls>
          
          {quantity > 0 && (
            <TotalContainer>
              <TotalLabel>Total</TotalLabel>
              <TotalAmount>₹{item.price * quantity}</TotalAmount>
            </TotalContainer>
          )}
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
};

export default FoodItemCard;