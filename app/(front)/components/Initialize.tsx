'use client';
import React from 'react';

export const Initialize: React.FC = () => {
    React.useEffect(() => {
        // Клиентская инициализация
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand(); // Полноэкранный режим
        }
    }, []);

    return null;
};
