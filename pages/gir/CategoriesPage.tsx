import React, { useState, useMemo } from 'react';
import { RestaurantCard } from '../../components/common';
import { useTranslation } from '../../i18n';
import { RESTAURANTS } from '../../data';
import { Restaurant } from '../../types';

interface CategoriesPageProps {
  onSelectRestaurant: (restaurantId: string) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectRestaurant }) => {
  const { t, language, direction } = useTranslation();
  // FIX: Cast translation output to string to satisfy useState type
  const [activeCategory, setActiveCategory] = useState<string>(String(t('all')));

  const categories = useMemo(() => {
    const allCats = RESTAURANTS.flatMap(r => r.categories[language]);
    return [t('all'), ...Array.from(new Set(allCats))];
  }, [language, t]);

  const filteredRestaurants = useMemo(() => {
    // FIX: Cast t('all') to string for comparison
    if (activeCategory === String(t('all'))) {
        return RESTAURANTS;
    }
    return RESTAURANTS.filter(r => r.categories[language].includes(activeCategory));
  }, [activeCategory, language, t]);

  return (
    <div dir={direction}>
        <h1 className="text-3xl font-extrabold mb-4">{t('menu_categories')}</h1>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map(cat => (
            // FIX: Cast category to string to satisfy setState type
            <button key={cat} onClick={() => setActiveCategory(String(cat))} className={`px-4 py-2 border-2 border-black rounded-full font-bold whitespace-nowrap transition-colors bouncy-button ${activeCategory === cat ? 'bg-sharif-mint text-black' : 'bg-white text-gray-600'}`}>
            {cat}
            </button>
        ))}
        </div>
      
      <div className="space-y-4">
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onClick={() => onSelectRestaurant(restaurant.id)} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
