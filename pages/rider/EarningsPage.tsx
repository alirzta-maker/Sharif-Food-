import React from 'react';
import { MOCK_DELIVERIES } from '../../constants';
// FIX: Import DeliveryStatus to use for type-safe comparison.
import { DeliveryStatus } from '../../types';

const RiderEarningsCard: React.FC<{ title: string; amount: number; icon: string }> = ({ title, amount, icon }) => (
    <div className="bg-gradient-to-br from-white to-gray-100 border-3 border-black rounded-4xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 font-semibold">{title}</p>
                <p className="text-3xl font-extrabold">{amount.toLocaleString()} Toman</p>
            </div>
            <div className="text-5xl">{icon}</div>
        </div>
    </div>
);

const EarningsPage: React.FC = () => {
    const totalEarnings = MOCK_DELIVERIES.reduce((sum, d) => sum + d.earnings, 0);
    // FIX: Use DeliveryStatus enum for type-safe comparison. This resolves the type overlap error.
    const completedDeliveries = MOCK_DELIVERIES.filter(d => d.status === DeliveryStatus.DELIVERED).length;

    return (
        <div className="p-4">
            <h1 className="text-4xl font-extrabold mb-6">Earnings Summary</h1>
            <div className="space-y-6">
                <RiderEarningsCard title="Today's Earnings" amount={totalEarnings} icon="☀️" />
                <RiderEarningsCard title="This Week" amount={totalEarnings * 5 + 45000} icon="📅" />
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Recent Deliveries</h2>
                <div className="space-y-3">
                    {MOCK_DELIVERIES.slice(0, 3).map(delivery => (
                        <div key={delivery.id} className="bg-white border-2 border-black rounded-3xl p-4 flex justify-between items-center shadow-sm">
                            <div>
                                <h4 className="font-bold">{delivery.restaurantName}</h4>
                                <p className="text-sm text-gray-500">{delivery.customerAddress}</p>
                            </div>
                            <span className="font-bold text-neo-green">+{delivery.earnings.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EarningsPage;
