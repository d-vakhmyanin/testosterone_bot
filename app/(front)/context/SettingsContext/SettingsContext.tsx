'use client';

import React from 'react';
import { getStorage, STORAGE_KEYS } from '@/app/(front)/utils/storage';

import { settingsReducer, SettingsState } from './settingsReducer';
import { Exercise, MuscleGroup, WheelSettings } from './types';
import { DEFAULT_WHEEL_SETTINGS } from './contants';
import { useIsInitialized } from '../../components/Initialize';

type SettingsContextType = {
    initialized: boolean;
    state: SettingsState;
    filteredExercises: Exercise[];
    visibleExercises: Exercise[];
    addExercise: (name: string) => void;
    removeExercise: (id: string) => void;
    toggleExerciseVisibility: (id: string) => void;
    setActiveTab: (tab: MuscleGroup) => void;
    setWheelDuration: (d: WheelSettings['duration']) => void;
    setWheelRange: (range: WheelSettings['turnoverRange']) => void;
    restoreDefaults: () => void;
    setFullState: (state: SettingsState) => void;
};

const initialState: SettingsState = {
    exercises: [],
    activeTab: 'all',
    wheelSettings: DEFAULT_WHEEL_SETTINGS,
};

// Контекст для доступа к настройкам в других компонентах
const SettingsContext = React.createContext<SettingsContextType>({
    initialized: false,
    state: initialState,
    filteredExercises: [],
    visibleExercises: [],
    addExercise: () => {},
    removeExercise: () => {},
    toggleExerciseVisibility: () => {},
    setActiveTab: () => {},
    setWheelDuration: () => {},
    setWheelRange: () => {},
    restoreDefaults: () => {},
    setFullState: () => {},
});

export const SettingsContextProvider: React.FC<React.PropsWithChildren<SettingsState>> = ({
    children,
    activeTab: initialActiveTab,
    exercises: initialExercises,
    wheelSettings: initialWheelSettings,
}) => {
    const [state, dispatch] = React.useReducer(settingsReducer, {
        activeTab: initialActiveTab,
        exercises: initialExercises,
        wheelSettings: initialWheelSettings,
    });

    const { initialized } = useIsInitialized();

    React.useEffect(() => {
        const storage = getStorage();

        if (!initialized || !storage) {
            return;
        }

        storage.setItem(STORAGE_KEYS.activeTab, state.activeTab);
        storage.setItem(STORAGE_KEYS.exercises, JSON.stringify(state.exercises));
        storage.setItem(STORAGE_KEYS.wheelSettings, JSON.stringify(state.wheelSettings));
    }, [state, initialized]);

    // Фильтрация упражнений по активному табу
    const { filteredExercises, visibleExercises } = React.useMemo(() => {
        const filteredExercises =
            state.activeTab === 'all'
                ? state.exercises
                : state.exercises.filter(({ group }) => group === state.activeTab);

        const visibleExercises = filteredExercises.filter(({ isHidden }) => !isHidden);

        return {
            filteredExercises,
            visibleExercises,
        };
    }, [state.activeTab, state.exercises]);

    const addExercise = React.useCallback(
        (name: string) => {
            const trimmedName = name.trim();

            if (!trimmedName) {
                return;
            }

            const newExercise: Exercise = {
                id: Date.now().toString(),
                name: trimmedName,
                group: state.activeTab,
                isHidden: false,
            };

            dispatch({ type: 'ADD_EXERCISE', payload: newExercise });
        },
        [state.activeTab]
    );

    const removeExercise = React.useCallback((id: string) => {
        dispatch({ type: 'REMOVE_EXERCISE', payload: id });
    }, []);

    const toggleExerciseVisibility = React.useCallback((id: string) => {
        dispatch({ type: 'TOGGLE_EXERCISE_VISIBILITY', payload: id });
    }, []);

    const setActiveTab = React.useCallback((tab: MuscleGroup) => {
        dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    }, []);

    const setWheelDuration = React.useCallback((d: WheelSettings['duration']) => {
        dispatch({ type: 'SET_WHEEL_DURATION', payload: d });
    }, []);

    const setWheelRange = React.useCallback((range: WheelSettings['turnoverRange']) => {
        dispatch({ type: 'SET_WHEEL_RANGE', payload: range });
    }, []);

    const restoreDefaults = React.useCallback(() => {
        dispatch({ type: 'RESTORE_DEFAULTS' });
    }, []);

    const setFullState = React.useCallback((s: SettingsState) => {
        dispatch({ type: 'SET_FULL_STATE', payload: s });
    }, []);

    const value = React.useMemo(
        () => ({
            state,
            initialized,
            filteredExercises,
            visibleExercises,
            addExercise,
            removeExercise,
            toggleExerciseVisibility,
            setActiveTab,
            setWheelDuration,
            setWheelRange,
            restoreDefaults,
            setFullState,
        }),
        [
            state,
            initialized,
            filteredExercises,
            visibleExercises,
            addExercise,
            removeExercise,
            toggleExerciseVisibility,
            setWheelDuration,
            setWheelRange,
            restoreDefaults,
            setActiveTab,
            setFullState,
        ]
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
    const context = React.useContext(SettingsContext);

    if (!context) {
        throw new Error('useSettings must be used within a SettingsContextProvider');
    }

    return context;
};
