import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useTranslation } from '../i18n';
import { Role } from '../types'; // Import Role for initial user state

const LoginPage: React.FC = () => {
    const { setIsLoggedIn, setUser } = useContext(AppContext);
    const { t, direction } = useTranslation();

    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [referralCodeInput, setReferralCodeInput] = useState(''); // New state for referral code input

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isRegisterMode) {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    const handleLogin = () => {
        // Mock login success
        // In a real app, you'd validate credentials and fetch user data
        console.log("Mock Login:", { emailOrPhone, password });
        setUser({
            id: 'user-123',
            fullName: 'Test User',
            studentId: '987654321',
            emailOrPhone: emailOrPhone || 'test@example.com',
            role: Role.NONE, // Role will be selected on RoleSelectorPage
            referralCode: 'TESTREF123', // Assign a mock referral code for demo
        });
        setIsLoggedIn(true);
    };

    const handleRegister = () => {
        // Mock registration success
        const newReferralCode = `${fullName.slice(0, 3).toUpperCase()}${studentId.slice(-4)}`; // Simple mock code
        console.log("Mock Register:", { fullName, studentId, emailOrPhone, password, referralCodeInput, newReferralCode });
        setUser({
            id: `user-${Date.now()}`,
            fullName,
            studentId,
            emailOrPhone,
            role: Role.NONE, // Role will be selected on RoleSelectorPage
            referralCode: newReferralCode, // Assign generated referral code
        });
        setIsLoggedIn(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black" dir={direction}>
            <div className="text-center mb-8">
                {/* New Sharif Food Logo (text-based to match provided image) - Now stacked */}
                <div className="text-6xl font-extrabold mb-4 leading-none">
                    <div className="relative text-white inline-block">
                        Sharif
                        {/* Dot for 'i' in Sharif, positioned absolutely within the "Sharif" text's bounds */}
                        {/* Removed the green dot as requested */}
                    </div>
                    <div className="text-sharif-mint">Food</div> {/* This div automatically creates a new line */}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 border-3 border-black rounded-5xl shadow-study mb-8">
                <div className="flex justify-center mb-4 space-x-2">
                    <button
                        type="button"
                        onClick={() => setIsRegisterMode(false)}
                        className={`px-6 py-2 rounded-full font-bold border-2 border-black transition-colors bouncy-button ${!isRegisterMode ? 'bg-sharif-mint text-black' : 'bg-white text-gray-600'}`}
                    >
                        {t('login')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsRegisterMode(true)}
                        className={`px-6 py-2 rounded-full font-bold border-2 border-black transition-colors bouncy-button ${isRegisterMode ? 'bg-sharif-mint text-black' : 'bg-white text-gray-600'}`}
                    >
                        {t('register')}
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
                    {isRegisterMode ? t('register') : t('login')}
                </h2>
                <div className="space-y-4">
                    {isRegisterMode && (
                        <>
                            <input
                                type="text"
                                placeholder={String(t('full_name'))}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none focus:ring-2 ring-sharif-mint"
                                required
                            />
                            <input
                                type="text"
                                placeholder={String(t('student_id'))}
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none focus:ring-2 ring-sharif-mint"
                                required
                            />
                            <input
                                type="text"
                                placeholder={String(t('referral_code'))} // Referral code input
                                value={referralCodeInput}
                                onChange={(e) => setReferralCodeInput(e.target.value)}
                                className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none focus:ring-2 ring-sharif-mint"
                            />
                        </>
                    )}
                    <input
                        type="text"
                        placeholder={String(t('email_phone'))}
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none focus:ring-2 ring-sharif-mint"
                        required
                    />
                    <input
                        type="password"
                        placeholder={String(t('password'))}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-100 border-2 border-black rounded-4xl focus:outline-none focus:ring-2 ring-sharif-mint"
                        required
                    />
                    <button type="submit" className="w-full p-3 bg-sharif-mint text-black font-bold rounded-4xl border-2 border-black bouncy-button">
                        {isRegisterMode ? t('sign_up') : t('login')}
                    </button>
                </div>
                <div className="mt-4 text-center text-sm">
                    {isRegisterMode ? (
                        <button type="button" onClick={() => setIsRegisterMode(false)} className="text-sharif-bar hover:underline">
                            {t('login_here')}
                        </button>
                    ) : (
                        <button type="button" onClick={() => setIsRegisterMode(true)} className="text-sharif-bar hover:underline">
                            {t('register_here')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPage;