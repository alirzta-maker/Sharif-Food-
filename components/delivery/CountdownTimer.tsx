import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC<{ expiryTimestamp: number }> = ({ expiryTimestamp }) => {
    const calculateTimeLeft = () => {
        const difference = expiryTimestamp - Date.now();
        let timeLeft = Math.max(0, Math.round(difference / 1000));
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const isUrgent = timeLeft <= 15;
    const color = isUrgent ? 'bg-sharif-gir text-white' : 'bg-white text-black';

    return (
        <div className={`px-3 py-1 text-sm font-bold rounded-full border-2 border-black shadow-sm transition-colors ${color}`}>
            {timeLeft}s left
        </div>
    );
};

export default CountdownTimer;
