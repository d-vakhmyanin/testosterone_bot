'use client';
import React from 'react';

import { useSettings } from '../../../context';
import { ExerciseList } from '../../../components/ExerciseList/ExerciseList';
import { ExerciseInput } from '../../../components/ExerciseInput/ExerciseInput';

const ExercisesPage: React.FC = () => {
    const { filteredExercises, addExercise, toggleExerciseVisibility, removeExercise } = useSettings();

    return (
        <>
            <ExerciseInput handleDone={addExercise} />

            <ExerciseList
                exercises={filteredExercises}
                handleShowClick={toggleExerciseVisibility}
                handleDeleteClick={removeExercise}
            />
        </>
    );
};

export default ExercisesPage;
