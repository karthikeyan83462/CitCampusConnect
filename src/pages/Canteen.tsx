import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { fetchItems, addToCart, placeOrder, clearCart } from '../store/slices/canteenSlice';
import FoodItemCard from '../components/Canteen/FoodItemCard';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../store/store';

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
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Canteen</h1>
          <p className="text-gray-600 mt-2">Fresh, delicious meals delivered to your location</p>
        </div>
        
        <button
          onClick={() => setShowCart(true)}
          className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all flex items-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <FoodItemCard
            key={item.id}
            item={item}
            quantity={cart.find(c => c.item.id === item.id)?.quantity || 0}
            onQuantityChange={(quantity) => handleQuantityChange(item, quantity)}
          />
        ))}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Your Order</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(cartItem => (
                    <div key={cartItem.item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{cartItem.item.name}</h4>
                        <p className="text-sm text-gray-600">₹{cartItem.item.price} × {cartItem.quantity}</p>
                      </div>
                      <div className="font-bold text-gray-900">
                        ₹{cartItem.item.price * cartItem.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">₹{cartTotal}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Canteen;