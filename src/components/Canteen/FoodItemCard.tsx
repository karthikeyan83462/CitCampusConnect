import React from 'react';
import { Plus, Minus } from 'lucide-react';
import type { Database } from '../../lib/supabase';

type CanteenItem = Database['public']['Tables']['canteen_items']['Row'];

interface FoodItemCardProps {
  item: CanteenItem;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, quantity, onQuantityChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-2xl font-bold">
            {item.name.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mt-1">
              {item.category}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₹{item.price}</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold min-w-[2rem] text-center">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {quantity > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-bold text-orange-600">₹{item.price * quantity}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;