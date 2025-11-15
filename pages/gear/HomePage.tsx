import React, { useState, useMemo } from 'react';
import { RestaurantCard } from '../../components/common';
import { useTranslation } from '../../i18n';
import { RESTAURANTS } from '../../data';
import { Restaurant } from '../../types';

interface HomePageProps {
  onSelectRestaurant: (restaurantId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectRestaurant }) => {
  const { t, language, direction } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  // FIX: Cast translation output to string to satisfy useState type
  const [activeCategory, setActiveCategory] = useState<string>(String(t('all')));
  const [activeSort, setActiveSort] = useState('');

  const categories = useMemo(() => {
    const allCats = RESTAURANTS.flatMap(r => r.categories[language]);
    // FIX: Ensure t('all') is a string for type consistency
    return [String(t('all')), ...Array.from(new Set(allCats))];
  }, [language, t]);

  const filteredRestaurants = useMemo(() => {
    let restaurants: Restaurant[] = [...RESTAURANTS];
    
    // Search filter
    if (searchQuery) {
        restaurants = restaurants.filter(r => r.name[language].toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Category filter
    // FIX: Cast t('all') to string for comparison
    if (activeCategory !== String(t('all'))) {
        restaurants = restaurants.filter(r => r.categories[language].includes(activeCategory));
    }
    
    // Sort
    if(activeSort === 'price_low_high') {
        // Mock sort, needs price on restaurant
    } else if (activeSort === 'price_high_low') {
        // Mock sort
    } else if (activeSort === 'most_popular') {
        restaurants.sort((a,b) => b.popularity - a.popularity);
    }

    return restaurants;
  }, [searchQuery, activeCategory, activeSort, language, t]);

  return (
    <div dir={direction}>
      <input
        type="text"
        // FIX: Explicitly cast translation output to a string to satisfy the placeholder's type requirement.
        placeholder={String(t('search_placeholder'))}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-4 bg-white border-3 border-black rounded-4xl shadow-study focus:outline-none focus:ring-2 ring-sharif-gear mb-4"
      />
      
      <div className="mb-4">
          <h3 className="font-bold mb-2">{t('categories')}</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 border-2 border-black rounded-full font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-sharif-mint text-black' : 'bg-white text-gray-600'}`}>
                {cat}
              </button>
            ))}
          </div>
      </div>

       <div className="mb-6">
          <h3 className="font-bold mb-2">{t('filters')}</h3>
          <div className="flex gap-2">
              <button onClick={() => setActiveSort('most_popular')} className={`px-4 py-2 border-2 border-black rounded-full font-bold transition-colors ${activeSort === 'most_popular' ? 'bg-sharif-mint text-black' : 'bg-white text-gray-600'}`}>
                {t('most_popular')}
              </button>
          </div>
      </div>
      
      <div className="space-y-4">
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onClick={() => onSelectRestaurant(restaurant.id)} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
