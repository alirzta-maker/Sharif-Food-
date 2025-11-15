

import React, { useState } from 'react';
// FIX: CartItem is now defined and exported from types.ts
import { CartItem } from '../../types';

// FIX: Update mock cart data to match CartItem type with bilingual names
const initialCartItems: CartItem[] = [
  { id: 'sff-p4', restaurantId: '1', category: { en: 'Pizza', fa: 'پیتزا' }, name: { en: 'Special Pizza', fa: 'پیتزا مخصوص' }, price: 215000, quantity: 1 },
  { id: 'sff-a2', restaurantId: '1', category: { en: 'Appetizers', fa: 'پیش غذا' }, name: { en: 'French Fries', fa: 'سیب زمینی' }, price: 85000, quantity: 2 },
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 25000;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-extrabold p-4">Your Cart 🛒</h1>
      
      <div className="flex-grow overflow-y-auto px-4">
        {/* FIX: Use english name for key and render persian name */}
        {cartItems.map((item) => (
          <div key={item.name.en} className="bg-white border-2 border-black rounded-3xl p-4 flex justify-between items-center shadow-sm mb-3">
            <div>
              <h4 className="font-bold">{item.name.fa}</h4>
              <p className="text-gray-600">{item.price.toLocaleString()} Toman</p>
            </div>
            <div className="flex items-center gap-2 font-bold">
                <button className="w-8 h-8 rounded-full border-2 border-black">-</button>
                <span>{item.quantity}</span>
                <button className="w-8 h-8 rounded-full border-2 border-black bg-neo-accent">+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t-3 border-black">
        <div className="mb-4">
            <input type="text" placeholder="Enter promo code" className="w-full py-3 px-4 bg-gray-100 border-2 border-black rounded-3xl focus:outline-none focus:ring-2 focus:ring-neo-green"/>
        </div>
        <div className="space-y-2 text-lg">
            <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span>{deliveryFee.toLocaleString()}</span></div>
            <div className="flex justify-between font-extrabold text-xl"><span>Total</span><span>{total.toLocaleString()} Toman</span></div>
        </div>
        <button className="w-full mt-4 bg-neo-green text-white font-bold py-4 rounded-3xl border-3 border-black shadow-lg transform hover:scale-105 active:scale-95 transition-transform">
          Go to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;