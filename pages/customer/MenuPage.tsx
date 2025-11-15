

import React from 'react';
// FIX: CartItem is now defined and exported from types.ts
import { Restaurant, MenuItem, CartItem } from '../../types';
import { CATEGORY_ICONS } from '../../constants';

const FoodItemCard: React.FC<{ item: MenuItem; onAdd: () => void }> = ({ item, onAdd }) => (
  <div className="bg-white border-2 border-black rounded-3xl p-4 flex justify-between items-center shadow-sm mb-3">
    <div>
      {/* FIX: Render Persian name from name object */}
      <h4 className="font-bold">{item.name.fa}</h4>
      <p className="text-gray-600">{item.price.toLocaleString()} Toman</p>
    </div>
    <button onClick={onAdd} className="bg-neo-green text-white w-10 h-10 rounded-full text-2xl font-bold border-2 border-black transform hover:scale-110 active:scale-95 transition-transform">+</button>
  </div>
);

interface MenuPageProps {
  restaurant: Restaurant;
  onBack: () => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ restaurant, onBack }) => {
  // In a real app, this would come from a global state/context
  const [cart, setCart] = React.useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      // FIX: Compare name objects by their content (e.g., english name) to check for existence
      const existingItem = prevCart.find(cartItem => cartItem.name.en === item.name.en);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.name.en === item.name.en ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-3xl mr-4 transform hover:scale-110 active:scale-95 transition-transform">‹</button>
        {/* FIX: Render logo component */}
        <div className="text-6xl mr-4">{React.createElement(restaurant.logo)}</div>
        {/* FIX: Render Persian name */}
        <h1 className="text-4xl font-extrabold">{restaurant.name.fa}</h1>
      </div>

      {/* FIX: Use a unique string from title object for the key */}
      {restaurant.menu?.map((category) => (
        <div key={category.title.en} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
             {/* FIX: Use english title for icon lookup which is a string */}
             <span className="text-3xl mr-3">{CATEGORY_ICONS[category.title.en] || '🍽️'}</span>
             {/* FIX: Render Persian title */}
             {category.title.fa}
          </h2>
          <div>
            {/* FIX: Use a unique string from item name object for the key */}
            {category.items.map((item) => (
              <FoodItemCard key={item.name.en} item={item} onAdd={() => addToCart(item)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuPage;
