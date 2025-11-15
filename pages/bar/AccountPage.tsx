import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { AppContext } from '../../App';
import { Role, CourierProfile } from '../../types';
import { api } from '../../api';

const AccountPage: React.FC = () => {
    const { t, direction } = useTranslation();
    const { setRole, setIsLoggedIn, user, setUser } = useContext(AppContext);
    const [courierProfile, setCourierProfile] = useState<CourierProfile | null>(null);
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

    useEffect(() => {
        if (user && user.role === Role.BAR) {
            const fetchProfile = async () => {
                const profile = await api.getCourierProfile(user.id);
                setCourierProfile(profile);
            };
            fetchProfile();
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user || !courierProfile) return;

        let updatedProfile: Partial<CourierProfile> = {
            bankCardNumber: courierProfile.bankCardNumber,
            phone: courierProfile.phone,
            vehicle: courierProfile.vehicle, // Assuming vehicle is editable here too
        };

        if (profilePictureFile) {
            // In a real app, this would upload the image to a cloud storage
            // and get a URL. For mock, we'll use a placeholder.
            const newProfilePicUrl = URL.createObjectURL(profilePictureFile);
            updatedProfile.profilePictureUrl = newProfilePicUrl;
        }

        const { success } = await api.updateCourierProfile(user.id, updatedProfile);
        if (success) {
            alert(t('save_changes') + ' ' + (t('success')));
            // Re-fetch or update local state for display
            if (updatedProfile.profilePictureUrl) {
                setCourierProfile(prev => prev ? { ...prev, profilePictureUrl: updatedProfile.profilePictureUrl as string } : null);
            }
        } else {
            alert(t('save_changes') + ' ' + (t('failed')));
        }
    };

    const handleLogout = () => {
        setUser(null); // Clear user data
        setRole(Role.NONE);
        setIsLoggedIn(false);
    }
    
    return (
        <div dir={direction}>
            <h1 className="text-3xl font-extrabold mb-4">{t('account')}</h1>
            <div className="p-6 bg-white border-3 border-black rounded-5xl shadow-study">
                {user && courierProfile ? (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">{t('your_profile')}</h2>
                        <div className="flex flex-col items-center mb-6">
                            <img src={courierProfile.profilePictureUrl || 'https://i.pravatar.cc/150?img=68'} alt="Profile" className="w-32 h-32 rounded-full border-4 border-sharif-bar mb-3" />
                            <label className="bg-gray-100 text-black font-bold py-2 px-4 rounded-full border-2 border-black bouncy-button cursor-pointer text-sm">
                                {t('upload_profile_picture')}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => e.target.files && setProfilePictureFile(e.target.files[0])}
                                />
                            </label>
                            {profilePictureFile && <p className="text-sm text-gray-600 mt-2">{profilePictureFile.name}</p>}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={user.fullName}
                                    readOnly // Name is from user registration
                                    className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Email/Phone (Login)</label>
                                <input
                                    type="text"
                                    value={user.emailOrPhone}
                                    readOnly // Login email/phone
                                    className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">{t('bank_card_number')}</label>
                                <input
                                    type="text"
                                    value={courierProfile.bankCardNumber}
                                    onChange={(e) => setCourierProfile(prev => prev ? { ...prev, bankCardNumber: e.target.value } : null)}
                                    className="w-full p-3 bg-white border-2 border-black rounded-4xl focus:outline-none focus:ring-2 ring-sharif-bar"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Contact Phone</label>
                                <input
                                    type="text"
                                    value={courierProfile.phone}
                                    onChange={(e) => setCourierProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                    className="w-full p-3 bg-white border-2 border-black rounded-4xl focus:outline-none focus:ring-2 ring-sharif-bar"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Vehicle Type</label>
                                <input
                                    type="text"
                                    value={courierProfile.vehicle}
                                    onChange={(e) => setCourierProfile(prev => prev ? { ...prev, vehicle: e.target.value } : null)}
                                    className="w-full p-3 bg-white border-2 border-black rounded-4xl focus:outline-none focus:ring-2 ring-sharif-bar"
                                />
                            </div>
                            <button onClick={handleProfileUpdate} className="w-full mt-6 bg-sharif-bar text-white font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                                {t('save_changes')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No courier profile data available.</p>
                )}
                 <button onClick={handleLogout} className="w-full mt-6 bg-gray-700 text-white font-bold py-3 rounded-4xl border-2 border-black bouncy-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AccountPage;