import React from 'react';
import { useTranslation } from '../../i18n';

const SearchingAnimation: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-sharif-gir rounded-full opacity-20 animate-ping"></div>
                <div className="relative w-full h-full bg-sharif-gir rounded-full flex items-center justify-center text-5xl border-4 border-black">
                    🛵
                </div>
            </div>
            <h2 className="text-2xl font-bold animate-pulse">{t('searching_for_courier')}</h2>
        </div>
    );
};

export default SearchingAnimation;
