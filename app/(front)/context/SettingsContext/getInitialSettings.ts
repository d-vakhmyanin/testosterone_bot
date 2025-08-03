import { getStorage, STORAGE_KEYS } from '@/app/(front)/utils/storage';

import { SettingsState } from '..';

import { BASE_EXERCISES, DEFAULT_WHEEL_SETTINGS } from './contants';

const defaultState = {
    activeTab: 'all',
    exercises: BASE_EXERCISES,
    wheelSettings: DEFAULT_WHEEL_SETTINGS,
} as const;

export const getInitialSettings = () => {
    const storage = getStorage();
    const exercisesStr = storage?.getItem(STORAGE_KEYS.exercises);
    const wheelStr = storage?.getItem(STORAGE_KEYS.wheelSettings);

    return {
        activeTab:
            (storage?.getItem(STORAGE_KEYS.activeTab) as SettingsState['activeTab']) ||
            defaultState.activeTab,
        exercises: exercisesStr
            ? (JSON.parse(exercisesStr) as SettingsState['exercises'])
            : defaultState.exercises,
        wheelSettings: wheelStr
            ? (JSON.parse(wheelStr) as SettingsState['wheelSettings'])
            : defaultState.wheelSettings,
    };
};
