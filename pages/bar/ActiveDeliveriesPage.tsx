import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n';
import { api } from '../../api';
import { ActiveDelivery, OrderFlowStatus } from '../../types';

const ActiveDeliveryCard: React.FC<{ delivery: ActiveDelivery; onUpdateStatus: (id: string, status: 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED') => void; onConfirmPayment: (id: string) => void; }> = ({ delivery, onUpdateStatus, onConfirmPayment }) => {
    const { t, language, direction } = useTranslation();

    const getNextAction = () => {
        switch (delivery.status) {
            case 'AT_RESTAURANT':
                return { text: t('picked_up'), action: () => onUpdateStatus(delivery.id, 'PICKED_UP') };
            case 'PICKED_UP':
                return { text: t('on_the_way'), action: () => onUpdateStatus(delivery.id, 'ON_THE_WAY') };
            case 'ON_THE_WAY':
                return { text: t('delivered'), action: () => onUpdateStatus(delivery.id, 'DELIVERED') };
            default:
                return null;
        }
    };
    
    const action = getNextAction();

    return (
        <div className="bg-white border-3 border-black rounded-5xl p-4 mb-4 shadow-study">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-xl">{delivery.restaurantName[language]}</h3>
                <span className="text-sm font-bold bg-gray-200 px-2 py-1 rounded-full">{delivery.status}</span>
            </div>
             <p className="text-sm text-gray-600 mb-3">Customer: {delivery.customerName}</p>
             <div className="my-3 text-sm space-y-1">
                <p><span className="font-bold">{t('from')}:</span> {delivery.pickupPoint}</p>
                <p><span className="font-bold">{t('to')}:</span> {delivery.deliveryLocation?.name[language] || delivery.deliveryPoint}</p>
                {delivery.customerPhone && <p><span className="font-bold">{t('customer_contact_phone')}:</span> {delivery.customerPhone}</p>}
                {delivery.customerNotes && <p><span className="font-bold">{t('customer_notes')}:</span> {delivery.customerNotes}</p>}
                {delivery.promoCodeApplied && <p><span className="font-bold">{t('promo_code')}:</span> {delivery.promoCodeApplied}</p>}
                {delivery.discountAmount && delivery.discountAmount > 0 && <p className="text-green-600"><span className="font-bold">{t('discount_amount')}:</span> {delivery.discountAmount.toLocaleString()} T</p>}
            </div>
            {delivery.status === 'AWAITING_PAYMENT' && !delivery.isPaymentConfirmedByCustomer && (
                <p className="text-center mt-4 font-semibold text-orange-600">{t('awaiting_customer_payment')}</p>
            )}
            {delivery.status === 'AWAITING_PAYMENT' && delivery.isPaymentConfirmedByCustomer && (
                <button onClick={() => onConfirmPayment(delivery.id)} className="w-full mt-4 bg-sharif-bar text-white font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                    {t('confirm_payment_received')}
                 </button>
            )}
            {delivery.status === 'AWAITING_CUSTOMER_CONFIRMATION' && (
                <p className="text-center mt-4 font-semibold text-blue-600">{t('awaiting_customer_confirmation')}</p>
            )}
            {action && delivery.status !== 'AWAITING_PAYMENT' && delivery.status !== 'AWAITING_CUSTOMER_CONFIRMATION' && ( // Don't show action button if payment is pending or delivery confirmed
                 <button onClick={action.action} className="w-full mt-4 bg-sharif-bar text-white font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                    {action.text}
                 </button>
            )}
        </div>
    );
};

const ActiveDeliveriesPage: React.FC = () => {
    const { t, direction } = useTranslation();
    const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDeliveries = async () => {
        const active = await api.getActiveDeliveries('rider-123');
        setDeliveries(active);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDeliveries();
        const interval = setInterval(fetchDeliveries, 5000);
        return () => clearInterval(interval);
    }, []);
    
    const handleUpdateStatus = async (id: string, status: 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED') => {
        await api.updateDeliveryStatus(id, status);
        fetchDeliveries(); // Re-fetch to update UI
    };

    const handleConfirmPayment = async (id: string) => {
        await api.courierConfirmPayment(id);
        fetchDeliveries(); // Re-fetch to update UI
    };

    return (
        <div dir={direction}>
            <h1 className="text-3xl font-extrabold mb-4">{t('active_deliveries')}</h1>
             {isLoading && <p>Loading active deliveries...</p>}
             {!isLoading && deliveries.length === 0 && <p className="text-center text-gray-500 mt-8">You have no active deliveries.</p>}
             {deliveries.map(delivery => (
                <ActiveDeliveryCard key={delivery.id} delivery={delivery} onUpdateStatus={handleUpdateStatus} onConfirmPayment={handleConfirmPayment} />
             ))}
        </div>
    );
};

export default ActiveDeliveriesPage;