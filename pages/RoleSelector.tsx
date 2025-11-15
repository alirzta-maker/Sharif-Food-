import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Role } from '../types';
import { useTranslation } from '../i18n';
import { SharifGirLogo, SharifBarLogo } from '../components/Logos';

const RoleCard = ({ logo, title, description, onClick, accentClass }: { logo: React.ReactNode, title: string, description: string, onClick: () => void, accentClass: string }) => (
    <div onClick={onClick} className={`bg-white p-6 border-3 border-black rounded-5xl shadow-study text-center cursor-pointer transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all duration-200 bouncy-button`}>
        <div className="flex justify-center mb-3">{logo}</div>
        <h2 className={`text-2xl font-extrabold ${accentClass}`}>{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
    </div>
);

const RoleSelectorPage: React.FC = () => {
    const { setRole, setUser, user } = useContext(AppContext);
    const { t, direction } = useTranslation();

    const handleSelectRole = (selectedRole: Role) => {
        setRole(selectedRole);
        // Also update the user's role in their profile
        if (user) {
            setUser({ ...user, role: selectedRole });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4" dir={direction}>
             <h1 className="text-4xl font-extrabold mb-10 text-gray-900">{t('select_your_role')}</h1>
            <div className="w-full max-w-sm space-y-4">
                <RoleCard 
                    logo={<SharifGirLogo />}
                    title={String(t('sharif_gir'))}
                    description={String(t('order_food_prompt'))}
                    onClick={() => handleSelectRole(Role.GIR)}
                    accentClass="text-sharif-gir"
                />
                 <RoleCard 
                    logo={<SharifBarLogo />}
                    title={String(t('sharif_bar'))}
                    description={String(t('deliver_meals_prompt'))}
                    onClick={() => handleSelectRole(Role.BAR)}
                    accentClass="text-sharif-bar"
                />
            </div>
        </div>
    );
};

export default RoleSelectorPage;