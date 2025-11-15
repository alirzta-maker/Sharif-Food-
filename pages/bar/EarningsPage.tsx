import React from 'react';
import { useTranslation } from '../../i18n';
import { MOCK_RIDER_JOBS } from '../../data';

const EarningStatCard = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
    <div className="bg-white p-4 border-3 border-black rounded-5xl shadow-study flex items-center justify-between">
        <div>
            <p className="text-gray-600 font-semibold">{label}</p>
            <p className="text-2xl font-extrabold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
    </div>
);


const EarningsPage: React.FC = () => {
    const { t, direction } = useTranslation();
    // Dummy calculation
    const totalEarnings = 125000;
    const totalDeliveries = MOCK_RIDER_JOBS.length;
    
    return (
        <div dir={direction}>
            <h1 className="text-3xl font-extrabold mb-4">{t('earning_summary')}</h1>
            <div className="space-y-4">
                <EarningStatCard label="Total Deliveries" value={`${totalDeliveries}`} icon="📦" />
                <EarningStatCard label="Total Earnings" value={`${totalEarnings.toLocaleString()} T`} icon="💰" />
                <EarningStatCard label="Avg. Delivery Time" value="23 min" icon="⏱️" />
            </div>
        </div>
    );
};

export default EarningsPage;