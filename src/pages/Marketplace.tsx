import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Plus, Heart } from 'lucide-react';
import { fetchItems, addToWishlist, removeFromWishlist } from '../store/slices/marketplaceSlice';
import ProductCard from '../components/Marketplace/ProductCard';
import SellItemModal from '../components/Marketplace/SellItemModal';
import type { RootState, AppDispatch } from '../store/store';

const Marketplace: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, wishlist, loading } = useSelector((state: RootState) => state.marketplace);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleWishlistToggle = (itemId: string) => {
    if (wishlist.includes(itemId)) {
      dispatch(removeFromWishlist(itemId));
    } else {
      dispatch(addToWishlist(itemId));
    }
  };

  const categories = ['Books', 'Electronics', 'Clothing', 'Furniture', 'Sports', 'Other'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesWishlist = !showWishlistOnly || wishlist.includes(item.id);
    return matchesSearch && matchesCategory && matchesWishlist;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Marketplace</h1>
          <p className="text-gray-600 mt-2">Buy and sell items with your fellow students</p>
        </div>
        {user && (
          <button
            onClick={() => setIsSellModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Sell Item</span>
          </button>
        )}

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
              showWishlistOnly
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${showWishlistOnly ? 'fill-current' : ''}`} />
            <span>Wishlist Only</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{items.length}</div>
          <div className="text-gray-600">Items Available</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
          <div className="text-gray-600">Categories</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{wishlist.length}</div>
          <div className="text-gray-600">Wishlisted</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ₹{items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
          </div>
          <div className="text-gray-600">Total Value</div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <ProductCard
            key={item.id}
            item={item}
            isWishlisted={wishlist.includes(item.id)}
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-300 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Sell Item Modal */}
      {user && (
        <SellItemModal
          isOpen={isSellModalOpen}
          onClose={() => setIsSellModalOpen(false)}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default Marketplace;