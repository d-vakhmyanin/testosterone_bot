import { SettingsState } from '../context';

type Key = keyof SettingsState;

export const STORAGE_KEYS: Record<Key, Key> = {
    exercises: 'exercises',
    activeTab: 'activeTab',
    wheelSettings: 'wheelSettings',
} as const;

export const getStorage = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    // непонятно зачем мне использовать CloudStorage
    // обычный localStorage работает в тг

    // if (!!window.Telegram?.WebApp?.CloudStorage) {
    //     try {
    //         window.Telegram.WebApp.CloudStorage.getKeys();

    //         return window.Telegram.WebApp.CloudStorage;
    //     } catch {
    //         return window.localStorage;
    //     }
    // }

    return window.localStorage;
};
