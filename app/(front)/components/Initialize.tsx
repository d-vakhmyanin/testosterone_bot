'use client';
import React from 'react';

import { getInitialSettings } from '../context';
import { useSettings } from '../context';

type Subscriber = () => void;

type InitStore = {
    initialized: boolean;
};

let store: InitStore = {
    initialized: false,
};

let subscribers: Subscriber[] = [];

const emitChange = () => {
    subscribers.forEach((subscriber) => subscriber());
};

const initStore = {
    initialize: () => {
        store = { initialized: true };
        emitChange();
    },
    subscribe: (subscriber: Subscriber) => {
        subscribers = [...subscribers, subscriber];

        return () => {
            subscribers = subscribers.filter((s) => s !== subscriber);
        };
    },
    getSnapshot: () => store,
    getServerSnapshot: () => store,
};

export const useIsInitialized = () => {
    const store = React.useSyncExternalStore(
        initStore.subscribe,
        initStore.getSnapshot,
        initStore.getServerSnapshot
    );

    return store;
};

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

        const initialSettings = getInitialSettings();
        setFullState(initialSettings);
        initStore.initialize();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};
