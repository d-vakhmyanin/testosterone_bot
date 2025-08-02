export const STORAGE_KEYS = {
    exercises: 'exercises',
    activeTab: 'activeTab',
} as const;

export const getStorage = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!!window.Telegram?.WebApp?.CloudStorage) {
        try {
            window.Telegram.WebApp.CloudStorage.getKeys();

            return window.Telegram.WebApp.CloudStorage;
        } catch {
            return window.localStorage;
        }
    }

    return window.localStorage;
};
