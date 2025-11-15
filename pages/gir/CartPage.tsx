
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../../App';
import { useTranslation } from '../../i18n';
import { CartItem, OrderFlowStatus, DeliveryLocation } from '../../types';
import { api } from '../../api';
import { RESTAURANTS, DELIVERY_LOCATIONS_DATA } from '../../data'; // Import RESTAURANTS and DELIVERY_LOCATIONS_DATA


interface CartPageProps {
  // onCheckout: () => void; // No longer needed as checkout logic is internal
}

const CartPage: React.FC<CartPageProps> = () => {
    const { cart, setCart, user, setActiveOrder, language } = useContext(AppContext);
    const { t, direction } = useTranslation();

    const [customerNotes, setCustomerNotes] = useState('');
    const [customerPhone, setCustomerPhone] = useState(user?.emailOrPhone || '');
    const [selectedDeliveryLocationId, setSelectedDeliveryLocationId] = useState<string | null>(null);
    const [promoCodeInput, setPromoCodeInput] = useState('');
    const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [promoMessage, setPromoMessage] = useState<string | null>(null);

    // Reset phone number if user context changes
    useEffect(() => {
      if (user?.emailOrPhone && !customerPhone) {
        setCustomerPhone(user.emailOrPhone);
      }
    }, [user, customerPhone]);

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(currentCart => {
            return currentCart
                .map(item => {
                    if (item.id === itemId) {
                        return { ...item, quantity: item.quantity + delta };
                    }
                    return item;
                })
                .filter(item => item.quantity > 0);
        });
    };

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const selectedDeliveryLocation = useMemo(() => {
        return DELIVERY_LOCATIONS_DATA.find(loc => loc.id === selectedDeliveryLocationId) || null;
    }, [selectedDeliveryLocationId]);

    const currentDeliveryFee = useMemo(() => {
        return selectedDeliveryLocation?.fee || 0; // Default to 0 if no location selected
    }, [selectedDeliveryLocation]);

    const totalBeforeDiscount = useMemo(() => {
        return subtotal + currentDeliveryFee;
    }, [subtotal, currentDeliveryFee]);

    const finalTotal = useMemo(() => {
      return Math.max(0, totalBeforeDiscount - discountAmount);
    }, [totalBeforeDiscount, discountAmount]);

    const handleApplyPromoCode = async () => {
        if (!promoCodeInput.trim()) {
            setPromoMessage(null);
            return;
        }
        const { success, discountAmount: newDiscount, message } = await api.applyPromoCode(promoCodeInput.trim(), subtotal);
        if (success) {
            setAppliedPromoCode(promoCodeInput.trim());
            setDiscountAmount(newDiscount);
            // FIX: Cast t() result to string to avoid type error (string | number is not assignable to SetStateAction<string>)
            setPromoMessage(message || String(t('promo_code_applied')));
        } else {
            setAppliedPromoCode(null);
            setDiscountAmount(0);
            setPromoMessage(message || 'Invalid promo code.');
        }
    };

    const handleCheckout = async () => {
        if (!user || cart.length === 0) {
            alert("Your cart is empty or you are not logged in.");
            return;
        }

        if (!selectedDeliveryLocation) {
            alert("Please select a delivery location.");
            return;
        }

        if (!customerPhone.trim()) {
            alert("Please provide your phone number for delivery.");
            return;
        }

        const restaurantName = cart.length > 0
            ? RESTAURANTS.find(r => r.id === cart[0].restaurantId)?.name || { en: 'Multiple Restaurants', fa: 'چندین رستوران' }
            : { en: 'Unknown', fa: 'نامشخص' };

        // FIX: Removing trailing comma in orderPayload
        const orderPayload = {
            userId: user.id,
            items: cart,
            deliveryFee: currentDeliveryFee,
            total: finalTotal,
            restaurantName: restaurantName,
            customerNotes: customerNotes.trim() || undefined,
            customerPhone: customerPhone.trim(),
            deliveryLocation: selectedDeliveryLocation,
            promoCodeApplied: appliedPromoCode || undefined,
            discountAmount: discountAmount || undefined
        };

        try {
            const newOrder = await api.createOrder(orderPayload);
            setActiveOrder(newOrder);
            setCart([]); // Clear cart after placing order
            setCustomerNotes('');
            setCustomerPhone(user?.emailOrPhone || '');
            setSelectedDeliveryLocationId(null);
            setPromoCodeInput('');
            setAppliedPromoCode(null);
            setDiscountAmount(0);
            setPromoMessage(null);
        } catch (error) {
            console.error("Failed to create order:", error);
            alert("Could not place order. Please try again.");
        }
    };


    return (
        <div dir={direction}>
            <h1 className="text-3xl font-extrabold mb-4">{t('cart')}</h1>
            {cart.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">Your cart is empty.</p>
            ) : (
                <div className="space-y-3 pb-4">
                    {cart.map((item: CartItem) => (
                        <div key={item.id} className="bg-white border-2 border-black rounded-4xl p-4 flex justify-between items-center shadow-sm">
                            <div>
                                <h4 className="font-bold">{item.name[language]}</h4>
                                <p className="text-gray-600">{item.price.toLocaleString()} T</p>
                            </div>
                            <div className="flex items-center gap-2 font-bold">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full border-2 border-black bouncy-button">-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full border-2 border-black bg-sharif-gir text-white bouncy-button">+</button>
                            </div>
                        </div>
                    ))}

                    <div className="p-4 bg-white border-3 mt-4 border-black rounded-5xl shadow-study space-y-4">
                        {/* Customer Phone Number */}
                        <div>
                            <label htmlFor="customer-phone" className="block text-sm font-bold mb-1">
                                {t('customer_phone_placeholder')}
                            </label>
                            <input
                                id="customer-phone"
                                type="tel"
                                placeholder={String(t('customer_phone_placeholder'))}
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full py-3 px-4 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none focus:ring-2 focus:ring-sharif-gir"
                                required
                            />
                        </div>

                        {/* Order Notes */}
                        <div>
                            <label htmlFor="order-notes" className="block text-sm font-bold mb-1">
                                {t('customer_notes')}
                            </label>
                            <textarea
                                id="order-notes"
                                placeholder={String(t('order_notes_placeholder'))}
                                value={customerNotes}
                                onChange={(e) => setCustomerNotes(e.target.value)}
                                className="w-full py-3 px-4 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none focus:ring-2 focus:ring-sharif-gir h-24 resize-none"
                            ></textarea>
                        </div>
                        
                        {/* Delivery Location Selection */}
                        <div>
                            <label htmlFor="delivery-location" className="block text-sm font-bold mb-1">
                                {t('select_delivery_location')}
                            </label>
                            <select
                                id="delivery-location"
                                value={selectedDeliveryLocationId || ''}
                                onChange={(e) => setSelectedDeliveryLocationId(String(e.target.value))}
                                className="w-full py-3 px-4 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none focus:ring-2 focus:ring-sharif-gir"
                                required
                            >
                                <option value="" disabled>{String(t('select_delivery_location'))}...</option>
                                {DELIVERY_LOCATIONS_DATA.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name[language]} ({loc.fee.toLocaleString()} T)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Promo Code Input */}
                        <div>
                            <label htmlFor="promo-code" className="block text-sm font-bold mb-1">
                                {t('promo_code')}
                            </label>
                            <div className="flex">
                                <input
                                    id="promo-code"
                                    type="text"
                                    placeholder={String(t('promo_code'))}
                                    value={promoCodeInput}
                                    onChange={(e) => {
                                        setPromoCodeInput(e.target.value);
                                        setPromoMessage(null); // Clear message on input change
                                    }}
                                    className="flex-grow py-3 px-4 bg-gray-100 border-2 border-black rounded-l-4xl focus:outline-none focus:ring-2 focus:ring-sharif-gir"
                                />
                                <button
                                    onClick={handleApplyPromoCode}
                                    className="bg-sharif-mint text-black font-bold py-3 px-6 rounded-r-4xl border-y-2 border-r-2 border-black bouncy-button"
                                >
                                    {t('apply_promo')}
                                </button>
                            </div>
                            {promoMessage && (
                                <p className={`mt-2 text-sm ${appliedPromoCode ? 'text-green-600' : 'text-red-600'}`}>
                                    {promoMessage}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 text-lg">
                            <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toLocaleString()} T</span></div>
                            <div className="flex justify-between"><span>Delivery Fee</span><span>{currentDeliveryFee.toLocaleString()} T</span></div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-green-600"><span>{t('discount_amount')}</span><span>- {discountAmount.toLocaleString()} T</span></div>
                            )}
                            <div className="flex justify-between font-extrabold text-xl"><span>{t('total')}</span><span>{finalTotal.toLocaleString()} T</span></div>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || !selectedDeliveryLocationId || !customerPhone.trim()}
                            className={`w-full mt-4 text-white font-bold py-4 rounded-4xl border-3 border-black shadow-lg bouncy-button ${cart.length === 0 || !selectedDeliveryLocationId || !customerPhone.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-sharif-gir'}`}
                        >
                            {t('place_order')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
