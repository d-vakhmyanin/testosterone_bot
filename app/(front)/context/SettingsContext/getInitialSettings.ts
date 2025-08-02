import { getStorage, STORAGE_KEYS } from '@/app/utils/storage';

import { SettingsState } from '..';
import { BASE_EXERCISES } from './contants';

const defaultState = {
    activeTab: 'all',
    exercises: BASE_EXERCISES,
} as const;

export const getInitialSettings = async (): Promise<SettingsState> => {
    const storage = getStorage();
    const exercisesStr = storage?.getItem(STORAGE_KEYS.exercises);

    return {
        activeTab:
            (storage?.getItem(STORAGE_KEYS.activeTab) as SettingsState['activeTab']) ||
            defaultState.activeTab,
        exercises: exercisesStr
            ? (JSON.parse(exercisesStr) as SettingsState['exercises'])
            : defaultState.exercises,
    };
};
