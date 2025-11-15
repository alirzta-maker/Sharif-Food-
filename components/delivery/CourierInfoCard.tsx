import React from 'react';
import { CourierProfile } from '../../types';
import { useTranslation } from '../../i18n';

const CourierInfoCard: React.FC<{ courier: CourierProfile }> = ({ courier }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-sharif-mint p-4 border-3 border-black rounded-4xl shadow-study">
             <h3 className="font-bold text-lg mb-3 text-center">{t('your_courier')}</h3>
            <div className="flex items-center gap-4">
                <img src={courier.profilePictureUrl} alt={courier.fullName} className="w-20 h-20 rounded-full border-3 border-black" />
                <div>
                    <p className="font-extrabold text-xl">{courier.fullName}</p>
                    {/* Display full card number as per request for manual payment */}
                    <p className="text-gray-600">Card: {courier.bankCardNumber}</p>
                    <p className="text-gray-600">Phone: {courier.phone}</p> {/* Display courier's phone number */}
                    <p className="text-gray-600">Rating: {'⭐'.repeat(Math.round(courier.rating))} {courier.rating}</p>
                </div>
            </div>
        </div>
    );
};

export default CourierInfoCard;