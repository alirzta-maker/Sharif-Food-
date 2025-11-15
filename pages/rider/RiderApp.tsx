
import React, { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import GearOrdersPage from './GearOrdersPage';
import EarningsPage from './EarningsPage';
import AccountPage from '../customer/AccountPage'; // Reusing for logout functionality

interface RiderAppProps {
  onLogout: () => void;
}

const RiderApp: React.FC<RiderAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('Orders');

  const navItems = [
    { icon: '🛵', label: 'Orders', page: 'Orders' },
    { icon: '💳', label: 'Earnings', page: 'Earnings' },
    { icon: '👤', label: 'Profile', page: 'Profile' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'Orders':
        return <GearOrdersPage />;
      case 'Earnings':
        return <EarningsPage />;
      case 'Profile':
        return <AccountPage onLogout={onLogout} />;
      default:
        return <GearOrdersPage />;
    }
  };

  return (
    <div className="pb-20">
      {renderPage()}
      <BottomNav navItems={navItems} activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
};

export default RiderApp;
