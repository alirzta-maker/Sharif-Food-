import React from 'react';

const commonProps = {
  stroke: "black",
  strokeWidth: "3",
  strokeLinejoin: "round" as "round",
  strokeLinecap: "round" as "round",
};

export const SharifGirLogo = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    <circle cx="50" cy="50" r="40" fill="#FFCDD2" {...commonProps} />
    <circle cx="35" cy="40" r="5" fill="black" />
    <circle cx="65" cy="40" r="5" fill="black" />
    <path d="M30 60 Q 50 80, 70 60" fill="none" {...commonProps} />
  </svg>
);

export const SharifBarLogo = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    <path d="M 20 70 L 30 70 A 10 10 0 0 0 20 60 V 50 H 60 L 75 40 L 85 50 H 90" fill="#BBDEFB" {...commonProps} />
    <circle cx="30" cy="70" r="10" fill="white" {...commonProps} />
    <circle cx="75" cy="70" r="10" fill="white" {...commonProps} />
    <path d="M 50 50 L 35 30" fill="none" {...commonProps} />
  </svg>
);

export const SelfLogo = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12">
    <rect x="20" y="30" width="60" height="40" rx="10" fill="#E1BEE7" {...commonProps} />
    <path d="M35 50 H 65 M 35 60 H 65" fill="none" {...commonProps} />
  </svg>
);

export const SharifFastFoodLogo = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12">
    <path d="M20 70 L80 70 L 50 20 Z" fill="#FFCC80" {...commonProps} />
    <circle cx="40" cy="55" r="5" fill="#C5E1A5" {...commonProps} />
    <circle cx="60" cy="55" r="5" fill="#EF9A9A" {...commonProps} />
  </svg>
);

export const SharifPlusLogo = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12">
    <circle cx="50" cy="50" r="35" fill="#B3E5FC" {...commonProps} />
    <path d="M 35 50 H 65 M 50 35 V 65" fill="none" {...commonProps} />
  </svg>
);

export const ClunaLogo = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12">
    <path d="M 50,20 A 30,30 0 0,1 50,80 A 15,15 0 0,0 50,50 A 15,15 0 0,1 50,20" fill="#FFF59D" {...commonProps} />
    <path d="M 50,20 A 30,30 0 0,0 50,80 A 15,15 0 0,1 50,50 A 15,15 0 0,0 50,20" fill="#C5CAE9" {...commonProps} />
  </svg>
);

export const CleanFoodLogo = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12">
    <path d="M 20,50 C 20,30 40,20 50,30 C 60,20 80,30 80,50 C 80,75 50,85 50,85 C 50,85 20,75 20,50" fill="#A5D6A7" {...commonProps} />
    <path d="M 50 50 L 50 65" fill="none" {...commonProps} />
  </svg>
);