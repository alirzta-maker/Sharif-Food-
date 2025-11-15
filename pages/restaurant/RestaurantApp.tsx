
import React, { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import OrdersDashboard from './OrdersDashboard';
import MenuManagementPage from './MenuManagementPage';
import AccountPage from '../customer/AccountPage'; // Reusing for logout functionality

interface RestaurantAppProps {
  onLogout: () => void;
}

const RestaurantApp: React.FC<RestaurantAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('Orders');

  const navItems = [
    { icon: '📋', label: 'Orders', page: 'Orders' },
    { icon: '📝', label: 'Menu', page: 'Menu' },
    { icon: '👤', label: 'Account', page: 'Account' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'Orders':
        return <OrdersDashboard />;
      case 'Menu':
        return <MenuManagementPage />;
      case 'Account':
        return <AccountPage onLogout={onLogout} />;
      default:
        return <OrdersDashboard />;
    }
  };

  return (
    <div className="pb-20">
      {renderPage()}
      <BottomNav navItems={navItems} activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
};

export default RestaurantApp;
