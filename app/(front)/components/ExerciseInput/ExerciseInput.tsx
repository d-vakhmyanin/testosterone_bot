'use client';
import React from 'react';

import styles from './ExerciseInput.module.css';

type ExerciseInputProps = {
    handleDone: (value: string) => void;
};

export const ExerciseInput: React.FC<ExerciseInputProps> = ({ handleDone }) => {
    const [newExerciseName, setNewExerciseName] = React.useState('');

    const handleInputChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
        setNewExerciseName(e.target.value);
    }, []);

    // Обработка нажатия Enter в инпуте
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleDone(newExerciseName);
                setNewExerciseName('');
            }
        },
        [handleDone, newExerciseName]
    );

    return (
        <input
            type="text"
            name="exerciseInput"
            value={newExerciseName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Добавить упражнение"
            className={styles.exerciseInput}
            enterKeyHint="done"
            inputMode="text"
        />
    );
};
