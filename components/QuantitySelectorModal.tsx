import React, { useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem } from '../types';
import { AppContext } from '../App';
import { useTranslation } from '../i18n';

interface QuantitySelectorModalProps {
  item: MenuItem;
  onClose: () => void;
  initialQuantity: number;
}

const QuantitySelectorModal: React.FC<QuantitySelectorModalProps> = ({ item, onClose, initialQuantity }) => {
  const { language } = useTranslation();
  const { setCart } = useContext(AppContext);
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity); // Sync quantity if initialQuantity changes (e.g., if item is added from outside)
  }, [initialQuantity]);

  const updateCart = () => {
    setCart(prevCart => {
      const existing = prevCart.find(c => c.id === item.id);
      if (quantity <= 0) {
        return prevCart.filter(c => c.id !== item.id);
      } else if (existing) {
        return prevCart.map(c => c.id === item.id ? { ...c, quantity: quantity } : c);
      } else {
        return [...prevCart, { ...item, quantity: quantity }];
      }
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // Close when clicking outside the modal content
    >
      <div 
        className="relative w-full max-w-sm bg-sharif-yellow border-3 border-black rounded-5xl shadow-study flex flex-col p-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl font-bold bouncy-button"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-extrabold mb-2">{item.name[language]}</h2>
        <p className="text-gray-700 text-xl font-semibold mb-4">{item.price.toLocaleString()} Toman</p>

        <div className="flex items-center justify-center gap-4 my-6">
          <button 
            onClick={() => setQuantity(prev => Math.max(0, prev - 1))} 
            className="w-12 h-12 rounded-full border-3 border-black bg-white flex items-center justify-center text-3xl font-bold bouncy-button"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-5xl font-extrabold min-w-[50px] text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(prev => prev + 1)} 
            className="w-12 h-12 rounded-full border-3 border-black bg-sharif-gir text-white flex items-center justify-center text-3xl font-bold bouncy-button"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button 
          onClick={updateCart} 
          className="w-full mt-4 p-4 bg-sharif-gir text-white font-bold rounded-4xl border-3 border-black shadow-lg bouncy-button"
        >
          {quantity > 0 ? (initialQuantity > 0 ? 'Update Cart' : 'Add to Cart') : 'Remove from Cart'}
        </button>
      </div>
    </div>
  );
};

export default QuantitySelectorModal;