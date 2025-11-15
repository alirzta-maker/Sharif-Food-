
import React, { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import HomePage from './HomePage';
import MenuPage from './MenuPage';
import CartPage from './CartPage';
import AccountPage from './AccountPage';
import { restaurants } from '../../constants';
import { Restaurant } from '../../types';

interface CustomerAppProps {
  onLogout: () => void;
}

const CustomerApp: React.FC<CustomerAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('Home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const navItems = [
    { icon: '🏠', label: 'Home', page: 'Home' },
    { icon: '🛒', label: 'Cart', page: 'Cart' },
    { icon: '👤', label: 'Account', page: 'Account' },
  ];

  const handleSelectRestaurant = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        setSelectedRestaurant(restaurant);
        setActivePage('Menu');
    }
  };
  
  const handleBackToHome = () => {
    setSelectedRestaurant(null);
    setActivePage('Home');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'Home':
        return <HomePage onSelectRestaurant={handleSelectRestaurant} />;
      case 'Menu':
        return selectedRestaurant ? <MenuPage restaurant={selectedRestaurant} onBack={handleBackToHome}/> : <HomePage onSelectRestaurant={handleSelectRestaurant} />;
      case 'Cart':
        return <CartPage />;
      case 'Account':
        return <AccountPage onLogout={onLogout} />;
      default:
        return <HomePage onSelectRestaurant={handleSelectRestaurant} />;
    }
  };

  return (
    <div className="pb-20">
      {renderPage()}
      <BottomNav navItems={navItems} activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
};

export default CustomerApp;
