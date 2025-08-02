'use client';
import React from 'react';

import { getInitialSettings } from '../context';
import { useSettings } from '../context';

export const Initialize: React.FC = () => {
    const { setFullState } = useSettings();

    React.useEffect(() => {
        // Клиентская инициализация
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand(); // Полноэкранный режим

            try {
                window.Telegram.WebApp.requestFullscreen?.();
            } catch (e) {
                console.log(e);
            }
        }

        getInitialSettings().then((settings) => {
            setFullState(settings);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};
