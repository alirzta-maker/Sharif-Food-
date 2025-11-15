

import React from 'react';
import { restaurants } from '../../constants';

const MenuManagementPage: React.FC = () => {
    // FIX: Using optional chaining as menu can be undefined
    const restaurantMenu = restaurants[0].menu ?? [];

    return (
        <div className="p-4 relative min-h-screen">
            <h1 className="text-4xl font-extrabold mb-6">Menu Management</h1>

            {/* FIX: Use english title for key */}
            {restaurantMenu.map((category) => (
                <div key={category.title.en} className="mb-8">
                    {/* FIX: Render Persian title */}
                    <h2 className="text-2xl font-bold mb-4">{category.title.fa}</h2>
                    <div className="space-y-3">
                        {/* FIX: Use english name for key */}
                        {category.items.map((item) => (
                            <div key={item.name.en} className="bg-white border-2 border-black rounded-3xl p-4 flex justify-between items-center shadow-sm">
                                <div>
                                    {/* FIX: Render Persian name */}
                                    <h4 className="font-bold">{item.name.fa}</h4>
                                    <p className="text-gray-600">{item.price.toLocaleString()} Toman</p>
                                </div>
                                <button className="font-bold text-gray-500 hover:text-black">Edit</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            <button className="fixed bottom-24 right-6 bg-neo-blue text-white w-16 h-16 rounded-full text-4xl font-bold border-3 border-black shadow-lg transform hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
                +
            </button>
        </div>
    );
};

export default MenuManagementPage;
