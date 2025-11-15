import React, { useState } from 'react';
import { Header } from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import OrdersDashboard from './OrdersDashboard';
import ActiveDeliveriesPage from './ActiveDeliveriesPage';
import EarningsPage from './EarningsPage';
import AccountPage from './AccountPage'; // Updated to use the new Rider-specific AccountPage
import { Role } from '../../types';
import Chatbot from '../../components/Chatbot'; // Import the new Chatbot component

const BarApp: React.FC = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State for chatbot visibility

    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <OrdersDashboard />;
            case 'Earnings':
                return <EarningsPage />;
            case 'Active':
                return <ActiveDeliveriesPage />;
            case 'Account':
                return <AccountPage />; // Using the new Rider-specific AccountPage
            default:
                return <OrdersDashboard />;
        }
    };

    return (
        <div className="bg-sharif-yellow min-h-screen pb-24"> {/* Removed max-w-2xl mx-auto and bg-sharif-mint */}
            <Header />
            <main className="p-4">{renderPage()}</main>
            <BottomNav role={Role.BAR} activePage={activePage} onNavigate={setActivePage} />

            {/* Floating Action Button for Chatbot */}
            <button
                onClick={() => setIsChatbotOpen(true)}
                className="fixed bottom-24 right-6 bg-sharif-bar text-white w-16 h-16 rounded-full text-4xl font-bold border-3 border-black shadow-study transform hover:scale-110 active:scale-95 transition-transform flex items-center justify-center z-40"
                aria-label="Open AI Assistant"
            >
                💬
            </button>

            {/* Chatbot Modal */}
            {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
        </div>
    );
};

export default BarApp;