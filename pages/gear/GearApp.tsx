import React, { useState } from 'react';
import HomePage from './HomePage';
import MenuPage from './MenuPage';
import { Restaurant } from '../../types';
// FIX: Corrected import path for Header component.
import { Header } from '../../components/Header';
import { RESTAURANTS } from '../../data';

const GearApp: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const handleSelectRestaurant = (restaurantId: string) => {
    const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
    }
  };

  const handleBack = () => {
    setSelectedRestaurant(null);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Header />
      <main className="p-4">
        {selectedRestaurant ? (
          <MenuPage restaurant={selectedRestaurant} onBack={handleBack} />
        ) : (
          <HomePage onSelectRestaurant={handleSelectRestaurant} />
        )}
      </main>
    </div>
  );
};

export default GearApp;
