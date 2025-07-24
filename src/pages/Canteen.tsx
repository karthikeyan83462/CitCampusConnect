import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Search, Filter, X, UtensilsCrossed } from 'lucide-react';
import { fetchItems, addToCart, placeOrder, clearCart } from '../store/slices/canteenSlice';
import FoodItemCard from '../components/Canteen/FoodItemCard';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../store/store';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CanteenContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 24rem;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #f59e0b;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const HeaderSubtitle = styled.p`
  color: #64748b;
  margin: 0.5rem 0 0 0;
  font-size: 1.125rem;
`;

const CartButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  align-self: flex-start;
  
  @media (min-width: 768px) {
    align-self: center;
  }
  
  &:hover {
    background: linear-gradient(135deg, #ea580c, #dc2626);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
  }
`;

const CartIcon = styled(ShoppingCart)`
  width: 1.25rem;
  height: 1.25rem;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: white;
  color: #f59e0b;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
`;

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InputContainer = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 0.75rem 0.875rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.875rem 0.75rem 0.875rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CartModalOverlay = styled.div`
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

const CartModalContent = styled.div`
  background-color: white;
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const CartModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const CartModalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: #64748b;
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #334155;
  }
`;

const CloseIcon = styled(X)`
  width: 1.25rem;
  height: 1.25rem;
`;

const CartModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 24rem;
`;

const EmptyCart = styled.p`
  color: #64748b;
  text-align: center;
  padding: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CartItemInfo = styled.div``;

const CartItemName = styled.h4`
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
`;

const CartItemDetails = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const CartItemPrice = styled.div`
  font-weight: 700;
  color: #1e293b;
`;

const CartModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
`;

const CartTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
`;

const TotalAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #ea580c, #dc2626);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
  }
`;

const SearchIcon = styled(Search)`
  width: 1.25rem;
  height: 1.25rem;
`;

const FilterIcon = styled(Filter)`
  width: 1.25rem;
  height: 1.25rem;
`;

const Canteen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, cart, loading } = useSelector((state: RootState) => state.canteen);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleQuantityChange = (item: any, quantity: number) => {
    if (quantity > 0) {
      dispatch(addToCart({ item, quantity: quantity - (cart.find(c => c.item.id === item.id)?.quantity || 0) }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) return;

    const orderItems = cart.map(cartItem => ({
      item_id: cartItem.item.id,
      quantity: cartItem.quantity,
      price: cartItem.item.price,
    }));

    const totalAmount = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);

    try {
      await dispatch(placeOrder({
        user_id: user.id,
        items: orderItems,
        total_amount: totalAmount,
        delivery_type: 'pickup',
        status: 'pending',
      })).unwrap();
      
      toast.success('Order placed successfully!');
      setShowCart(false);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const categories = ['Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Desserts'];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <CanteenContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderTitle>Campus Canteen</HeaderTitle>
          <HeaderSubtitle>Fresh, delicious meals delivered to your location</HeaderSubtitle>
        </HeaderContent>
        
        <CartButton onClick={() => setShowCart(true)}>
          <CartIcon />
          <span>Cart</span>
          {cartItemsCount > 0 && (
            <CartBadge>{cartItemsCount}</CartBadge>
          )}
        </CartButton>
      </Header>

      {/* Filters */}
      <FiltersContainer>
        <FiltersGrid>
          <InputContainer>
            <InputIcon>
              <SearchIcon />
            </InputIcon>
            <SearchInput
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputContainer>
          
          <InputContainer>
            <InputIcon>
              <FilterIcon />
            </InputIcon>
            <FilterSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterSelect>
          </InputContainer>
        </FiltersGrid>
      </FiltersContainer>

      {/* Menu Items */}
      <MenuGrid>
        {filteredItems.map(item => (
          <FoodItemCard
            key={item.id}
            item={item}
            quantity={cart.find(c => c.item.id === item.id)?.quantity || 0}
            onQuantityChange={(quantity) => handleQuantityChange(item, quantity)}
          />
        ))}
      </MenuGrid>

      {/* Cart Modal */}
      {showCart && (
        <CartModalOverlay>
          <CartModalContent>
            <CartModalHeader>
              <CartModalTitle>
                <CartTitle>Your Order</CartTitle>
                <CloseButton onClick={() => setShowCart(false)}>
                  <CloseIcon />
                </CloseButton>
              </CartModalTitle>
            </CartModalHeader>
            
            <CartModalBody>
              {cart.length === 0 ? (
                <EmptyCart>Your cart is empty</EmptyCart>
              ) : (
                <div>
                  {cart.map(cartItem => (
                    <CartItem key={cartItem.item.id}>
                      <CartItemInfo>
                        <CartItemName>{cartItem.item.name}</CartItemName>
                        <CartItemDetails>₹{cartItem.item.price} × {cartItem.quantity}</CartItemDetails>
                      </CartItemInfo>
                      <CartItemPrice>
                        ₹{cartItem.item.price * cartItem.quantity}
                      </CartItemPrice>
                    </CartItem>
                  ))}
                </div>
              )}
            </CartModalBody>
            
            {cart.length > 0 && (
              <CartModalFooter>
                <CartTotal>
                  <TotalLabel>Total:</TotalLabel>
                  <TotalAmount>₹{cartTotal}</TotalAmount>
                </CartTotal>
                <PlaceOrderButton onClick={handlePlaceOrder}>
                  Place Order
                </PlaceOrderButton>
              </CartModalFooter>
            )}
          </CartModalContent>
        </CartModalOverlay>
      )}
    </CanteenContainer>
  );
};

export default Canteen;