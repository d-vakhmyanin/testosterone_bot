import React from 'react';

import styles from './ExerciseList.module.css';

import { Exercise } from '../../context/SettingsContext/types';
import { IconCross } from '../Icons/IconCross';

type ExerciseListProps = {
    exercises: Exercise[];
    handleShowClick: (id: Exercise['id']) => void;
    handleDeleteClick: (id: Exercise['id']) => void;
};

export const ExerciseList: React.FC<ExerciseListProps> = ({
    exercises,
    handleShowClick,
    handleDeleteClick,
}) => {
    return (
        <ul className={styles.exerciseList}>
            {exercises.map((exercise) => (
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
                                    onClick={() => handleShowClick(exercise.id)}
                                    title={exercise.isHidden ? 'Показать' : 'Скрыть'}
                                >
                                    <span className={exercise.isHidden ? styles.hiddenEyeContainer : ''}>
                                        👁️
                                        {exercise.isHidden && <span className={styles.strikeThrough}></span>}
                                    </span>
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteClick(exercise.id)}
                                    title="Удалить"
                                >
                                    <IconCross />
                                </button>
                            </>
                        )}
                    </div>
                </li>
            ))}
            <li className={styles.dummy} />
        </ul>
    );
};
