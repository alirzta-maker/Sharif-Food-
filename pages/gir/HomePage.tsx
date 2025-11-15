import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useTranslation } from '../../i18n';
import { RESTAURANTS, ALL_ITEMS } from '../../data';
import { Restaurant, MenuItem } from '../../types';
import { api } from '../../api';
import { AppContext } from '../../App';
import { RestaurantCard } from '../../components/common'; // Import RestaurantCard

interface HomePageProps {
  onSelectRestaurant: (restaurantId: string) => void;
}

// Optimized ItemCard with React.memo to prevent re-renders when parent state (like searchQuery) changes
const ItemCard = React.memo(({ item, restaurant, onSelectRestaurant, isFoodParty = false }: { item: MenuItem; restaurant: Restaurant | undefined, onSelectRestaurant: (id: string) => void, isFoodParty?: boolean }) => {
    const { language } = useTranslation();
    const { cart, setCart } = useContext(AppContext);

    if (!restaurant) return null;

    const cartItem = cart.find(c => c.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const originalPrice = item.price;
    const discountedPrice = isFoodParty ? Math.round(item.price * 0.7) : item.price; // 30% discount for food party

    const updateQuantity = (e: React.MouseEvent, delta: number) => {
        e.stopPropagation();
        setCart(prevCart => {
            const existing = prevCart.find(c => c.id === item.id);
            if (existing) {
                if (existing.quantity + delta <= 0) {
                    return prevCart.filter(c => c.id !== item.id);
                }
                return prevCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + delta } : c);
            }
            if (delta > 0) {
                return [...prevCart, { ...item, quantity: 1 }];
            }
            return prevCart;
        });
    };

    return (
        <div className="bg-white border-3 border-black rounded-4xl p-3 shadow-study flex gap-3 items-center transform transition-transform duration-100">
             <div onClick={() => onSelectRestaurant(restaurant.id)} className="cursor-pointer">
                <restaurant.logo />
             </div>
             <div className="flex-grow">
                <h4 className="font-bold">{item.name[language]}</h4>
                <p onClick={() => onSelectRestaurant(restaurant.id)} className="text-xs text-gray-500 cursor-pointer hover:underline">{restaurant.name[language]}</p>
                <div className="flex items-center mt-1">
                    {isFoodParty && (
                        <p className="text-sm text-gray-400 line-through mr-2">{originalPrice.toLocaleString()} T</p>
                    )}
                    <p className="text-sm font-semibold">{discountedPrice.toLocaleString()} T</p>
                    {isFoodParty && (
                        <span className="ml-2 bg-sharif-gir text-white text-xs font-bold px-2 py-1 rounded-full border border-black">30% OFF</span>
                    )}
                </div>
             </div>
             {quantity > 0 ? (
                 <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 border-2 border-black flex-shrink-0">
                     <button onClick={(e) => updateQuantity(e, -1)} className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center font-bold hover:bg-gray-200 active:scale-95 transition-all">-</button>
                     <span className="font-bold text-sm min-w-[15px] text-center">{quantity}</span>
                     <button onClick={(e) => updateQuantity(e, 1)} className="w-8 h-8 rounded-full border-2 border-black bg-sharif-gir text-white flex items-center justify-center font-bold hover:bg-red-600 active:scale-95 transition-all">+</button>
                </div>
             ) : (
                <button onClick={(e) => updateQuantity(e, 1)} className="bg-sharif-gir text-white w-10 h-10 rounded-full text-2xl font-bold border-2 border-black bouncy-button flex-shrink-0">+</button>
             )}
        </div>
    )
});

const HomePage: React.FC<HomePageProps> = ({ onSelectRestaurant }) => {
  const { t, language, direction } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(String(t('all')));
  const [activeSort, setActiveSort] = useState<'' | 'most_popular' | 'price_low_high' | 'price_high_low'>('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // New state for filter visibility
  const { activeOrder, setActiveOrder } = useContext(AppContext);


  // Debounce search query to prevent API trashing and lag
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categories = useMemo(() => {
    const allCats = [...new Set(ALL_ITEMS.flatMap(i => i.category[language]))];
    return [String(t('all')), ...allCats];
  }, [language, t]);
  
  // Food Party items (static for now)
  const foodPartyItems = useMemo(() => {
    const popularItems = ALL_ITEMS.filter(item => item.popularity && item.popularity >= 8);
    // Take up to 3 popular items for the food party
    return popularItems.slice(0, 3).map(item => {
        const restaurant = RESTAURANTS.find(r => r.id === item.restaurantId);
        // The object returned here is essentially MenuItem & { restaurant: Restaurant | undefined }
        return { ...item, restaurant }; 
    });
  }, []);

  // Fetch and filter/sort items when debounced query, category, or sort changes
  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
        setIsLoading(true);
        const fetchedItems = await api.listItems({ query: debouncedQuery, category: activeCategory });
        
        let sortedItems = [...fetchedItems]; // Create a mutable copy for sorting

        // Apply sorting
        if (activeSort === 'most_popular') {
            sortedItems.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        } else if (activeSort === 'price_low_high') {
            sortedItems.sort((a, b) => a.price - b.price);
        } else if (activeSort === 'price_high_low') {
            sortedItems.sort((a, b) => b.price - a.price);
        }

        if (isMounted) {
            setItems(sortedItems);
            setIsLoading(false);
        }
    }
    fetchItems();
    return () => { isMounted = false; };
  }, [debouncedQuery, activeCategory, activeSort, language, t]);

  return (
    <div dir={direction}>
      <div className="relative mb-4">
        <input
            type="text"
            placeholder={String(t('search_placeholder'))}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-12 pr-12 bg-white border-3 border-black rounded-4xl shadow-study focus:outline-none focus:ring-2 ring-sharif-gir transition-shadow"
        />
        <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-2xl">🔍</span>
        {/* Filter icon to toggle filters visibility */}
        <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-2xl text-gray-600 hover:text-black bouncy-button"
            aria-label={String(t('toggle_filters'))}
        >
            🎚️ {/* Using a generic sliders icon */}
        </button>
      </div>
      
      {showFilters && (
        <>
            <div className="mb-4">
                <h3 className="font-bold mb-2">{t('categories')}</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                    {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 border-2 border-black rounded-full whitespace-nowrap transition-colors bouncy-button ${activeCategory === cat ? 'bg-sharif-mint text-black font-bold' : 'bg-white text-gray-600'}`}>
                        {cat}
                    </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-bold mb-2">{t('filters')}</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button onClick={() => setActiveSort('most_popular')} className={`px-4 py-2 border-2 border-black rounded-full whitespace-nowrap transition-colors bouncy-button ${activeSort === 'most_popular' ? 'bg-sharif-mint text-black font-bold' : 'bg-white text-gray-600'}`}>
                        {t('most_popular')}
                    </button>
                    <button onClick={() => setActiveSort('price_low_high')} className={`px-4 py-2 border-2 border-black rounded-full whitespace-nowrap transition-colors bouncy-button ${activeSort === 'price_low_high' ? 'bg-sharif-mint text-black font-bold' : 'bg-white text-gray-600'}`}>
                        {t('price_low_high')}
                    </button>
                    <button onClick={() => setActiveSort('price_high_low')} className={`px-4 py-2 border-2 border-black rounded-full whitespace-nowrap transition-colors bouncy-button ${activeSort === 'price_high_low' ? 'bg-sharif-mint text-black font-bold' : 'bg-white text-gray-600'}`}>
                        {t('price_high_low')}
                    </button>
                </div>
            </div>
        </>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('featured_restaurants')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RESTAURANTS.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={() => onSelectRestaurant(r.id)} />)}
        </div>
      </div>

      {foodPartyItems.length > 0 && (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('food_party')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* FIX: Correctly destructure and pass props to ItemCard */}
                {foodPartyItems.map(fullItemData => (
                    <ItemCard 
                        key={fullItemData.id} 
                        item={fullItemData} 
                        restaurant={fullItemData.restaurant} 
                        onSelectRestaurant={onSelectRestaurant} 
                        isFoodParty={true} 
                    />
                ))}
            </div>
        </div>
      )}
      
      <div className="space-y-3 min-h-[200px]">
        <h2 className="text-2xl font-bold mb-4">{t('menu_items')}</h2>
        {items.map(item => {
            const restaurant = RESTAURANTS.find(r => r.id === item.restaurantId);
            return <ItemCard key={item.id} item={item} restaurant={restaurant} onSelectRestaurant={onSelectRestaurant}/>
        })}
        {items.length === 0 && !isLoading && (
            <p className="text-center text-gray-500 mt-10">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;