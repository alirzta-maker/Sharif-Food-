
import React from 'react';

interface NavItem {
  icon: string;
  label: string;
  page: string;
}

interface BottomNavProps {
  navItems: NavItem[];
  activePage: string;
  onNavigate: (page: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ navItems, activePage, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-3 border-black shadow-lg">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center justify-center w-full py-2 px-1 text-center transition-transform duration-200 ease-in-out transform hover:scale-110 ${
              activePage === item.page ? 'text-black' : 'text-gray-400'
            }`}
          >
            <span className="text-3xl">{item.icon}</span>
            <span className={`text-xs font-bold ${activePage === item.page ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
