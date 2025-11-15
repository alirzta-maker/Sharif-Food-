
import React, { useState, useContext } from 'react';
import { Restaurant, OrderFlowStatus } from '../../types';
import { Header } from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import HomePage from './HomePage';
import MenuPage from './MenuPage';
import CartPage from './CartPage';
import AccountPage from './AccountPage';
import OrderStatusPage from './OrderStatusPage';
import CustomerActiveDeliveriesPage from './ActiveDeliveriesPage'; // Import the list view
import { Role } from '../../types';
import { RESTAURANTS } from '../../data';
import Chatbot from '../../components/Chatbot';
import { AppContext } from '../../App';
import { useTranslation } from '../../i18n';


const GirApp: React.FC = () => {
  const { activeOrder } = useContext(AppContext);
  const [activePage, setActivePage] = useState('Home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { t } = useTranslation();

  const handleSelectRestaurant = (restaurantId: string) => {
    const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
    }
  };

  const handleBackFromMenu = () => {
    setSelectedRestaurant(null);
    setActivePage('Home');
  };
  
  const renderPage = () => {
    if (selectedRestaurant) {
      return <MenuPage restaurant={selectedRestaurant} onBack={handleBackFromMenu} />;
    }

    switch (activePage) {
      case 'Home':
        return <HomePage onSelectRestaurant={handleSelectRestaurant} />;
      case 'Cart':
        return <CartPage />;
      case 'Account':
        return <AccountPage />;
      case 'CustomerActiveDeliveries':
        // LOGIC: If there is an active order (not delivered/cancelled), show the Tracking Page.
        // Otherwise, show the Order List (History) page.
        if (activeOrder && activeOrder.status !== OrderFlowStatus.DELIVERED && activeOrder.status !== OrderFlowStatus.CANCELLED_BY_USER && activeOrder.status !== OrderFlowStatus.CANCELLED_BY_COURIER && activeOrder.status !== OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION) {
             return <OrderStatusPage />;
        }
        // If waiting for customer confirmation, we also show OrderStatusPage to allow them to confirm
        if (activeOrder && activeOrder.status === OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION) {
             return <OrderStatusPage />;
        }
        return <CustomerActiveDeliveriesPage />;
      default:
        return <HomePage onSelectRestaurant={handleSelectRestaurant} />;
    }
  };
  
  const handleNavigate = (page: string) => {
    if (selectedRestaurant) {
      setSelectedRestaurant(null);
    }
    setActivePage(page);
  };

  return (
    <div className="bg-sharif-yellow min-h-screen pb-24">
      <Header />
      <main className="p-4">
        {renderPage()}
      </main>
      
      <BottomNav role={Role.GIR} activePage={activePage} onNavigate={handleNavigate} />

      {/* Floating "View Active Order" button REMOVED per request. 
          Active orders are now only accessible via the 'CustomerActiveDeliveries' tab. 
      */}

      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-24 right-6 bg-sharif-gir text-white w-16 h-16 rounded-full text-4xl font-bold border-3 border-black shadow-study transform hover:scale-110 active:scale-95 transition-transform flex items-center justify-center z-40"
        aria-label="Open AI Assistant"
      >
        💬
      </button>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
};

export default GirApp;
