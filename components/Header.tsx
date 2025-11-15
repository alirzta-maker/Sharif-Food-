import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Role, Language } from '../types';
import { api } from '../api';

const LanguageToggle: React.FC = () => {
    const { language, setLanguage } = useContext(AppContext);
    const isFa = language === 'fa';

    return (
        <div
            onClick={() => setLanguage(isFa ? 'en' : 'fa')}
            className="relative w-24 h-10 bg-white border-3 border-black rounded-full flex items-center justify-between px-1 cursor-pointer shadow-study active:shadow-none active:translate-y-1 transition-all"
        >
             {/* Slider (Green Button) */}
            <div
                className={`absolute top-1 bottom-1 w-[2.6rem] bg-sharif-mint border-2 border-black rounded-full transition-transform duration-300 ease-out ${
                    isFa ? 'translate-x-[2.8rem]' : 'translate-x-0'
                }`}
            />

            {/* Labels */}
            <span className={`z-10 w-1/2 text-center text-xs font-bold select-none transition-opacity duration-200 ${!isFa ? 'opacity-100' : 'opacity-40'}`}>EN</span>
            <span className={`z-10 w-1/2 text-center text-xs font-bold select-none transition-opacity duration-200 ${isFa ? 'opacity-100' : 'opacity-40'}`}>FA</span>
        </div>
    );
};

const RoleSwitch: React.FC = () => {
    const { role, setRole, cart } = useContext(AppContext);
    const [isSwitching, setIsSwitching] = useState(false);
    
    const handleRoleSwitch = async (targetRole: Role) => {
        if (role === targetRole || isSwitching) return;

        if (role === Role.GIR && cart.length > 0) {
            if (!window.confirm("You have items in your cart. Switching roles will save your cart for later. Continue?")) {
                return;
            }
        }
        
        setIsSwitching(true);
        try {
            const response = await api.switchRole("user-123", targetRole);
            if (response.success) {
                setRole(response.role);
            } else {
                alert("Failed to switch role. Please try again.");
            }
        } catch (error) {
            alert("An error occurred while switching roles.");
        } finally {
            setIsSwitching(false);
        }
    };
    
    const Capsule = ({ r, active, color, text }: { r: Role, active: boolean, color: string, text: string }) => (
        <div 
            onClick={() => !isSwitching && handleRoleSwitch(r)}
            className={`
                cursor-pointer w-12 h-12 rounded-full border-3 border-black flex items-center justify-center 
                transition-all duration-300 transform 
                ${color} 
                ${active ? 'shadow-study scale-110 opacity-100 z-10 ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-60 scale-95 hover:opacity-90 hover:scale-100'} 
                ${isSwitching ? 'opacity-50 cursor-wait' : ''}
            `}
            aria-label={`Switch to ${text} role`}
        >
            {isSwitching && active ? (
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
                <span className={`font-bold text-2xl pointer-events-none ${active ? 'text-white drop-shadow-md' : 'text-black/50'}`}>{text}</span>
            )}
        </div>
    );

    return (
        <div className="flex space-x-3">
            <Capsule r={Role.GIR} active={role === Role.GIR} color="bg-sharif-gir" text="🙂" />
            <Capsule r={Role.BAR} active={role === Role.BAR} color="bg-sharif-bar" text="🛵" />
        </div>
    );
};

export const Header: React.FC = () => (
    <header className="p-4 flex justify-between items-center"> {/* Removed sticky, bg-sharif-mint, z-30, border-b-3, border-black */}
        <RoleSwitch />
        <LanguageToggle />
    </header>
);