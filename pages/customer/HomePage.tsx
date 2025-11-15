

import React from 'react';
import { restaurants, CATEGORY_ICONS } from '../../constants';

interface HomePageProps {
    onSelectRestaurant: (restaurantId: string) => void;
}

const SearchBar: React.FC = () => (
  <div className="relative mb-6">
    <input
      type="text"
      placeholder="Search for food or restaurants..."
      className="w-full py-3 pl-12 pr-4 bg-white border-3 border-black rounded-4xl focus:outline-none focus:ring-2 focus:ring-neo-green"
    />
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
  </div>
);

const CategoryPill: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="flex-shrink-0 flex items-center bg-white border-2 border-black rounded-full px-4 py-2 mr-3 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
    <span className="text-xl mr-2">{icon}</span>
    <span className="font-bold">{label}</span>
  </div>
);

// FIX: Update RestaurantCard props to accept object for name and React.FC for logo
const RestaurantCard: React.FC<{ name: { en: string; fa: string }; logo: React.FC; onClick: () => void }> = ({ name, logo: Logo, onClick }) => (
  <div onClick={onClick} className="bg-gradient-to-br from-white to-gray-100 border-3 border-black rounded-4xl p-4 text-center shadow-lg transform hover:scale-105 active:scale-95 transition-transform duration-200 ease-in-out cursor-pointer">
    {/* FIX: Render the logo component */}
    <div className="text-5xl mb-2"><Logo /></div>
    {/* FIX: Render the Persian name */}
    <h3 className="font-bold text-lg">{name.fa}</h3>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onSelectRestaurant }) => {
  const categories = ['Iranian', 'Fast Food', 'Pizza', 'Desserts', 'Drinks'];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">NeoFood</h1>
      <SearchBar />

      <div className="flex overflow-x-auto pb-4 mb-6 -mx-4 px-4">
        {categories.map((cat) => (
          <CategoryPill key={cat} icon={CATEGORY_ICONS[cat] || '❓'} label={cat} />
        ))}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Restaurants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* FIX: Pass restaurant name object and logo component to RestaurantCard */}
          {restaurants.map(r => <RestaurantCard key={r.id} name={r.name} logo={r.logo} onClick={() => onSelectRestaurant(r.id)} />)}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Food Party!</h2>
        <div className="bg-gradient-to-r from-neo-red to-orange-400 text-white border-3 border-black rounded-4xl p-6 shadow-lg">
          <h3 className="text-3xl font-extrabold mb-2">Up to 50% Off!</h3>
          <p>Don't miss out on the biggest food party of the week. Order now!</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
