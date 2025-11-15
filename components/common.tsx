import React from 'react';
import { Restaurant, DeliveryOrder } from '../types';
import { useTranslation } from '../i18n';

// Customer (Gir) Components
export const RestaurantCard: React.FC<{ restaurant: Restaurant; onClick: () => void }> = ({ restaurant, onClick }) => {
    const { language, direction } = useTranslation();
    return (
        <div onClick={onClick} dir={direction} className="bg-white border-3 border-black rounded-5xl p-4 shadow-study cursor-pointer transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all duration-200 bouncy-button">
            <div className="flex items-center gap-4">
                <restaurant.logo />
                <div>
                    <h3 className="font-extrabold text-lg">{restaurant.name[language]}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {restaurant.categories[language].map(cat => (
                            <span key={cat} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{cat}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Rider (Bar) Components
export const OrderCard: React.FC<{ order: DeliveryOrder }> = ({ order }) => {
    const { t, language, direction } = useTranslation();
    return (
        <div dir={direction} className="bg-white border-3 border-black rounded-5xl p-4 mb-4 shadow-study">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-extrabold text-xl">{order.restaurantName[language]}</h3>
                    <p className="text-sm text-gray-600">User: {order.userName}</p>
                </div>
                {order.orderCode && <span className="text-sm font-bold bg-gray-200 px-2 py-1 rounded-full">{order.orderCode}</span>}
            </div>
            <div className="my-3 text-sm space-y-1">
                <p><span className="font-bold">Items:</span> {order.items}</p>
                <p><span className="font-bold">From:</span> {order.pickup}</p>
                <p><span className="font-bold">To:</span> {order.destination}</p>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-sharif-gir">{order.price.toLocaleString()} T</span>
                <button className="bg-sharif-bar text-white font-bold py-2 px-6 rounded-4xl border-2 border-black bouncy-button">{t('start_delivery')}</button>
            </div>
        </div>
    );
};