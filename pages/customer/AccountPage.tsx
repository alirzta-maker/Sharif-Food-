
import React from 'react';

interface AccountPageProps {
  onLogout: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onLogout }) => {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-extrabold mb-8">My Account</h1>
      
      <div className="space-y-4">
        <div className="bg-white border-2 border-black rounded-3xl p-4 font-bold text-lg">Profile</div>
        <div className="bg-white border-2 border-black rounded-3xl p-4 font-bold text-lg">Order History</div>
        <div className="bg-white border-2 border-black rounded-3xl p-4 font-bold text-lg">Addresses</div>
        <div className="bg-white border-2 border-black rounded-3xl p-4 font-bold text-lg">Settings</div>
      </div>

      <button
        onClick={onLogout}
        className="w-full mt-12 bg-neo-red text-white font-bold py-4 rounded-3xl border-3 border-black shadow-lg transform hover:scale-105 active:scale-95 transition-transform"
      >
        Log Out
      </button>
    </div>
  );
};

export default AccountPage;
