import React, { useContext } from 'react';
import { useTranslation } from '../../i18n';
import { AppContext } from '../../App';
import { Role } from '../../types';


const AccountPage: React.FC = () => {
    const { t, direction } = useTranslation();
    const { setRole, setIsLoggedIn, setCart, user, setUser } = useContext(AppContext);

    const handleLogout = () => {
        // Clear all state on logout
        setCart([]);
        setUser(null); // Clear user data
        setRole(Role.NONE);
        setIsLoggedIn(false);
    }
    
    return (
        <div dir={direction}>
            <h1 className="text-3xl font-extrabold mb-4">{t('account')}</h1>
            <div className="p-6 bg-white border-3 border-black rounded-5xl shadow-study">
                {user ? (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">{t('your_profile')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
                                <p className="text-sm text-gray-600">Full Name</p>
                                <p className="font-semibold">{user.fullName}</p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
                                <p className="text-sm text-gray-600">Student ID</p>
                                <p className="font-semibold">{user.studentId}</p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
                                <p className="text-sm text-gray-600">Email/Phone</p>
                                <p className="font-semibold">{user.emailOrPhone}</p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
                                <p className="text-sm text-gray-600">Role</p>
                                <p className="font-semibold">{user.role}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No user data available. Please log in.</p>
                )}

                {user && (
                    <div className="mt-8 p-6 bg-sharif-mint border-3 border-black rounded-5xl shadow-study text-center">
                        <h2 className="text-2xl font-bold mb-4">{t('invite_friends')}</h2>
                        <p className="text-gray-700 mb-4">{t('referral_bonus_desc')}</p>
                        {user.referralCode ? (
                            <div className="flex items-center justify-center flex-wrap">
                                <p className="text-lg font-bold mb-2 w-full">{t('your_referral_code')}:</p>
                                <div className="bg-white p-3 border-2 border-black rounded-4xl font-mono text-xl select-all">
                                    {user.referralCode}
                                </div>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(user.referralCode!)}
                                    className="ml-2 px-4 py-2 bg-sharif-gir text-white font-bold rounded-full border-2 border-black bouncy-button text-sm mt-2 md:mt-0"
                                >
                                    {t('copy')}
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-700">{t('no_referral_code_yet')}</p>
                        )}
                    </div>
                )}
                
                <button onClick={handleLogout} className="w-full mt-6 bg-gray-700 text-white font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AccountPage;