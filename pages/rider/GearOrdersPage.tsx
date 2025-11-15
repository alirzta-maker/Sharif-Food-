
import React from 'react';
import { MOCK_DELIVERIES } from '../../constants';
import { Delivery, DeliveryStatus } from '../../types';

interface DeliveryStatusCardProps {
    delivery: Delivery;
}

const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
        case DeliveryStatus.ASSIGNED: return 'bg-blue-200 text-blue-800';
        case DeliveryStatus.PICKED_UP: return 'bg-purple-200 text-purple-800';
        case DeliveryStatus.ON_THE_WAY: return 'bg-orange-200 text-orange-800';
        case DeliveryStatus.DELIVERED: return 'bg-green-200 text-green-800';
        default: return 'bg-gray-200 text-gray-800';
    }
};

const DeliveryStatusCard: React.FC<DeliveryStatusCardProps> = ({ delivery }) => {
    return (
        <div className="bg-white border-3 border-black rounded-4xl p-5 mb-4 shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">{delivery.restaurantName}</h3>
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(delivery.status)}`}>
                    {delivery.status}
                </span>
            </div>
            <p className="text-gray-600 mb-4">{delivery.customerAddress}</p>
            <div className="text-right font-bold text-lg text-neo-green">
                + {delivery.earnings.toLocaleString()} Toman
            </div>
        </div>
    );
};

const GearOrdersPage: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-4xl font-extrabold mb-6">Active Deliveries</h1>
            <div>
                {MOCK_DELIVERIES.map(delivery => (
                    <DeliveryStatusCard key={delivery.id} delivery={delivery} />
                ))}
            </div>
        </div>
    );
};

export default GearOrdersPage;
