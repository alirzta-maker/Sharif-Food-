import React, { useState } from 'react';
import { Order, OrderFlowStatus } from '../../types';
import { useTranslation } from '../../i18n';

interface CancelModalProps {
    order: Order;
    onConfirm: (reason?: string) => void;
    onDismiss: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ order, onConfirm, onDismiss }) => {
    const { t } = useTranslation();
    const [reason, setReason] = useState('');
    
    const requiresReason = order.status !== OrderFlowStatus.SEARCHING_FOR_COURIER && order.status !== OrderFlowStatus.AWAITING_PAYMENT;

    const handleConfirm = () => {
        if (requiresReason && !reason.trim()) {
            alert("Please provide a reason for cancellation.");
            return;
        }
        onConfirm(reason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-sm bg-white border-3 border-black rounded-5xl shadow-study p-6">
                <h2 className="text-2xl font-extrabold mb-4">Cancel Order?</h2>
                <p className="text-gray-600 mb-4">
                    {requiresReason
                        ? "Because your order is already being processed, please provide a reason for cancellation. This will trigger a refund."
                        : "Are you sure you want to cancel this order?"}
                </p>
                {requiresReason && (
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., Wrong items selected"
                        className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-4 focus:outline-none focus:ring-2 ring-sharif-gir"
                    />
                )}
                <div className="flex gap-3">
                    <button onClick={onDismiss} className="flex-1 bg-gray-200 text-black font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                        Nevermind
                    </button>
                    <button onClick={handleConfirm} className="flex-1 bg-sharif-gir text-white font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelModal;
