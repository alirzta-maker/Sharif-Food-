import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';
import { api } from '../../api';
import { OrderFlowStatus, Order } from '../../types';
import { useTranslation } from '../../i18n';
import SearchingAnimation from '../../components/delivery/SearchingAnimation';
import CourierInfoCard from '../../components/delivery/CourierInfoCard';
import DeliveryTimeline from '../../components/delivery/DeliveryTimeline';
import CancelModal from '../../components/delivery/CancelModal';

const OrderStatusPage: React.FC = () => {
    const { activeOrder, setActiveOrder } = useContext(AppContext);
    const { t } = useTranslation();
    const [isCancelling, setIsCancelling] = useState(false);

    // Poll for order status updates
    useEffect(() => {
        if (!activeOrder || activeOrder.status === OrderFlowStatus.DELIVERED || activeOrder.status.includes('CANCELLED') || activeOrder.status === OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION) {
            return;
        }

        const interval = setInterval(async () => {
            const updatedOrder = await api.getOrderStatus(activeOrder.id);
            if (updatedOrder) {
                setActiveOrder(updatedOrder);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [activeOrder, setActiveOrder]);

    const handleCustomerPaymentConfirmation = async () => {
        if (!activeOrder) return;
        // Customer marks that they have paid the courier directly
        console.log("Customer confirming payment to courier...");
        const { success } = await api.customerConfirmPayment(activeOrder.id);
        if (success) {
            const updatedOrder = await api.getOrderStatus(activeOrder.id);
            if (updatedOrder) setActiveOrder(updatedOrder);
            alert("Payment marked as paid by you. Courier will now confirm receipt.");
        } else {
            alert("Failed to mark payment. Please try again.");
        }
    };

    const handleCustomerDeliveryConfirmation = async () => {
        if (!activeOrder) return;
        console.log("Customer confirming delivery received...");
        const { success } = await api.customerConfirmDelivery(activeOrder.id);
        if (success) {
            const updatedOrder = await api.getOrderStatus(activeOrder.id);
            if (updatedOrder) setActiveOrder(updatedOrder);
            alert("Delivery confirmed! Enjoy your food!");
        } else {
            alert("Failed to confirm delivery. Please try again.");
        }
    };


    const handleCancel = async (reason?: string) => {
        if (!activeOrder) return;
        await api.cancelOrder(activeOrder.id, reason);
        const updatedOrder = await api.getOrderStatus(activeOrder.id);
        if (updatedOrder) setActiveOrder(updatedOrder);
        setIsCancelling(false);
    };
    
    const handleFinish = () => {
        setActiveOrder(null);
    };

    if (!activeOrder) {
        return <p>No active order.</p>;
    }

    const renderContent = () => {
        switch (activeOrder.status) {
            case OrderFlowStatus.SEARCHING_FOR_COURIER:
                return <SearchingAnimation />;
            
            case OrderFlowStatus.AWAITING_PAYMENT:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-4">{t('courier_found')}</h2>
                        {activeOrder.courier && <CourierInfoCard courier={activeOrder.courier} />}
                        <div className="mt-4 p-4 bg-gray-100 border-2 border-black rounded-4xl text-center">
                            <p className="font-bold text-lg mb-2">{t('bank_card_number')}:</p>
                            <p className="text-3xl font-extrabold text-sharif-bar tracking-wider mb-3">
                                {activeOrder.courier?.bankCardNumber || 'N/A'}
                            </p>
                            <button 
                                onClick={() => navigator.clipboard.writeText(activeOrder.courier?.bankCardNumber || '')}
                                className="bg-sharif-bar text-white font-bold py-2 px-6 rounded-full border-2 border-black bouncy-button text-sm"
                            >
                                {t('copy_card_number')}
                            </button>
                        </div>
                        <button onClick={handleCustomerPaymentConfirmation} disabled={activeOrder.isPaymentConfirmedByCustomer} className={`w-full mt-6 text-white font-bold py-4 rounded-4xl border-3 border-black shadow-lg bouncy-button ${activeOrder.isPaymentConfirmedByCustomer ? 'bg-gray-400 cursor-not-allowed' : 'bg-sharif-gir'}`}>
                            {t('i_have_paid')}
                        </button>
                         {activeOrder.isPaymentConfirmedByCustomer && (
                            <p className="text-center mt-3 text-orange-600 font-semibold">{t('awaiting_courier_confirmation')}</p>
                         )}
                    </div>
                );

            case OrderFlowStatus.PAYMENT_CONFIRMED:
            case OrderFlowStatus.DELIVERY_IN_PROGRESS:
                // FIX: Pass onConfirmDelivery prop
                return <DeliveryTimeline order={activeOrder} onConfirmDelivery={handleCustomerDeliveryConfirmation} />;

            case OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION:
                return (
                    <div>
                        {/* FIX: Pass onConfirmDelivery prop */}
                        <DeliveryTimeline order={activeOrder} onConfirmDelivery={handleCustomerDeliveryConfirmation} />
                        <button onClick={handleCustomerDeliveryConfirmation} className="w-full mt-6 bg-sharif-gir text-white font-bold py-4 rounded-4xl border-3 border-black shadow-lg bouncy-button">
                            {t('confirm_delivery_received')}
                        </button>
                    </div>
                );
            
            case OrderFlowStatus.DELIVERED:
                 return (
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-sharif-mint mb-4">{t('delivered')}!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your order!</p>
                        <button onClick={handleFinish} className="w-full mt-6 bg-gray-700 text-white font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                            Back to Home
                        </button>
                    </div>
                 );
            case OrderFlowStatus.CANCELLED_BY_USER:
            case OrderFlowStatus.CANCELLED_BY_COURIER:
                 return (
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-sharif-gir mb-4">{t('order_cancelled')}</h2>
                        <p className="text-gray-600 mb-6">{activeOrder.cancellationReason || 'The order has been cancelled.'}</p>
                        <button onClick={handleFinish} className="w-full mt-6 bg-gray-700 text-white font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                            Back to Home
                        </button>
                    </div>
                 );
            default:
                return <p>Unknown order status.</p>;
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white p-6 border-3 border-black rounded-5xl shadow-study">
                {renderContent()}
                {activeOrder.status !== OrderFlowStatus.DELIVERED && activeOrder.status !== OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION && !activeOrder.status.includes('CANCELLED') && (
                     <button onClick={() => setIsCancelling(true)} className="w-full text-center text-gray-500 mt-4 hover:text-sharif-gir">
                        {t('cancel_order')}
                    </button>
                )}
            </div>
            {isCancelling && <CancelModal order={activeOrder} onConfirm={handleCancel} onDismiss={() => setIsCancelling(false)} />}
        </div>
    );
};

export default OrderStatusPage;