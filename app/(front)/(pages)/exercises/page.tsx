'use client';
import React from 'react';
import { getStorage, STORAGE_KEYS } from '@/app/utils/storage';

import styles from './exercises.module.css';

import { useSettings } from '../../context';

const ExercisesPage: React.FC = () => {
    const { state, filteredExercises, addExercise, toggleExerciseVisibility, removeExercise } = useSettings();
    const [newExerciseName, setNewExerciseName] = React.useState('');

    React.useEffect(() => {
        const storage = getStorage();

        if (typeof window !== 'undefined' && storage) {
            storage.setItem(STORAGE_KEYS.exercises, JSON.stringify(state.exercises));
            storage.setItem(STORAGE_KEYS.activeTab, state.activeTab);
        }
    }, [state]);

    const handleInputChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
        setNewExerciseName(e.target.value);
    }, []);

    // Обработка нажатия Enter в инпуте
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                addExercise(newExerciseName);
                setNewExerciseName('');
            }
        },
        [addExercise, newExerciseName]
    );

    return (
        <>
            <input
                type="text"
                name="addExerciseInput"
                value={newExerciseName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Добавить упражнение"
                className={styles.exerciseInput}
                enterKeyHint="done"
                inputMode="text"
            />

            {/* Список упражнений */}
            <ul className={styles.exerciseList}>
                {filteredExercises.map((exercise) => (
                    <li
                        key={exercise.id}
                        className={`${styles.exerciseItem} ${exercise.isHidden ? styles.hidden : ''}`}
                    >
                        <span>{exercise.name}</span>

                        <div className={styles.exerciseActions}>
                            {exercise.isProtected ? null : (
                                <>
                                    <button
                                        className={styles.visibilityButton}
                                        onClick={() => toggleExerciseVisibility(exercise.id)}
                                        title={exercise.isHidden ? 'Показать' : 'Скрыть'}
                                    >
                                        <span className={exercise.isHidden ? styles.hiddenEyeContainer : ''}>
                                            👁️
                                            {exercise.isHidden && (
                                                <span className={styles.strikeThrough}></span>
                                            )}
                                        </span>
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => removeExercise(exercise.id)}
                                        title="Удалить"
                                    >
                                        ❌
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ExercisesPage;
