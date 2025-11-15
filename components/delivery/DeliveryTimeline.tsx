
import React from 'react';
import { Order, OrderFlowStatus } from '../../types';
import { useTranslation } from '../../i18n';

const TimelineEvent: React.FC<{ icon: string; title: string; isCompleted: boolean; isCurrent: boolean }> = ({ icon, title, isCompleted, isCurrent }) => {
    const dotColor = isCompleted || isCurrent ? 'bg-sharif-gir' : 'bg-gray-300';
    const textColor = isCompleted || isCurrent ? 'text-black' : 'text-gray-500';

    return (
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full border-3 border-black flex items-center justify-center text-2xl ${isCompleted ? 'bg-sharif-mint' : 'bg-white'}`}>
                {isCompleted ? '✅' : icon}
            </div>
            <div className={`ml-4 font-bold ${textColor}`}>
                {title}
            </div>
        </div>
    );
};


// FIX: Make onConfirmDelivery optional as it might not be relevant for all statuses
const DeliveryTimeline: React.FC<{ order: Order; onConfirmDelivery?: () => void; }> = ({ order, onConfirmDelivery }) => {
    const { t } = useTranslation();
    
    const steps = [
        // FIX: Cast t() to string to resolve type error (string | number is not assignable to string)
        { status: OrderFlowStatus.PAYMENT_CONFIRMED, icon: '💳', title: String(t('payment_confirmed')) },
        { status: OrderFlowStatus.DELIVERY_IN_PROGRESS, icon: '👨‍🍳', title: String(t('picked_up')) }, // Courier has picked up
        { status: OrderFlowStatus.DELIVERY_IN_PROGRESS, icon: '🛵', title: String(t('on_the_way')) }, // Courier is on the way
        { status: OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION, icon: '📦', title: String(t('awaiting_customer_confirmation')) }, // New step: Courier delivered, waiting for customer confirm
        { status: OrderFlowStatus.DELIVERED, icon: '🎉', title: String(t('delivered')) },
    ];

    const getCurrentStepIndex = () => {
        switch (order.status) {
            case OrderFlowStatus.DELIVERED: return 4;
            case OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION: return 3;
            case OrderFlowStatus.DELIVERY_IN_PROGRESS: return 2; // Assuming ON_THE_WAY is the highest progress here
            case OrderFlowStatus.PAYMENT_CONFIRMED: return 1;
            case OrderFlowStatus.AWAITING_PAYMENT:
            case OrderFlowStatus.SEARCHING_FOR_COURIER:
            default: return 0;
        }
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-4">{t('delivery_timeline')}</h2>
            {order.estimatedDeliveryTime && (
                <p className="text-center font-semibold mb-6">{t('eta')}: {order.estimatedDeliveryTime} minutes</p>
            )}
            <div className="relative space-y-4 pl-4">
                 {/* Dashed line */}
                <div className="absolute top-5 left-9 h-[calc(100%-2.5rem)] w-0.5 border-l-2 border-black border-dashed"></div>
                {steps.map((step, index) => (
                     <TimelineEvent 
                        key={step.title as string}
                        icon={step.icon}
                        title={step.title}
                        isCompleted={index < currentStepIndex}
                        isCurrent={index === currentStepIndex}
                     />
                ))}
            </div>
            {order.status === OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION && onConfirmDelivery && (
                <button onClick={onConfirmDelivery} className="w-full mt-6 bg-sharif-gir text-white font-bold py-4 rounded-4xl border-3 border-black shadow-lg bouncy-button">
                    {t('confirm_delivery_received')}
                </button>
            )}
        </div>
    );
};

export default DeliveryTimeline;
