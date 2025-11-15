import React, { useContext } from 'react';
import { useTranslation } from '../i18n';
import { Role } from '../types';
import { AppContext } from '../App';

type NavItemKey = 'home' | 'cart' | 'account' | 'order_dashboard' | 'earning_summary' | 'active_deliveries';

interface NavItem {
  icon: string;
  labelKey: NavItemKey;
  page: string;
}

const GIR_NAV: NavItem[] = [
    { icon: '🏠', labelKey: 'home', page: 'Home' },
    { icon: '🛒', labelKey: 'cart', page: 'Cart' },
    { icon: '⚡', labelKey: 'active_deliveries', page: 'CustomerActiveDeliveries' }, // Renamed from customer_active_deliveries
    { icon: '👤', labelKey: 'account', page: 'Account' },
];

const BAR_NAV: NavItem[] = [
    { icon: '📋', labelKey: 'order_dashboard', page: 'Dashboard' },
    { icon: '💳', labelKey: 'earning_summary', page: 'Earnings' },
    { icon: '⚡', labelKey: 'active_deliveries', page: 'Active' },
    { icon: '👤', labelKey: 'account', page: 'Account' },
];

// FIX: Define BottomNavProps interface
interface BottomNavProps {
  role: Role;
  activePage: string;
  onNavigate: (page: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ role, activePage, onNavigate }) => {
    const { t } = useTranslation();
    const { cart } = useContext(AppContext);
    const navItems = role === Role.GIR ? GIR_NAV : BAR_NAV;
    const activeColor = role === Role.GIR ? 'text-sharif-gir' : 'text-sharif-bar';
    const cartItemCount = cart.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-sharif-mint z-20"> {/* Removed border-t-3 and shadow-lg */}
      <div className="flex justify-around max-w-2xl mx-auto gap-2"> {/* Added gap for better spacing between icons */}
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`relative flex flex-col items-center justify-center flex-1 py-2 px-1 text-center transition-transform duration-200 ease-in-out transform hover:scale-110 group ${
              activePage === item.page ? activeColor : 'text-gray-600' // Changed text-gray-400 to text-gray-600 for better visibility when inactive
            }`}
          >
            <span className="text-3xl mb-1">{item.icon}</span> {/* Added mb-1 for space between icon and label */}
            <span className={`text-xs transition-opacity duration-200 opacity-100 ${activePage === item.page ? 'font-bold' : ''}`}>{t(item.labelKey)}</span> {/* Labels always visible, font-bold only when active */}
            {item.page === 'Cart' && role === Role.GIR && cartItemCount > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-4 w-5 h-5 bg-sharif-gir text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;