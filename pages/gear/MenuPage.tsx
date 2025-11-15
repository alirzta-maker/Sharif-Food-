import React, { useState } from 'react';
import { Restaurant, MenuItem as MenuItemType } from '../../types';
import { useTranslation } from '../../i18n';
import { SELF_SERVICE_DATA } from '../../data';

interface MenuPageProps {
  restaurant: Restaurant;
  onBack: () => void;
}

const MenuItem: React.FC<{ item: MenuItemType }> = ({ item }) => {
    const { language } = useTranslation();
    return (
        <div className="bg-white border-2 border-black rounded-4xl p-4 flex justify-between items-center shadow-sm mb-3 transform active:scale-95 transition-transform">
            <div>
                <h4 className="font-bold">{item.name[language]}</h4>
                <p className="text-gray-600">{item.price.toLocaleString()} T</p>
            </div>
            <button className="bg-sharif-gear text-white w-10 h-10 rounded-full text-2xl font-bold border-2 border-black">+</button>
        </div>
    );
};

const MenuPage: React.FC<MenuPageProps> = ({ restaurant, onBack }) => {
    const { t, language, direction } = useTranslation();
    const [orderCode, setOrderCode] = useState('');

    const renderContent = () => {
        switch (restaurant.type) {
            case 'menu':
                return restaurant.menu?.map(category => (
                    <div key={category.title.en} className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{category.title[language]}</h2>
                        {category.items.map(item => <MenuItem key={item.name.en} item={item} />)}
                    </div>
                ));

            case 'external':
                return (
                    <div className="space-y-4">
                        <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="block text-center w-full p-4 bg-sharif-mint font-bold rounded-4xl border-3 border-black shadow-study transform active:scale-95 transition-transform">{t('order_online')}</a>
                        <div className="bg-white p-4 border-3 border-black rounded-5xl shadow-study">
                             <h3 className="font-bold text-lg text-center mb-3">{t('request_delivery')}</h3>
                             {/* FIX: Cast translation output to string to satisfy placeholder type */}
                             <input type="text" placeholder={String(t('food_item'))} className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-3 focus:outline-none focus:ring-2 ring-sharif-gear" />
                             <input type="number" placeholder="Price" className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-3 focus:outline-none focus:ring-2 ring-sharif-gear" />
                             <input type="text" placeholder="Pickup Point" className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-3 focus:outline-none focus:ring-2 ring-sharif-gear" />
                             <input type="text" placeholder="Delivery Location" className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-3 focus:outline-none focus:ring-2 ring-sharif-gear" />
                             <button className="w-full mt-2 p-3 bg-sharif-bar text-white font-bold rounded-4xl border-2 border-black transform active:scale-95 transition-transform">{t('submit_delivery')}</button>
                        </div>
                    </div>
                );
            
            case 'self-service':
                if (orderCode) {
                    return (
                         <div className="bg-white p-6 border-3 border-black rounded-5xl shadow-study text-center">
                            <h3 className="font-bold text-lg mb-2">{t('order_code')}</h3>
                            <p className="text-5xl font-extrabold bg-gray-100 border-2 border-black rounded-4xl p-4 tracking-widest">{orderCode}</p>
                         </div>
                    );
                }
                return (
                     <div className="bg-white p-4 border-3 border-black rounded-5xl shadow-study space-y-4">
                        <h3 className="font-bold text-lg">{t('food_item')}: {SELF_SERVICE_DATA.food[0][language]}</h3>
                        <h3 className="font-bold text-lg">{t('drinks')}</h3>
                        <div className="flex flex-wrap gap-2">{SELF_SERVICE_DATA.drinks.map(d => <button key={d.name.en} className="px-3 py-1 border-2 border-black rounded-full bg-gray-100">{d.name[language]}</button>)}</div>
                        <h3 className="font-bold text-lg">{t('add_ons')}</h3>
                         <div className="flex flex-wrap gap-2">{SELF_SERVICE_DATA.addOns.map(a => <button key={a.name.en} className="px-3 py-1 border-2 border-black rounded-full bg-gray-100">{a.name[language]}</button>)}</div>
                        <h3 className="font-bold text-lg">{t('dining_hall')}</h3>
                         <div className="flex flex-wrap gap-2">{SELF_SERVICE_DATA.halls.map(h => <button key={h.en} className="px-3 py-1 border-2 border-black rounded-full bg-gray-100">{h[language]}</button>)}</div>
                        <button onClick={() => setOrderCode(`S-${Math.random().toString(16).substr(2, 4).toUpperCase()}`)} className="w-full mt-2 p-3 bg-sharif-gear text-white font-bold rounded-4xl border-2 border-black transform active:scale-95 transition-transform">{t('checkout')}</button>
                     </div>
                );
        }
    };

    return (
        <div dir={direction}>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="text-3xl font-bold transform hover:scale-110">{'<'} </button>
                <restaurant.logo />
                <h1 className="text-3xl font-extrabold">{restaurant.name[language]}</h1>
            </div>
            {renderContent()}
        </div>
    );
};

export default MenuPage;
