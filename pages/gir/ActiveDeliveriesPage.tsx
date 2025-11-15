import React, { useContext } from 'react';
import { useTranslation } from '../../i18n';
import { MOCK_CUSTOMER_ORDERS } from '../../data';
// FIX: Import OrderFlowStatus to use for type-safe comparisons
import { Order, OrderFlowStatus } from '../../types';
import { AppContext } from '../../App';

interface CustomerOrderCardProps {
    order: Order;
}

// FIX: Update getStatusColor to use OrderFlowStatus enum for type-safe comparisons
const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case OrderFlowStatus.AWAITING_PAYMENT:
        case OrderFlowStatus.SEARCHING_FOR_COURIER:
            return 'bg-yellow-200 text-yellow-800';
        case OrderFlowStatus.PAYMENT_CONFIRMED:
        case OrderFlowStatus.DELIVERY_IN_PROGRESS:
            return 'bg-blue-200 text-blue-800';
        case OrderFlowStatus.DELIVERED:
            return 'bg-green-200 text-green-800';
        case OrderFlowStatus.CANCELLED_BY_COURIER:
        case OrderFlowStatus.CANCELLED_BY_USER:
             return 'bg-red-200 text-red-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
};

const CustomerOrderCard: React.FC<CustomerOrderCardProps> = ({ order }) => {
    const { language, direction } = useTranslation();
    const { user } = useContext(AppContext);

    // Filter items to show only relevant ones (e.g., exclude add-ons for simpler display)
    const displayItems = order.items.map(item => `${item.name[language]} x${item.quantity}`).join(', ');

    if (!user || user.id !== order.userId) {
      return null; // Only show orders for the current logged-in user
    }

    return (
        <div dir={direction} className="bg-white border-3 border-black rounded-5xl p-5 mb-4 shadow-study">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">{order.restaurantName?.[language] || 'Unknown Restaurant'}</h3>
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                </span>
            </div>
            <p className="text-gray-600 mb-2">Order Code: {order.code}</p>
            <p className="text-gray-600 mb-4">Items: {displayItems}</p>
            <div className="text-right font-bold text-lg text-sharif-gir">
                Total: {order.total.toLocaleString()} Toman
            </div>
        </div>
    );
};

const CustomerActiveDeliveriesPage: React.FC = () => {
    const { t, direction } = useTranslation();
    const { user } = useContext(AppContext);

    const currentUserOrders = MOCK_CUSTOMER_ORDERS.filter(order => user && order.userId === user.id);

    return (
        <div dir={direction}>
            <h1 className="text-3xl font-extrabold mb-4">{t('active_deliveries')}</h1>
            <div>
                {currentUserOrders.length > 0 ? (
                    currentUserOrders.map(order => (
                        <CustomerOrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-8">No active or past orders found.</p>
                )}
            </div>
        </div>
    );
};

export default CustomerActiveDeliveriesPage;
