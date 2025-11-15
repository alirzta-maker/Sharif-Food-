
import React from 'react';
import { UserRole } from '../types';

interface LoginRoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleCard: React.FC<{
  icon: string;
  label: string;
  role: UserRole;
  colorClass: string;
  onSelect: () => void;
}> = ({ icon, label, colorClass, onSelect }) => (
  <div
    onClick={onSelect}
    className={`bg-white border-3 border-black rounded-4xl p-8 text-center shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-transform duration-200 ease-in-out`}
  >
    <div className={`text-6xl mb-4 ${colorClass}`}>{icon}</div>
    <h2 className="text-2xl font-bold">{label}</h2>
  </div>
);

const LoginRoleSelector: React.FC<LoginRoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-5xl font-extrabold mb-12 text-gray-900">Welcome to NeoFood</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <RoleCard
          icon="🙂"
          label="Normal User (Customer)"
          role={UserRole.CUSTOMER}
          colorClass="text-neo-green"
          onSelect={() => onRoleSelect(UserRole.CUSTOMER)}
        />
        <RoleCard
          icon="🔵"
          label="ShariF Bar (Restaurant)"
          role={UserRole.RESTAURANT}
          colorClass="text-neo-blue"
          onSelect={() => onRoleSelect(UserRole.RESTAURANT)}
        />
        <RoleCard
          icon="🔴"
          label="ShariF Gear (Delivery Rider)"
          role={UserRole.RIDER}
          colorClass="text-neo-red"
          onSelect={() => onRoleSelect(UserRole.RIDER)}
        />
      </div>
    </div>
  );
};

export default LoginRoleSelector;
