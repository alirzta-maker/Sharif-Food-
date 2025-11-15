import React, { useState, createContext, useMemo } from 'react';
import { Role, Language, CartItem, User, Order } from './types';
import LoginPage from './pages/Login';
import RoleSelectorPage from './pages/RoleSelector';
import GirApp from './pages/gir/GirApp';
import BarApp from './pages/bar/BarApp';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  activeOrder: Order | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(Role.NONE);
  const [language, setLanguage] = useState<Language>('fa');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    role, setRole, language, setLanguage, isLoggedIn, setIsLoggedIn, cart, setCart, user, setUser, activeOrder, setActiveOrder
  }), [role, language, isLoggedIn, cart, user, activeOrder]);
  
  const AppForState = () => {
    if (!isLoggedIn) {
      return <LoginPage />;
    }
    // If logged in but no role selected yet (e.g., after registration)
    if (role === Role.NONE && user) {
      return <RoleSelectorPage />;
    }
    switch (role) {
      case Role.GIR:
        return <GirApp />;
      case Role.BAR:
        return <BarApp />;
      default:
        // Fallback to login if state is invalid (e.g., user is null or role is NONE but not just registered)
        return <LoginPage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`min-h-screen bg-black text-gray-800 font-sans`}>
        <AppForState />
      </div>
    </AppContext.Provider>
  );
};

export default App;
