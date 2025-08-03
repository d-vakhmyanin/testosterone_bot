import React from 'react';
import { RequestBody } from '@/app/utils/request';

import { homeInitialState, homeReducer } from './homeReducer';

import { Exercise, useSettings } from '../../context';

const sendRequest = (body: RequestBody) =>
    fetch('/api/web-app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

export const useHome = () => {
    const [state, dispatch] = React.useReducer(homeReducer, homeInitialState);
    const {
        visibleExercises,
        state: settingsState,
        removeExercise,
        toggleExerciseVisibility,
    } = useSettings();

    const saveButtonText = React.useMemo(() => {
        if (state.isLoading) {
            return 'Сохраняю';
        }

        if (state.isSaved) {
            return 'Сохранил';
        }

        return 'Сохранить';
    }, [state.isLoading, state.isSaved]);

    const handleSpinFinish = React.useCallback((exercise: Exercise) => {
        dispatch({ type: 'OPEN_MODAL', exercise });
    }, []);

    const handleCloseModal = React.useCallback(() => {
        dispatch({ type: 'CLOSE_MODAL' });
    }, []);

    const handleDelete = React.useCallback(() => {
        if (!state.exercise) {
            return;
        }

        removeExercise(state.exercise.id);
        dispatch({ type: 'CLOSE_MODAL' });
    }, [state.exercise, removeExercise]);

    const handleHide = React.useCallback(() => {
        if (!state.exercise) {
            return;
        }

        toggleExerciseVisibility(state.exercise.id);
        dispatch({ type: 'CLOSE_MODAL' });
    }, [state.exercise, toggleExerciseVisibility]);

    const handleSave = React.useCallback(() => {
        if (state.isSaved || state.isLoading || !state.exercise) {
            return;
        }

        dispatch({ type: 'SAVE_START' });

        sendRequest({
            isJoke: false,
            user: window.Telegram?.WebApp?.initDataUnsafe?.user,
            data: { exercise: state.exercise },
        })
            .then(() => {
                dispatch({ type: 'SAVE_SUCCESS' });
            })
            .finally(() => {
                dispatch({ type: 'SAVE_FINISH' });
            });
    }, [state.exercise, state.isSaved, state.isLoading]);

    const handleInfo = React.useCallback(() => {
        if (!state.exercise) {
            return;
        }

        const searchQuery = `Упражнение ${state.exercise.name}. Техника выполнения`;
        const searchUrl = `https://yandex.ru/search/?text=${encodeURIComponent(searchQuery)}`;

        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(searchUrl);
        } else {
            window.open(searchUrl, '_blank');
        }
    }, [state.exercise]);

    const handleStrangeButtonClick = React.useCallback(
        (params: Record<string, string>) => {
            if (!state.exercise) {
                return;
            }

            sendRequest({
                chatId: params.chatId,
                isJoke: true,
                user: window.Telegram?.WebApp?.initDataUnsafe?.user,
                data: { exercise: state.exercise },
            });
        },
        [state.exercise]
    );

    return {
        state,
        visibleExercises,
        settingsState,
        saveButtonText,
        handleSpinFinish,
        handleCloseModal,
        handleDelete,
        handleHide,
        handleInfo,
        handleSave,
        handleStrangeButtonClick,
    };
};
