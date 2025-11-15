import React, { useState, useContext, useMemo } from 'react';
import { Restaurant, MenuItem as MenuItemType, Bilingual, CartItem } from '../../types';
import { useTranslation } from '../../i18n';
import { SELF_SERVICE_DATA } from '../../data';
import { AppContext } from '../../App';
import { api } from '../../api';
import QuantitySelectorModal from '../../components/QuantitySelectorModal'; // Import the new modal component

interface MenuPageProps {
  restaurant: Restaurant;
  onBack: () => void;
}

const MenuItem: React.FC<{ item: MenuItemType; onClick: (item: MenuItemType) => void }> = ({ item, onClick }) => {
    const { language } = useTranslation();
    const { cart } = useContext(AppContext);

    const cartItem = cart.find(c => c.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <div 
          onClick={() => onClick(item)} 
          className="bg-white border-2 border-black rounded-4xl p-4 flex justify-between items-center shadow-sm mb-3 bouncy-button" // Added bouncy-button for micro-interaction
        >
            <div>
                <h4 className="font-bold">{item.name[language]}</h4>
                <p className="text-gray-600">{item.price.toLocaleString()} T</p>
            </div>
            {quantity > 0 && ( // Show quantity if item is in cart
                 <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 border-2 border-black min-w-[60px] justify-center">
                     <span className="font-bold text-lg">{quantity}</span>
                </div>
            )}
        </div>
    );
};

const MenuPage: React.FC<MenuPageProps> = ({ restaurant, onBack }) => {
    const { t, language, direction } = useTranslation();
    const { user, cart, setCart, activeOrder, setActiveOrder } = useContext(AppContext);

    const [orderCode, setOrderCode] = useState('');
    const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItemType | null>(null);
    const [selectedDrinks, setSelectedDrinks] = useState<MenuItemType[]>([]);
    const [selectedAddOns, setSelectedAddOns] = useState<MenuItemType[]>([]);
    const [selectedDiningHall, setSelectedDiningHall] = useState<Bilingual | null>(null);

    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null);

    // Reset selections when restaurant changes
    React.useEffect(() => {
        setOrderCode('');
        setSelectedFoodItem(null);
        setSelectedDrinks([]);
        setSelectedAddOns([]);
        setSelectedDiningHall(null);
        setSelectedMenuItem(null);
        setIsQuantityModalOpen(false);
    }, [restaurant]);

    const toggleSelection = (list: MenuItemType[], item: MenuItemType, setter: React.Dispatch<React.SetStateAction<MenuItemType[]>>) => {
        if (list.some(i => i.id === item.id)) {
            setter(list.filter(i => i.id !== item.id));
        } else {
            setter([...list, item]);
        }
    };

    const calculateTotal = useMemo(() => {
        let currentTotal = 0;
        if (selectedFoodItem) currentTotal += selectedFoodItem.price;
        currentTotal += selectedDrinks.reduce((sum, d) => sum + d.price, 0);
        currentTotal += selectedAddOns.reduce((sum, a) => sum + a.price, 0);
        return currentTotal;
    }, [selectedFoodItem, selectedDrinks, selectedAddOns]);

    const restaurantCartTotal = useMemo(() => {
      return cart
        .filter(item => item.restaurantId === restaurant.id)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart, restaurant]);

    const handleSelfServiceCheckout = async () => {
        if (!selectedFoodItem || !selectedDiningHall || !user?.id) {
            alert(t('self_service_selection_needed')); // Use a translation key for this alert
            return;
        }

        const orderItems: CartItem[] = [];
        orderItems.push({ ...selectedFoodItem, quantity: 1 });
        selectedDrinks.forEach(d => orderItems.push({ ...d, quantity: 1 }));
        selectedAddOns.forEach(a => orderItems.push({ ...a, quantity: 1 }));

        const deliveryFee = 0; // Self-service typically has no delivery fee

        // FIX: Add missing restaurantName property and remove status to match api.createOrder signature
        const orderPayload = {
            userId: user.id,
            items: orderItems,
            diningHall: selectedDiningHall,
            deliveryFee: deliveryFee,
            total: calculateTotal,
            restaurantName: restaurant.name,
        };

        try {
            const newOrder = await api.createOrder(orderPayload);
            setActiveOrder(newOrder); // Set the new order as active
            setOrderCode(newOrder.code);
            // Clear selections after successful order
            setSelectedFoodItem(null);
            setSelectedDrinks([]);
            setSelectedAddOns([]);
            setSelectedDiningHall(null);
        } catch (error) {
            console.error("Failed to create self-service order:", error);
            alert("Failed to create order. Please try again.");
        }
    };

    const handleOpenQuantityModal = (item: MenuItemType) => {
      setSelectedMenuItem(item);
      setIsQuantityModalOpen(true);
    };

    const currentItemQuantityInCart = selectedMenuItem ? (cart.find(c => c.id === selectedMenuItem.id)?.quantity || 0) : 0;


    const renderContent = () => {
        switch (restaurant.type) {
            case 'menu':
                return (
                  <div className="pb-24"> {/* Added padding-bottom to account for fixed footer */}
                    {restaurant.menu?.map(category => (
                        <div key={category.title.en} className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">{category.title[language]}</h2>
                            {category.items.map(item => <MenuItem key={item.id} item={item} onClick={handleOpenQuantityModal} />)}
                        </div>
                    ))}
                  </div>
                );
            case 'external':
                return (
                    <div className="space-y-4">
                        <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="block text-center w-full p-4 bg-sharif-mint font-bold rounded-4xl border-3 border-black shadow-study bouncy-button">{t('order_online')}</a>
                        <form onSubmit={async e => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const payload = {
                                sourceRestaurantId: restaurant.id,
                                requestedByUserId: user?.id || 'anonymous', // Use user.id from context
                                foodName: formData.get('foodName') as string,
                                price: Number(formData.get('price')),
                                pickupPoint: formData.get('pickup') as string,
                                deliveryPoint: formData.get('delivery') as string,
                            };
                            await api.createRequestDelivery(payload);
                            alert('Delivery request submitted!');
                            }} className="bg-white p-4 border-3 border-black rounded-5xl shadow-study">
                             <h3 className="font-bold text-lg text-center mb-1">{t('submit_delivery_request')}</h3>
                             <p className="text-center text-sm text-gray-600 mb-3">{t('request_delivery_desc')}</p>
                             <input required name="foodName" type="text" placeholder={String(t('food_name'))} className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-3 focus:outline-none focus:ring-2 ring-sharif-gir" />
                             <input required name="price" type="number" placeholder={String(t('price'))} className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-3 focus:outline-none focus:ring-2 ring-sharif-gir" />
                             <input required name="pickup" type="text" placeholder={String(t('pickup_point'))} className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-3 focus:outline-none focus:ring-2 ring-sharif-gir" />
                             <input required name="delivery" type="text" placeholder={String(t('delivery_location'))} className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl mb-3 focus:outline-none focus:ring-2 ring-sharif-gir" />
                             <button type="submit" className="w-full mt-2 p-3 bg-sharif-bar text-white font-bold rounded-4xl border-2 border-black bouncy-button">{t('submit_delivery_request')}</button>
                        </form>
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
                        <h3 className="font-bold text-lg">{t('food_item')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {SELF_SERVICE_DATA.food.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setSelectedFoodItem(f)}
                                    className={`px-3 py-1 border-2 border-black rounded-full bouncy-button ${selectedFoodItem?.id === f.id ? 'bg-sharif-gir text-white' : 'bg-gray-100'}`}
                                >
                                    {f.name[language]} <span className="text-xs opacity-70">+{f.price/1000}k</span>
                                </button>
                            ))}
                        </div>

                        <h3 className="font-bold text-lg">{t('drinks')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {SELF_SERVICE_DATA.drinks.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => toggleSelection(selectedDrinks, d, setSelectedDrinks)}
                                    className={`px-3 py-1 border-2 border-black rounded-full bouncy-button ${selectedDrinks.some(sd => sd.id === d.id) ? 'bg-sharif-gir text-white' : 'bg-gray-100'}`}
                                >
                                    {d.name[language]} <span className="text-xs opacity-70">+{d.price/1000}k</span>
                                </button>
                            ))}
                        </div>

                        <h3 className="font-bold text-lg">{t('add_ons')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {SELF_SERVICE_DATA.addOns.map(a => (
                                <button
                                    key={a.id}
                                    onClick={() => toggleSelection(selectedAddOns, a, setSelectedAddOns)}
                                    className={`px-3 py-1 border-2 border-black rounded-full bouncy-button ${selectedAddOns.some(sa => sa.id === a.id) ? 'bg-sharif-gir text-white' : 'bg-gray-100'}`}
                                >
                                    {a.name[language]} <span className="text-xs opacity-70">+{a.price/1000}k</span>
                                </button>
                            ))}
                        </div>

                        <h3 className="font-bold text-lg">{t('dining_hall')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {SELF_SERVICE_DATA.halls.map(h => (
                                <button
                                    key={h.en}
                                    onClick={() => setSelectedDiningHall(h)}
                                    className={`px-3 py-1 border-2 border-black rounded-full bouncy-button ${selectedDiningHall?.en === h.en ? 'bg-sharif-gir text-white' : 'bg-gray-100'}`}
                                >
                                    {h[language]}
                                </button>
                            ))}
                        </div>

                        {calculateTotal > 0 && (
                            <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-gray-200">
                                <span>Total:</span>
                                <span>{calculateTotal.toLocaleString()} T</span>
                            </div>
                        )}

                        <button
                            onClick={handleSelfServiceCheckout}
                            disabled={!selectedFoodItem || !selectedDiningHall || !user?.id}
                            className={`w-full mt-2 p-3 text-white font-bold rounded-4xl border-2 border-black bouncy-button ${(!selectedFoodItem || !selectedDiningHall || !user?.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-sharif-gir hover:bg-red-600'}`}
                        >
                            {t('checkout')}
                        </button>
                     </div>
                );
        }
    };

    return (
        <div dir={direction}>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="text-3xl font-bold transform hover:scale-110 bouncy-button">{'<'} </button>
                <restaurant.logo />
                <h1 className="text-3xl font-extrabold">{restaurant.name[language]}</h1>
            </div>
            {renderContent()}

            {/* Sticky footer for menu items */}
            {restaurant.type === 'menu' && restaurantCartTotal > 0 && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-sharif-yellow border-t-3 border-black z-20">
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                  <span className="text-xl font-bold">{t('total')}: {restaurantCartTotal.toLocaleString()} T</span>
                  <button 
                    onClick={() => onBack()} // Navigate back to home, which will then trigger navigation to Cart from BottomNav
                    className="bg-sharif-gir text-white font-bold py-3 px-6 rounded-4xl border-3 border-black shadow-lg bouncy-button"
                  >
                    {t('cart')}
                  </button>
                </div>
              </div>
            )}


            {isQuantityModalOpen && selectedMenuItem && (
              <QuantitySelectorModal 
                item={selectedMenuItem}
                initialQuantity={currentItemQuantityInCart}
                onClose={() => setIsQuantityModalOpen(false)}
              />
            )}
        </div>
    );
};

export default MenuPage;