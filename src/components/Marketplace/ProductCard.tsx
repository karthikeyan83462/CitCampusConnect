import React from 'react';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Database } from '../../lib/supabase';

type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row'];

interface ProductCardProps {
  item: MarketplaceItem;
  isWishlisted?: boolean;
  onWishlistToggle?: (itemId: string) => void;
  onContact?: (sellerId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  item, 
  isWishlisted, 
  onWishlistToggle,
  onContact 
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like_new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-500">
        {item.images?.[0] ? (
          <img 
            src={item.images[0]} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-3xl font-bold">
              {item.title.charAt(0)}
            </div>
          </div>
        )}
        
        <button
          onClick={() => onWishlistToggle?.(item.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <Heart 
            className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
          />
        </button>
        
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
            {item.condition.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{item.title}</h3>
          <div className="text-right ml-4">
            <p className="text-2xl font-bold text-gray-900">₹{item.price}</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
            {item.category}
          </span>
          <span className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </span>
        </div>
        
        <button
          onClick={() => onContact?.(item.seller_id)}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact Seller</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;