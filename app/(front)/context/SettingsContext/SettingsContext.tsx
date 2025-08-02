'use client';

import React from 'react';

import { settingsReducer, SettingsState } from './settingsReducer';
import { Exercise, MuscleGroup } from './types';

type SettingsContextType = {
    state: SettingsState;
    filteredExercises: Exercise[];
    visibleExercises: Exercise[];
    addExercise: (name: string) => void;
    removeExercise: (id: string) => void;
    toggleExerciseVisibility: (id: string) => void;
    setActiveTab: (tab: MuscleGroup) => void;
    setFullState: (state: SettingsState) => void;
};

const initialState: SettingsState = {
    exercises: [],
    activeTab: 'all',
};

// Контекст для доступа к настройкам в других компонентах
const SettingsContext = React.createContext<SettingsContextType>({
    state: initialState,
    filteredExercises: [],
    visibleExercises: [],
    addExercise: () => {},
    removeExercise: () => {},
    toggleExerciseVisibility: () => {},
    setActiveTab: () => {},
    setFullState: () => {},
});

export const SettingsContextProvider: React.FC<React.PropsWithChildren<SettingsState>> = ({
    children,
    activeTab: initialActiveTab,
    exercises: initialExercises,
}) => {
    const [state, dispatch] = React.useReducer(settingsReducer, {
        activeTab: initialActiveTab,
        exercises: initialExercises,
    });

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

    const setFullState = React.useCallback((s: SettingsState) => {
        dispatch({ type: 'SET_FULL_STATE', payload: s });
    }, []);

    const value = React.useMemo(
        () => ({
            state,
            filteredExercises,
            visibleExercises,
            addExercise,
            removeExercise,
            toggleExerciseVisibility,
            setActiveTab,
            setFullState,
        }),
        [
            state,
            filteredExercises,
            visibleExercises,
            addExercise,
            removeExercise,
            toggleExerciseVisibility,
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
